from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from sqlalchemy import desc
from app.models.asset_predictions import AssetPrediction
from app.schemas.asset_prediction import AssetPredictionOut, AssetPredictionCreate
from datetime import datetime, timedelta
router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/asset-predictions", response_model=AssetPredictionOut)
def create_asset_prediction(asset: AssetPredictionCreate, db: Session = Depends(get_db)):
    try:
        created_at = datetime.utcnow()
        end_time = None
        if asset.expiration_time == '1H':
            end_time = created_at + timedelta(hours=1)
        elif asset.expiration_time == '1D':
            end_time = created_at + timedelta(days=1)
        elif asset.expiration_time == '1M':
            end_time = created_at + timedelta(weeks=1)
        elif asset.expiration_time == '1M':
            end_time = created_at + timedelta(days=30)
        # check email exist
        db_asset_predicrection = AssetPrediction(name=asset.name,
                                                 current_value=asset.current_value,
                                                 next_value=asset.next_value,
                                                 expiration_time=asset.expiration_time,
                                                 account_id=asset.account_id,
                                                 status=asset.status,
                                                 created_at=created_at,
                                                 end_time=end_time
                                                 )
        db.add(db_asset_predicrection)
        db.commit()
        db.refresh(db_asset_predicrection)
        return db_asset_predicrection
    except Exception as e:
        print(f"❌ Error in account {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(e)}"
        )


@router.get("/asset-predictions", response_model=list[AssetPredictionOut])
def create_asset_prediction(account_id: str, db: Session = Depends(get_db)):
    try:
        # check email exist
        db_asset_predicrection = db.query(AssetPrediction).filter(AssetPrediction.account_id == account_id)
        return db_asset_predicrection
    except Exception as e:
        print(f"❌ Error in account {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(e)}"
        )
