from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from backend.app.core.database import get_db
from backend.app.services.case_service import CaseService

router = APIRouter()

class CaseResponse(BaseModel):
    id: UUID
    case_number: str
    sha256: str
    filename: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

@router.get("", response_model=List[CaseResponse])
async def get_cases(
    page: int = 1,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    service = CaseService(db)
    offset = (page - 1) * limit
    return await service.list_cases(skip=offset, limit=limit)

@router.get("/{case_id}")
async def get_case(case_id: UUID, db: AsyncSession = Depends(get_db)):
    # Check artifact storage for saved payload
    from backend.app.services.artifact_service import ArtifactService
    art_service = ArtifactService()
    try:
        if art_service.use_fallback:
            import os, json
            path = os.path.join("local_artifacts", str(case_id), "case_payload.json")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
    except Exception:
        pass

    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
        
    if case_obj.evidence_json and isinstance(case_obj.evidence_json, dict) and "full_payload" in case_obj.evidence_json:
        return case_obj.evidence_json["full_payload"]

    return {
        "id": str(case_obj.id),
        "case_number": case_obj.case_number,
        "sha256": case_obj.sha256,
        "filename": case_obj.filename,
        "status": case_obj.status,
        "created_at": case_obj.created_at.isoformat() if case_obj.created_at else None
    }


@router.post("/{case_id}/reanalyze")
async def reanalyze_case(case_id: UUID, db: AsyncSession = Depends(get_db)):
    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
    
    case_obj.status = "queued"
    await db.commit()
    return {"success": True, "message": "Reanalysis job queued"}

@router.delete("/{case_id}")
async def delete_case(case_id: UUID, db: AsyncSession = Depends(get_db)):
    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
        
    await service.repo.delete(case_obj)
    return {"success": True, "message": "Case deleted successfully"}
