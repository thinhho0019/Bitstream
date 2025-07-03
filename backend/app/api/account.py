from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from sqlalchemy import desc
from app.models.account import Account
from app.schemas.account import AccountCreate, AccountOut

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/accounts", response_model=AccountOut)
def create_account(account: AccountCreate, db: Session = Depends(get_db)):
    try:
        #check email exist
        check_email = db.query(Account).filter(Account.email == account.email).first()
        if check_email:
            return check_email
        db_account = Account(email=account.email, name=account.name, image=account.image, provider_account_id=account.provider_account_id)
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account
    except Exception as e:
        print(f"❌ Error in account {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving account: {str(e)}"
        )



