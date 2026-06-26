from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_access_token,
    get_current_user,
)
from app.services.presence import get_online_users

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": str(db_user.id), "type": "access"})
    refresh_token = create_refresh_token(data={"sub": str(db_user.id), "type": "refresh"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }


@router.get("/verify-token")
def verify_token(token: str = Query(...)):
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"valid": True, "payload": payload}


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(User).filter(User.id == int(current_user["sub"])).first()


@router.post("/refresh")
def refresh_access_token(refresh_token: str):
    payload = decode_access_token(refresh_token)

    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access_token = create_access_token(data={"sub": payload["sub"]})

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.get("/online-users")
def online_users():
    return {"online_users": get_online_users()}


@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return db.query(User).filter(User.id != int(current_user["sub"])).all()