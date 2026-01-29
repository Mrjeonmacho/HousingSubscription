import os
import json
import httpx # 비동기 HTTP 통신을 위해 추천
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

async def get_rag_answer(user_question: str, collection):
    # 1. 유사도 검색 (가장 관련 있는 1개 청크 확보)
    results = collection.query(
        query_texts=[user_question],
        n_results=1,
        include=["documents", "metadatas"]
    )

    if not results['ids'][0]:
        return "죄송합니다. 해당 질문과 관련된 공고 정보를 찾을 수 없습니다."

    # 2. 문맥 확장 (슬라이딩 윈도우 방식으로 주변 텍스트 병합)
    best_id = results['ids'][0][0]
    source_folder = results['metadatas'][0][0].get('source', '알 수 없는 공고')

    final_context = expand_context(best_id, collection)

    # 3. 프롬프트 구성 (시스템 역할을 통한 전문가 페르소나 부여)
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", f"당신은 주거 복지 전문가입니다. 반드시 '{source_folder}' 자료를 바탕으로 답변하세요."),
        ("human", "내용:\n{context}\n\n질문: {question}")
    ])
    full_prompt = prompt_template.format(context=final_context, question=user_question)

    # 4. Gemini API 호출 (비동기 처리)
    return await call_gemini_api(full_prompt)

def expand_context(best_id, collection):
    # ID 기반으로 앞뒤 2개씩 총 5개의 청크를 가져와 문맥을 완성합니다.
    parts = best_id.rsplit('_', 1)
    id_prefix = parts[0]
    current_idx = int(parts[1])

    window_ids = [f"{id_prefix}_{i}" for i in range(max(1, current_idx - 2), current_idx + 3)]
    retrieved_data = collection.get(ids=window_ids)
    return "\n\n".join(retrieved_data['documents'])

async def call_gemini_api(prompt_text):
    gms_key = os.getenv("GMS_KEY")
    url = os.getenv("GMS_URL")

    headers = {"Content-Type": "application/json", "x-goog-api-key": gms_key}
    payload = {
        "contents": [{"parts": [{"text": prompt_text}]}],
        "generationConfig": {"temperature": 0.1, "maxOutputTokens": 2000}
    }

    # httpx를 사용하여 Non-blocking으로 API 호출
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        result = response.json()
        return result['candidates'][0]['content']['parts'][0]['text'].strip()
    else:
        return f"답변 생성 중 오류가 발생했습니다. (코드: {response.status_code})"