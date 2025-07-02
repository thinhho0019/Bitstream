from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from sqlalchemy import desc
from app.models.bitcoin import BitcoinPrice
from app.schemas.bitcoin import BitcoinCreate, BitcoinOut

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/bitcoins", response_model=BitcoinOut)
def create_bitcoin_price(bitcoin: BitcoinCreate, db: Session = Depends(get_db)):
    try:
        db_bitcoin = BitcoinPrice(price=bitcoin.price)
        db.add(db_bitcoin)
        db.commit()
        db.refresh(db_bitcoin)
        return db_bitcoin
    except Exception as e:
        print(f"❌ Error in list_bitcoin {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving bitcoin: {str(e)}"
        )


@router.get("/bitcoins", response_model=BitcoinOut)
def get_bitcoin_price(db: Session = Depends(get_db)):
    try:
        # bitcoin_current = db.query(BitcoinPrice).order_by(desc(BitcoinPrice.timestamp)).limit(100).all()[::-1]
        bitcoin_current = db.query(BitcoinPrice).order_by(desc(BitcoinPrice.timestamp)).first()
        if not bitcoin_current:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No bitcoin price found"
            )
        return bitcoin_current
    except Exception as e:
        print(f"❌ Error in list_bitcoin {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving bitcoin: {str(e)}"
        )
