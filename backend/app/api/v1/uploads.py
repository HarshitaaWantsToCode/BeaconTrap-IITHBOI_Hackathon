import hashlib
from io import BytesIO
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.core.database import get_db
from backend.app.services.case_service import CaseService
from backend.app.services.artifact_service import ArtifactService
from backend.app.core.queue import publish_job

router = APIRouter()

@router.post("")
async def upload_apk(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    if not file.filename.endswith(".apk"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Only .apk files are allowed."
        )
    
    # Read bytes to calculate SHA-256
    file_bytes = await file.read()
    sha256_hash = hashlib.sha256(file_bytes).hexdigest()
    
    # Reset read pointer
    await file.seek(0)
    
    # Save case in database
    service = CaseService(db)
    new_case = await service.create_case(filename=file.filename, sha256=sha256_hash)
    
    # Upload binary file to MinIO object storage tier
    artifact_service = ArtifactService()
    object_key = f"apks/{new_case.id}.apk"
    
    if artifact_service.use_fallback:
        import os
        path = os.path.join("local_artifacts", "apks")
        os.makedirs(path, exist_ok=True)
        with open(os.path.join(path, f"{new_case.id}.apk"), "wb") as f:
            f.write(file_bytes)
    else:
        try:
            artifact_service.client.put_object(
                "artifacts",
                object_key,
                BytesIO(file_bytes),
                length=len(file_bytes),
                content_type="application/vnd.android.package-archive"
            )
        except Exception as e:
            # Fallback
            import os
            path = os.path.join("local_artifacts", "apks")
            os.makedirs(path, exist_ok=True)
            with open(os.path.join(path, f"{new_case.id}.apk"), "wb") as f:
                f.write(file_bytes)

    # Publish job to RabbitMQ queue with binary storage reference
    job_payload = {
        "case_id": str(new_case.id),
        "filename": file.filename,
        "sha256": sha256_hash,
        "storage_path": object_key
    }
    publish_job("static_analysis", job_payload)
    
    return {
        "case_id": str(new_case.id),
        "sha256": sha256_hash,
        "storage_path": object_key,
        "status": "queued"
    }

