from sqlalchemy.orm import Session

from app.models.asset_predictions import AssetPrediction


def update_asset_prediction_status(db: Session, asset_id: int, state: str):
    asset = db.query(AssetPrediction).filter(AssetPrediction.id == asset_id).first()
    if not asset:
        raise ValueError(f"Asset with id {asset_id} not found")
    asset.status = state
    db.commit()
    db.refresh(asset)
