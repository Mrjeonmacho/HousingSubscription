import os
import chromadb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb.utils import embedding_functions

from schema import ChatRequest, ChatResponse, SummaryRequest, SummaryResponse
from chatbot import get_rag_answer
from summary import get_full_text, get_summary_from_gms

# 전역 상태 저장소
app_state = {}

# 로컬 상황
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # 1. 임베딩 모델 로드 (동일)
#     app_state["ko_embedding"] = embedding_functions.SentenceTransformerEmbeddingFunction(
#         model_name="jhgan/ko-sroberta-multitask"
#     )
#
#     # 2. 로컬 크로마DB 폴더 연결 (수정된 부분)
#     db_path = os.getenv("CHROMA_DB_PATH", "./chroma_db")
#
#     try:
#         # HttpClient 대신 PersistentClient 사용!
#         client = chromadb.PersistentClient(path=db_path)
#
#         app_state["collection"] = client.get_collection(
#             name="happy_house_rag",
#             embedding_function=app_state["ko_embedding"]
#         )
#     except Exception as e:
#         print(f"DB 연결 실패: {e}")
#         app_state["collection"] = None

    # yield
    # app_state.clear()


# 배포 상황
@asynccontextmanager
async def lifespan(app: FastAPI):
    # 한국어 전용 모델 로드 (서버 켜져 있는 동안 유지)
    app_state["ko_embedding"] = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="jhgan/ko-sroberta-multitask"
    )

    # DB 연결 및 컬렉션 로드
    # 환경변수가 없으면 기본값(localhost, 8000)을 쓰도록 설정 (안전장치)
    chroma_host = os.getenv("CHROMA_HOST", "localhost")
    chroma_port = os.getenv("CHROMA_PORT", "8000")
    try:
        client = chromadb.HttpClient(host=chroma_host, port=int(chroma_port))
        app_state["collection"] = client.get_collection(
            name="happy_house_rag",
            embedding_function=app_state["ko_embedding"]
        )
    except Exception as e:
        # 실패 시 빈 껍데기라도 만들거나 에러를 발생시켜야 함 (상황에 따라 처리)
        app_state["collection"] = None

    yield
    # 서버 종료 시 정리 로직 (필요할 경우)
    app_state.clear()


# 1. 앱 생성
app = FastAPI(lifespan=lifespan)

# 2. CORS 설정
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 3. 챗봇 API
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    answer = await get_rag_answer(request.message, app_state["collection"], request.title)
    return ChatResponse(message=answer)

# 4. 요약 API
@app.post("/summary", response_model=SummaryResponse)
async def summarize_notice(request: SummaryRequest):
    # 1. DB에서 title에 해당하는 전체 텍스트 가져오기
    full_text = get_full_text(request.title, app_state["collection"])

    if not full_text:
        return SummaryResponse(summary="해당 공고의 내용을 찾을 수 없어 요약할 수 없습니다.")
        
    # 2. Gemini를 통해 텍스트 요약하기
    summary_text = await get_summary_from_gms(full_text)
    
    # 3. 요약된 텍스트 반환
    return SummaryResponse(summary=summary_text)
