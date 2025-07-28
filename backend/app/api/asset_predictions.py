from datetime import datetime, timedelta
from pyexpat.errors import messages
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import desc
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_google_user
from app.db.database import SessionLocal
from app.db.redis.base import rdBase
from app.models.account import Account
from app.models.asset_predictions import AssetPrediction
from app.schemas.asset_prediction import AssetPredictionCreate, AssetPredictionOut
from app.services.asset_prediction import update_asset_prediction_status

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/asset-predictions", response_model=AssetPredictionOut)
def create_asset_prediction(
    asset: AssetPredictionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_google_user),
):
    try:
        created_at = datetime.now()
        end_time = None
        if asset.expiration_time == "1H":
            end_time = created_at + timedelta(hours=1)
        elif asset.expiration_time == "1D":
            end_time = created_at + timedelta(days=1)
        elif asset.expiration_time == "1W":
            end_time = created_at + timedelta(weeks=1)
        elif asset.expiration_time == "1M":
            end_time = created_at + timedelta(days=30)
        if end_time is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid expiration_time value. Must be one of: 1H, 1D, 1W, 1M.",
            )
        # check email exist
        db_asset_predicrection = AssetPrediction(
            name=asset.name,
            current_value=asset.current_value,
            next_value=asset.next_value,
            expiration_time=asset.expiration_time,
            account_id=UUID(asset.account_id),
            status=asset.status,
            created_at=created_at,
            end_time=end_time,
        )
        db_account = (
            db.query(Account).filter(Account.id == UUID(asset.account_id)).first()
        )
        if not db_account:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="fail do not found db account for id",
            )
        db.add(db_asset_predicrection)
        db.commit()
        db.refresh(db_asset_predicrection)
        # add alert bicoin
        key = f"btc_alert:{str(db_asset_predicrection.id)}"
        rdBase.hset(
            key,
            mapping={
                "min": str(asset.current_value),
                "max": str(asset.next_value),
                "email": db_account.email,
                "id": str(db_asset_predicrection.id),
                "time_end": int(end_time.timestamp()),
            },
        )
        return db_asset_predicrection
    except Exception as e:
        print(f"❌ Error in account {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(e)}",
        )


@router.get("/asset-predictions", response_model=list[AssetPredictionOut])
def get_asset_prediction(account_id: str, db: Session = Depends(get_db)):
    try:
        # check email exist
        db_asset_predicrection = db.query(AssetPrediction).filter(
            AssetPrediction.account_id == UUID(account_id)
        )
        for asset in db_asset_predicrection:
            current_time = datetime.now().timestamp()
            end_time = asset.end_time.timestamp()
            if end_time < current_time and asset.status == "running":
                asset.status = "ending"
        db.commit()
        return db_asset_predicrection
    except Exception as e:
        print(f"❌ Error in account {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(e)}",
        )


@router.delete("/asset-predictions/{asset_id}")
def delete_asset_prediction(
    asset_id: int, db: Session = Depends(get_db), user=Depends(get_current_google_user)
):
    try:
        db_asset_predicrection = db.query(AssetPrediction).get(asset_id)
        if not db_asset_predicrection:
            raise HTTPException(status_code=404, detail=f"don't found asset_id")
        db.delete(db_asset_predicrection)
        db.commit()
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    except Exception as ex:
        print(f"❌ Error in asset prediction {ex}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(ex)}",
        )


@router.patch("/asset-prediction")
def update_state_prediction(asset_id: int, state: str, db: Session = Depends(get_db)):
    try:
        update_asset_prediction_status(db, asset_id, state)
        return Response(status_code=status.HTTP_200_OK)
    except Exception as ex:
        print(ex)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error update state account: {str(ex)}",
        )


@router.get("/test")
def test_api_scheduler(
    id: int, email: str, min_price: str, max_price: str, time_end: str
):
    key = f"btc_alert:{str(id)}"
    rdBase.hset(
        key,
        mapping={
            "min": min_price,
            "max": max_price,
            "email": email,
            "id": id,
            "time_end": time_end,
        },
    )
    return {"message": "✅ Alert set successfully"}


@router.get("/testv1")
def test_api_scheduler_v1():
    pass
