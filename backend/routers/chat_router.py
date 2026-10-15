from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI
import os

router = APIRouter(prefix="/api", tags=["Chat"])

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.environ.get("NVIDIA_API_KEY")
)

class ChatRequest(BaseModel):
    prompt: str
    model_name: str = "meta/llama-3.1-70b-instruct"

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model=request.model_name,
            messages=[{"role": "user", "content": request.prompt}],
            temperature=0.4,
            max_tokens=1024
        )
        return {"result": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
