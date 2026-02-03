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

from constants import SOURCE_MAP

async def get_rag_answer(user_question: str, collection, noticeNo: str):
    """RAG 파이프라인을 실행하여 사용자의 질문에 답변합니다."""

    # 0. noticeNo를 실제 이름으로 변환
    source_name = SOURCE_MAP.get(noticeNo, noticeNo)

    # 1. 유사도 검색 (가장 관련 있는 1개 청크 확보)
    if collection is None:
        return "죄송합니다. 현재 데이터베이스에 연결할 수 없어 답변을 드릴 수 없습니다."

    where_clause = {"noticeNo": noticeNo}
    results = collection.query(
        query_texts=[user_question],
        n_results=1,
        where=where_clause,
        include=["documents", "metadatas", "distances"]
    )
    is_relevant_result = False
    if results and results['ids'] and results['ids'][0]:
        # 결과가 있을 경우, 유사도 임계값(Threshold) 확인
        if results['distances'][0][0] <= 0.6:
            is_relevant_result = True

    # 2. 검색 결과 유효성 검사 및 분기
    if not is_relevant_result:
        # 2-1. 검색 결과가 없거나 관련성이 낮을 경우: 일반적인 답변 생성
        general_prompt_template = ChatPromptTemplate.from_messages([
            ("system", (
                "답변 제일 첫문장에 '해당 질문은 서울집사 서비스에서 찾기 어려워 정확성이 떨어질 수 있습니다.' 이 문장을 꼭 넣어줘 왜냐하면 여기 조건문은 db에 질문이랑 매칭되지 않아서 질문 자체를 gms를 통해 답변하는거니까."
                "당신은 AI 챗봇 '서울집사'입니다. "
                "사용자의 질문에 대해 당신이 아는 정보를 바탕으로 최대한 친절하고 상세하게 답변해주세요. "
                "모든 답변은 '순수 평문(Plain Text)'으로만 작성해야 합니다. "
                "절대로 별표(*), 특수기호(#), 대시(-) 등을 사용한 마크다운 형식을 쓰지 마세요. "
                "강조가 필요하다면 괄호 [ ] 를 사용하거나 줄바꿈을 활용하세요. "
                "목록을 나열할 때는 1. 2. 3. 처럼 숫자와 마침표만 사용하세요. "
                "챗봇 형태이기 때문에 짧으면 한문장, 길면 5문장 이내로 압축해서 핵심적이고 읽기 쉽게 만들어줘 마무리로"
            )),
            ("human", "{question}")
        ])
        full_prompt = general_prompt_template.format(question=user_question)
        return await call_gemini_api(full_prompt)
    else:
        # 2-2. 검색 결과가 유효할 경우: RAG 답변 생성
        # 3. 문맥 확장 (슬라이딩 윈도우 방식으로 주변 텍스트 병합)
        best_id = results['ids'][0][0]
        final_context = expand_context(best_id, collection)

        # 4. 프롬프트 구성 (시스템 역할을 통한 전문가 페르소나 부여)
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", (
                "당신은 AI 챗봇 '서울집사'입니다. "
                "당신의 임무는 오직 주어진 '내용'({source_folder} 공고)에 대해서만 사실에 기반하여 정확하게 답변하는 것입니다. "
                "절대로 '내용'에 없는 정보나 당신의 외부 지식을 사용해서는 안 됩니다. "
                "주어진 '내용'에 질문에 대한 답이 없다면, '주어진 내용에서는 해당 정보를 찾을 수 없습니다'라고 솔직하게 답변하세요. "
                "답변은 친절한 전문가의 말투로 설명해주세요. "
                "답변 마지막에는 정보의 출처인 '{source_folder}'를 명시해주세요. "
                "모든 답변은 '순수 평문(Plain Text)'으로만 작성해야 합니다. "
                "절대로 별표(*), 특수기호(#), 대시(-) 등을 사용한 마크다운 형식을 쓰지 마세요. "
                "강조가 필요하다면 괄호 [ ] 를 사용하거나 줄바꿈을 활용하세요. "
                "목록을 나열할 때는 1. 2. 3. 처럼 숫자와 마침표만 사용하세요. "
                "챗봇 형태이기 때문에 짧으면 한문장, 길면 5문장 이내로 압축해서 핵심적이고 읽기 쉽게 만들어줘 마무리로"
            )),
            ("human", "내용:\n{context}\n\n질문: {question}")
        ])
        full_prompt = prompt_template.format(context=final_context, question=user_question, source_folder=source_name)

        # 5. Gemini API 호출 (비동기 처리)
        return await call_gemini_api(full_prompt)
