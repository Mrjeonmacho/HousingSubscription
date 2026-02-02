import os
import chromadb
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from chromadb.utils import embedding_functions

from schema import ChatRequest, ChatResponse
from chatbot_service import get_rag_answer

# 전역 상태 저장소
app_state = {}

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

# # 로컬 상황
# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     # 1. 임베딩 모델 로드 (동일)
#     app_state["ko_embedding"] = embedding_functions.SentenceTransformerEmbeddingFunction(
#         model_name="jhgan/ko-sroberta-multitask"
#     )
#
#     # 2. 로컬 크로마DB 폴더 연결 (수정된 부분)
#     # db_path는 실제 크로마DB 폴더가 있는 경로로 지정하세요. (예: "./chroma_db")
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
#
#     yield
#     app_state.clear()


# 1. 앱 생성
app = FastAPI(lifespan=lifespan)

# 2. CORS 설정 (React가 접근할 수 있게 허용)
# 원래는 ["http://localhost:3000"] 처럼 특정 주소만 적는 게 정석이지만,
# 개발 중에는 ["*"]로 모든 곳을 허용하는 게 편합니다.
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 4. 챗봇 API
@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # 서비스 레이어 호출: 메모리에 상주된 collection을 전달합니다.
    # answer = get_rag_answer(request.message, app_state["collection"])
    # return ChatResponse(message=answer)

    # 비동기 환경에서 원활하게 돌아가도록 await 적용 가능하게 구성
    answer = await get_rag_answer(request.message, app_state["collection"])
    return ChatResponse(message=answer)

# 5. 챗봇 API 테스트
@app.post("/chattest", response_model=ChatResponse)
def chat(request: ChatRequest):
    return ChatResponse(message=f"FastAPI received test : {request.message}")