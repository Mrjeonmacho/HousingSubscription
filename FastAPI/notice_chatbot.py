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

async def get_rag_answer(user_question: str, collection, noticeNo: str):
    """RAG 파이프라인을 실행하여 사용자의 질문에 답변합니다."""

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

    if not results or not results['ids'] or not results['ids'][0]:
        return "죄송합니다. 해당 질문과 관련된 공고 정보를 찾을 수 없습니다."

    # // 아래 주석을 해제하여 유사도 임계값(Threshold)을 적용할 수 있습니다.
    # // L2 거리 기준으로, 값이 작을수록 유사하며 보통 1.2 미만일 때 관련성이 있다고 판단합니다.
    # if results['distances'][0][0] > 1.2:
    #     return "죄송합니다. 그 질문에 대한 정보는 현재 공고 내용에서 찾을 수 없습니다."

    # 3. 문맥 확장 (슬라이딩 윈도우 방식으로 주변 텍스트 병합)
    best_id = results['ids'][0][0]
    source_folder = noticeNo

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
        )),
        ("human", "내용:\n{context}\n\n질문: {question}")
    ])
    full_prompt = prompt_template.format(context=final_context, question=user_question, source_folder=source_folder)

    # 5. Gemini API 호출 (비동기 처리)
    return await call_gemini_api(full_prompt)
