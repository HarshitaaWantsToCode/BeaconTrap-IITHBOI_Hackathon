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

@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: UUID, db: AsyncSession = Depends(get_db)):
    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
    return case_obj

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
