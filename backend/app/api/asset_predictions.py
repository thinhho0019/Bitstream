from pyexpat.errors import messages

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from sqlalchemy import desc
from app.models.asset_predictions import AssetPrediction
from app.schemas.asset_prediction import AssetPredictionOut, AssetPredictionCreate
from datetime import datetime, timedelta
from app.auth.dependencies import get_current_google_user
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
        created_at = datetime.now()
        end_time = None
        if asset.expiration_time == '1H':
            end_time = created_at + timedelta(hours=1)
        elif asset.expiration_time == '1D':
            end_time = created_at + timedelta(days=1)
        elif asset.expiration_time == '1W':
            end_time = created_at + timedelta(weeks=1)
        elif asset.expiration_time == '1M':
            end_time = created_at + timedelta(days=30)
        if end_time is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid expiration_time value. Must be one of: 1H, 1D, 1W, 1M."
            )
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
def get_asset_prediction(account_id: str, db: Session = Depends(get_db)):
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
@router.delete("/asset-predictions/{asset_id}")
def delete_asset_prediction(asset_id:int,db: Session = Depends(get_db), user = Depends(get_current_google_user)):
    try:
        print(asset_id)
        db_asset_predicrection = db.query(AssetPrediction).get(asset_id)
        print(db_asset_predicrection)
        if not db_asset_predicrection:
            raise HTTPException(
                status_code=404,
                detail=f"don't found asset_id"
            )
        db.delete(db_asset_predicrection)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as ex:
        print(f"❌ Error in asset prediction {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(ex)}"
        )