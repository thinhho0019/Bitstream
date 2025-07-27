from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.pipeline import Pipeline
from app.schemas.pipelines import PipelineCreate, PipelineOut

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/pipelines", response_model=PipelineOut)
def create_pipeline(pipeline: PipelineCreate, db: Session = Depends(get_db)):
    try:
        db_pipeline = Pipeline(name=pipeline.name, description=pipeline.description)
        db.add(db_pipeline)
        db.commit()
        db.refresh(db_pipeline)
        return db_pipeline
    except Exception as e:
        print(f"❌ Error in list_pipelines: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving pipelines: {str(e)}",
        )


@router.get("/pipelines", response_model=list[PipelineOut])
def list_pipelines(db: Session = Depends(get_db)):
    try:
        pipelines = db.query(Pipeline).all()
        return pipelines
    except Exception as e:
        # In log server
        print(f"❌ Error in list_pipelines: {e}")
        # Trả lỗi có thông báo cụ thể cho client
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving pipelines: {str(e)}",
        )


@router.put("/pipelines/{pipeline_id}", response_model=PipelineOut)
def update_pipelines(
    pipeline_id: int, pipeline_data: PipelineCreate, db: Session = Depends(get_db)
):
    pipeline = db.query(Pipeline).get(pipeline_id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    pipeline.name = pipeline_data.name
    pipeline.description = pipeline_data.description
    db.commit()
    db.refresh(pipeline)
    return pipeline


@router.delete("/pipelines/{pipeline_id}")
def delete_pipelines(pipeline_id: int, db: Session = Depends(get_db)):
    pipeline = db.query(Pipeline).get(pipeline_id)
    if not pipeline:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    db.delete(pipeline)
    db.commit()
    return {"message": "Delected successfully"}
