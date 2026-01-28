from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# 1. 앱 생성
app = FastAPI()

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

# 3. Pydantic 모델 정의
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str

# 4. 테스트용 API
@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

# 5. 챗봇 API
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    # 여기에서 실제 챗봇 로직을 수행합니다.
    # 지금은 받은 메시지를 그대로 반환합니다.
    return ChatResponse(message=f"FastAPI received: {request.message}")