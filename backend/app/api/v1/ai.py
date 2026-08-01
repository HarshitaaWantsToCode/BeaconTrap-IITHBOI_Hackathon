import os
import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from uuid import UUID
from backend.app.core.database import get_db
from backend.app.services.case_service import CaseService
from backend.app.services.artifact_service import ArtifactService

router = APIRouter()

@router.get("/{case_id}")
async def get_ai_results(case_id: UUID, db: AsyncSession = Depends(get_db)):
    art_service = ArtifactService()
    try:
        if art_service.use_fallback:
            path = os.path.join("local_artifacts", str(case_id), "threat_narrative.json")
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    narrative = json.load(f)
                return {
                    "case_id": str(case_id),
                    "threat_narrative": narrative
                }
        else:
            response = art_service.client.get_object("artifacts", f"{case_id}/threat_narrative.json")
            narrative = json.loads(response.read().decode("utf-8"))
            response.close()
            response.release_conn()
            return {
                "case_id": str(case_id),
                "threat_narrative": narrative
            }
    except Exception:
        pass

    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
        
    return {
        "case_id": str(case_id),
        "threat_narrative": getattr(case_obj, "threatNarrative", None) or {
            "summary": "AI processing pipeline active. Ingesting static manifest details...",
            "threat_family": "Analyzing...",
            "technical_details": "Heuristic engines executing.",
            "c2_servers": []
        }
    }

@router.get("/{case_id}/status")
async def get_ai_status(case_id: UUID, db: AsyncSession = Depends(get_db)):
    art_service = ArtifactService()
    has_narrative = False
    try:
        if art_service.use_fallback:
            path = os.path.join("local_artifacts", str(case_id), "threat_narrative.json")
            has_narrative = os.path.exists(path)
        else:
            stat = art_service.client.stat_object("artifacts", f"{case_id}/threat_narrative.json")
            has_narrative = stat is not None
    except Exception:
        pass

    if has_narrative:
        return {
            "case_id": str(case_id),
            "status": "completed"
        }

    service = CaseService(db)
    case_obj = await service.get_case(case_id)
    if not case_obj:
        raise HTTPException(status_code=404, detail="Case not found")
        
    return {
        "case_id": str(case_id),
        "status": "completed" if (getattr(case_obj, "threatNarrative", None) is not None) else "pending"
    }

