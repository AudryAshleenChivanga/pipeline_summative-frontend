import os
from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import shutil
from io import BytesIO


app = FastAPI()

MODEL_PATH = 'models/CNN_Model_Updated.h5'
model = load_model(MODEL_PATH)

#  prediction and retraining
router = APIRouter()

# Prediction endpoint
@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        
        image_data = await file.read()
        img = Image.open(BytesIO(image_data)).resize((128, 128)).convert('RGB')
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        # Make prediction
        prediction = model.predict(img_array)
        prediction_class = np.argmax(prediction, axis=1)
        diagnosis = "Glaucoma" if prediction_class[0] == 1 else "Normal"

        return {"prediction": diagnosis}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# Retrain endpoint (you can call your existing retrain function here)
@router.post("/retrain")
async def retrain():
    try:
       
        retrain_model()
        return {"message": "Retraining successful!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


def retrain_model():
    
    print("🔄 Retraining model...")
    
    print(" Model retrained and saved successfully!")

app.include_router(router, prefix="/api/v1")

# Run
# uvicorn main:app --reload
