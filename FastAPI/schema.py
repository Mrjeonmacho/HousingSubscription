from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    noticeNo: str

class ChatResponse(BaseModel):
    message: str
