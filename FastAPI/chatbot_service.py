import os
import json
import httpx # 비동기 HTTP 통신을 위해 추천
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

async def call_gemini_api(prompt_text):
    """Gemini API를 호출하는 공통 함수"""
    gms_key = os.getenv("GMS_KEY")
    url = os.getenv("GMS_URL")

    headers = {"Content-Type": "application/json", "x-goog-api-key": gms_key}
    payload = {
        "contents": [{"parts": [{"text": prompt_text}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 3000}
    }

    # httpx를 사용하여 Non-blocking으로 API 호출
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status() # 200번대 응답이 아니면 예외 발생
            result = response.json()
            # API 응답 구조에 'candidates'가 없을 경우를 대비한 안전 장치
            if 'candidates' in result and result['candidates']:
                return result['candidates'][0]['content']['parts'][0]['text'].strip()
            return "API 응답이 비어있습니다. 다시 시도해주세요."
        except httpx.HTTPStatusError as e:
            return f"답변 생성 중 오류가 발생했습니다. (HTTP 상태 코드: {e.response.status_code})"
        except Exception as e:
            return f"답변 생성 중 예상치 못한 오류가 발생했습니다: {str(e)}"

async def is_relevant_question(user_question: str) -> bool:
    # 1. 프롬프트 정의: 전문가 페르소나 + 구체적 범주 + 예시(Few-shot)
    prompt = (
        "당신은 사용자의 질문이 '서울시 주거 복지/정책'과 관련 있는지 판단하는 정밀 분류기입니다.\n\n"
        " [판단 기준]\n"
        "1. 주택 공급: 행복주택, 청년안심주택, 장기전세, SH/LH 공고 등\n"
        "2. 지원 정책: 보증금 지원, 이자 지원, 월세 지원 등\n"
        "3. 절차 및 요건: 신청 방법, 자격 요건, 소득 기준, 자산 기준, 서류 등\n"
        "4. 금융: 전세자금대출, 버팀목, 디딤돌 등 주거 관련 대출\n\n"
        " [주의사항]\n"
        "- '신청 방법', '자격 요건' 처럼 목적어가 생략된 짧은 단어도 주거 관련 맥락으로 간주하여 '1'을 반환하세요.\n"
        "- 질문의 의도가 위 범주에 하나라도 해당하면 무조건 '1', 전혀 상관없으면 '0'을 반환하세요.\n"
        "- 설명 없이 숫자 '1' 또는 '0'만 출력하세요.\n\n"
        " [예시]\n"
        "- 질문: 신청 방법 -> 결과: 1\n"
        "- 질문: 자격 요건이 뭐야? -> 결과: 1\n"
        "- 질문: 소득 기준 알려줘 -> 결과: 1\n"
        "- 질문: 오늘 점심 메뉴 추천 -> 결과: 0\n"
        "- 질문: 파이썬 코드 짜줘 -> 결과: 0\n\n"
        f"질문: \"{user_question}\"\n"
        "결과:"
    )

    response = await call_gemini_api(prompt)

    # 2. 결과 파싱 로직: 숫자만 추출하여 판단 (가장 안전함)
    clean_response = "".join(filter(str.isdigit, response))
    return "1" in clean_response

def expand_context(best_id, collection):
    """ID를 기반으로 앞뒤 2개씩 총 5개의 청크를 가져와 문맥을 완성합니다."""
    parts = best_id.rsplit('_', 1)
    id_prefix = parts[0]
    current_idx = int(parts[1])

    # 가져올 청크 ID 범위를 계산 (인덱스가 1 미만이 되지 않도록 방지)
    start_idx = max(1, current_idx - 2)
    end_idx = current_idx + 2

    window_ids = [f"{id_prefix}_{i}" for i in range(start_idx, end_idx + 1)]

    retrieved_data = collection.get(ids=window_ids, include=['documents'])

    # 순서를 보장하며 문서를 결합
    documents_dict = {doc_id: doc_text for doc_id, doc_text in zip(retrieved_data['ids'], retrieved_data['documents'])}
    sorted_documents = [documents_dict[doc_id] for doc_id in window_ids if doc_id in documents_dict]

    return "\n\n".join(sorted_documents)

async def get_rag_answer(user_question: str, collection):
    """RAG 파이프라인을 실행하여 사용자의 질문에 답변합니다."""

    # 1. (추가된 로직) 질문 의도 파악
    if not await is_relevant_question(user_question):
        return "죄송합니다. 저는 서울시 주거 정책, 주택 공급, 청약 관련 질문에 대해서만 답변드릴 수 있습니다. 관련 질문을 해주시겠어요?"

    # 2. 유사도 검색 (가장 관련 있는 1개 청크 확보)
    if collection is None:
        return "죄송합니다. 현재 데이터베이스에 연결할 수 없어 답변을 드릴 수 없습니다."

    results = collection.query(
        query_texts=[user_question],
        n_results=1,
        include=["documents", "metadatas"]
    )

    if not results or not results['ids'] or not results['ids'][0]:
        return "죄송합니다. 해당 질문과 관련된 공고 정보를 찾을 수 없습니다."

    # 3. 문맥 확장 (슬라이딩 윈도우 방식으로 주변 텍스트 병합)
    best_id = results['ids'][0][0]
    source_folder = results['metadatas'][0][0].get('source', '알 수 없는 공고')

    final_context = expand_context(best_id, collection)

    # 4. 프롬프트 구성 (시스템 역할을 통한 전문가 페르소나 부여)
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", (
            "당신은 서울시 주거 복지 전문가 AI 챗봇 '서울집사'입니다. "
            "SH공사 및 서울시의 청년, 신혼부부 주거 지원 정책을 종합하여 솔루션을 제공합니다. "
            "답변은 반드시 주어진 '내용'을 바탕으로, 딱딱하지 않고 친절한 전문가의 말투로 설명해주세요. "
            "답변 마지막에는 정보의 출처인 '{source_folder}'를 명시해주세요. "
            "모든 답변은 '순수 평문(Plain Text)'으로만 작성해야 합니다. "
            "절대로 별표(*), 특수기호(#), 대시(-) 등을 사용한 마크다운 형식을 쓰지 마세요. "
            "강조가 필요하다면 괄호 [ ] 를 사용하거나 줄바꿈을 활용하세요. "
            "목록을 나열할 때는 1. 2. 3. 처럼 숫자와 마침표만 사용하세요. "
        )),
        ("human", "내용:\n{context}\n\n질문: {question}")
    ])
    full_prompt = prompt_template.format(context=final_context, question=user_question, source_folder=source_folder)

    # 5. Gemini API 호출 (비동기 처리)
    return await call_gemini_api(full_prompt)
