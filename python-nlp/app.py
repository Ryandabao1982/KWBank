from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class DedupeRequest(BaseModel):
    importId: str

class DedupeResponse(BaseModel):
    importId: str
    duplicates_found: int

@app.post('/dedupe', response_model=DedupeResponse)
async def dedupe(req: DedupeRequest):
    # placeholder: real dedupe would analyze import data
    return DedupeResponse(importId=req.importId, duplicates_found=0)
