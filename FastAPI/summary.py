import os
import httpx
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

async def call_summary_gemini_api(prompt_text: str):
    """
    요약 기능 전용 Gemini API 호출 함수.
    generationConfig가 없는 payload를 사용합니다.
    """
    gms_key = os.getenv("GMS_KEY")
    url = os.getenv("GMS_URL")

    headers = {"Content-Type": "application/json", "x-goog-api-key": gms_key}
    # generationConfig가 없는 payload
    payload = {
        "contents": [{"parts": [{"text": prompt_text}]}]}
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            result = response.json()
            if 'candidates' in result and result['candidates']:
                return result['candidates'][0]['content']['parts'][0]['text'].strip()
            return "API 응답이 비어있습니다. 다시 시도해주세요."
        except httpx.HTTPStatusError as e:
            print(f"!!! Gemini API Error (Summary): {e}")
            print(f"!!! Response Body (Summary): {e.response.text}")
            return f"답변 생성 중 오류가 발생했습니다. (HTTP 상태 코드: {e.response.status_code})"
        except Exception as e:
            print(f"!!! An Unexpected Error Occurred (Summary): {e}")
            return f"답변 생성 중 예상치 못한 오류가 발생했습니다: {str(e)}"

CHUNK_LIMIT = 15

# title를 기반으로 DB에서 모든 문서를 가져와 합치는 함수
def get_full_text(title: str, collection):
    """
    특정 title에 해당하는 모든 문서를 데이터베이스에서 가져와 하나의 문자열로 합칩니다.
    """
    retrieved_data = collection.get(where={"title": title}, include=['documents'])

    if not retrieved_data or not retrieved_data.get('documents'):
        return None

    limited_documents = retrieved_data['documents'][:CHUNK_LIMIT]
    full_text = "\n\n".join(limited_documents)
    return full_text

# 요약 프롬프트를 생성하고 Gemini API를 호출하는 함수
async def get_summary_from_gms(full_text: str):
    """
    주어진 전체 텍스트를 Gemini API를 통해 요약합니다.
    """

    summarize_prompt_template = ChatPromptTemplate.from_messages([
        ("system", "당신은 주어진 장문의 글을 한국어로 핵심만 간추려 10 문장 이내로 요약하는 전문 요약봇입니다."
                   "이 공고가 어떤 공고인지 요약해서 현재 텍스트에서 설명할줄 알아야 합니다"
                   "요약본이니 글이 챗봇처럼 안짧아도 됩니다. 처음본 사람이 이해가 되야합니다"
                   
                   
                   "모든 답변은 마크다운 기호 사용을 해야합니다. 그래서 강조하거나 이모티콘을 넣어 가독성을 꼭 좋게 답변을 만드세요. "
                   "정보의 가독성을 높이기 위해 반드시 마크다운(Markdown) 형식을 사용하세요.\n"
                   
                   
                   "1. 주요 섹션 제목은 '### 📅 제목' 처럼 헤더(#)와 이모지를 조합해서 작성하세요.\n"
                   "2. 핵심 수치나 날짜는 **강조(Bold)** 처리하세요. 프론트에서 처리하는데 강조 하는 앞뒤로 작은 따옴표 ' 이게 들어가면 강조가 되지않고 문자 그대로 ** 보이니 강조하는 단어에는 따옴표 넣지 마세요 \n"
                   "3. 나열할 정보가 있다면 숫자나 글머리 기호를 사용하여 구분하세요.\n"

                   "강조가 필요하다면 괄호 [ ] 를 사용하거나 줄바꿈을 활용하세요. "
                   "목록을 나열할 때는 1. 2. 3. 처럼 숫자와 마침표만 사용하세요. "),
        ("human", "{text_to_summarize}")
    ])
    
    prompt = summarize_prompt_template.format(text_to_summarize=full_text)
    
    # 새로운 전용 API 호출 함수 사용
    summary = await call_summary_gemini_api(prompt)
    return summary
