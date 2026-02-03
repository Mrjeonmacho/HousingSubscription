from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    title: str

class ChatResponse(BaseModel):
    message: str

class SummaryRequest(BaseModel):
    title: str

class SummaryResponse(BaseModel):
    summary: str