from fastapi import FastAPI, Depends, HTTPException, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
from pydantic import BaseModel

from sqlalchemy.orm import Session
from database.connection import engine
from database.models import User
from schemas.auth import RegisterRequest, LoginRequest
from services.auth_service import (
    register_user,
    login_user,
    create_session,
    get_user_from_session,
    revoke_session,
)

from sqlalchemy.orm import sessionmaker


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
app = FastAPI(title="NilamGuru API")

@app.post("/auth/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    try:
        user = register_user(db, data)

        return {
            "message": "Registration successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_verified": user.is_verified
            }
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

@app.post("/auth/login")
def login(
    data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    try:
        user = login_user(
            db=db,
            email=data.email,
            password=data.password
        )

        session_token = create_session(
            db=db,
            user=user
        )

        response.set_cookie(
            key="nilamguru_session",
            value=session_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=7 * 24 * 60 * 60
        )

        return {
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "role": user.role,
                "is_verified": user.is_verified
            }
        }

    except ValueError as error:
        raise HTTPException(
            status_code=401,
            detail=str(error)
        )

@app.get("/auth/me")
def get_current_user(
    nilamguru_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if not nilamguru_session:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )

    user = get_user_from_session(
        db=db,
        session_token=nilamguru_session
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session"
        )

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_verified": user.is_verified
    }

@app.post("/auth/logout")
def logout(
    response: Response,
    nilamguru_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    if nilamguru_session:
        revoke_session(
            db=db,
            session_token=nilamguru_session
        )

    response.delete_cookie(
        key="nilamguru_session"
    )

    return {
        "message": "Logout successful"
    }




# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nilamguru.vercel.app",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://127.0.0.1:5500",
        "http://localhost:5500",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

# Crop model
crop_model = joblib.load(MODEL_DIR / "crop_recommendation_model.pkl")
crop_encoder = joblib.load(MODEL_DIR / "crop_label_encoder.pkl")

# Fertilizer model
fertilizer_model = joblib.load(MODEL_DIR / "fertilizer_model.pkl")
soil_encoder = joblib.load(MODEL_DIR / "soil_encoder.pkl")
crop_type_encoder = joblib.load(MODEL_DIR / "crop_encoder.pkl")
fertilizer_encoder = joblib.load(MODEL_DIR / "fertilizer_encoder.pkl")

# Crop Input Model
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

# Fertilizer Input Model
class FertilizerInput(BaseModel):
    temperature: float
    humidity: float
    moisture: float
    soil_type: str
    crop_type: str
    nitrogen: float
    potassium: float
    phosphorous: float


# Crop Prediction Endpoint
@app.post("/predict/crop")
def predict_crop(data: CropInput):

    input_data = [[
        data.N,
        data.P,
        data.K,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]]

    prediction = crop_model.predict(input_data)

    crop_name = crop_encoder.inverse_transform(prediction)[0]

    return {
        "recommended_crop": crop_name
    }


# Fertilizer Prediction Endpoint
@app.post("/predict/fertilizer")
def predict_fertilizer(data: FertilizerInput):

    soil_encoded = soil_encoder.transform([data.soil_type])[0]

    crop_encoded = crop_type_encoder.transform([data.crop_type])[0]

    input_data = [[
        data.temperature,
        data.humidity,
        data.moisture,
        soil_encoded,
        crop_encoded,
        data.nitrogen,
        data.potassium,
        data.phosphorous
    ]]

    prediction = fertilizer_model.predict(input_data)

    fertilizer_name = fertilizer_encoder.inverse_transform(prediction)[0]

    return {
        "recommended_fertilizer": fertilizer_name
    }



@app.get("/")
def home():
    return {"message": "Nilamguru API is running"}