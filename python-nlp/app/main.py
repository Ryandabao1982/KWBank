from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import jellyfish

app = FastAPI(
    title="KWBank NLP Service",
    description="Natural Language Processing service for keyword deduplication and analysis",
    version="1.0.0"
)

class KeywordItem(BaseModel):
    id: str
    text: str
    normalized_text: str

class DedupeRequest(BaseModel):
    keywords: List[KeywordItem]
    threshold: Optional[float] = 0.85
    algorithm: Optional[str] = "jaro_winkler"

class DuplicateGroup(BaseModel):
    representative: KeywordItem
    duplicates: List[KeywordItem]
    similarity_scores: List[float]

class DedupeResponse(BaseModel):
    duplicate_groups: List[DuplicateGroup]
    total_keywords: int
    total_duplicates: int

@app.get("/")
def read_root():
    return {
        "service": "KWBank NLP Service",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/dedupe", response_model=DedupeResponse)
def deduplicate_keywords(request: DedupeRequest):
    """
    Find duplicate keywords using fuzzy string matching.
    
    Supported algorithms:
    - jaro_winkler: Jaro-Winkler similarity (default)
    - levenshtein: Levenshtein distance
    """
    keywords = request.keywords
    threshold = request.threshold
    algorithm = request.algorithm
    
    if not keywords:
        return DedupeResponse(
            duplicate_groups=[],
            total_keywords=0,
            total_duplicates=0
        )
    
    # Find duplicates using fuzzy matching
    duplicate_groups = []
    processed = set()
    
    for i, kw1 in enumerate(keywords):
        if kw1.id in processed:
            continue
            
        group_duplicates = []
        scores = []
        
        for j, kw2 in enumerate(keywords):
            if i == j or kw2.id in processed:
                continue
                
            # Calculate similarity
            if algorithm == "jaro_winkler":
                similarity = jellyfish.jaro_winkler_similarity(
                    kw1.normalized_text, 
                    kw2.normalized_text
                )
            elif algorithm == "levenshtein":
                # Convert levenshtein distance to similarity
                distance = jellyfish.levenshtein_distance(
                    kw1.normalized_text,
                    kw2.normalized_text
                )
                max_len = max(len(kw1.normalized_text), len(kw2.normalized_text))
                similarity = 1 - (distance / max_len) if max_len > 0 else 0
            else:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported algorithm: {algorithm}"
                )
            
            if similarity >= threshold and similarity < 1.0:
                group_duplicates.append(kw2)
                scores.append(similarity)
                processed.add(kw2.id)
        
        if group_duplicates:
            duplicate_groups.append(DuplicateGroup(
                representative=kw1,
                duplicates=group_duplicates,
                similarity_scores=scores
            ))
            processed.add(kw1.id)
    
    total_duplicates = sum(len(group.duplicates) for group in duplicate_groups)
    
    return DedupeResponse(
        duplicate_groups=duplicate_groups,
        total_keywords=len(keywords),
        total_duplicates=total_duplicates
    )

@app.post("/similarity")
def calculate_similarity(text1: str, text2: str, algorithm: str = "jaro_winkler"):
    """
    Calculate similarity score between two strings.
    """
    if algorithm == "jaro_winkler":
        score = jellyfish.jaro_winkler_similarity(text1, text2)
    elif algorithm == "levenshtein":
        distance = jellyfish.levenshtein_distance(text1, text2)
        max_len = max(len(text1), len(text2))
        score = 1 - (distance / max_len) if max_len > 0 else 0
    else:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported algorithm: {algorithm}"
        )
    
    return {
        "text1": text1,
        "text2": text2,
        "algorithm": algorithm,
        "similarity": score
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
