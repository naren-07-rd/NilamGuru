from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
from pathlib import Path
from pydantic import BaseModel


app = FastAPI(title="NilamGuru API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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