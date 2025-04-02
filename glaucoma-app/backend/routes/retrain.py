import os
import logging
import numpy as np
from pymongo import MongoClient
from gridfs import GridFS
from PIL import Image
import io
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.utils import to_categorical
from dotenv import load_dotenv
import matplotlib.pyplot as plt


load_dotenv()


IMAGE_SIZE = (128, 128, 3)
MODEL_PATH = "backend/models/model_base.h5"  


logging.basicConfig(level=logging.INFO)


if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
    logging.info("✅ Model loaded successfully!")
else:
    logging.error(f"Model file {MODEL_PATH} not found! Please upload it.")
    model = None


MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client["glaucoma_db"]
fs = GridFS(db)

def fetch_image_from_mongo(file_id):
    """
    Fetch a single image from MongoDB and preprocess it.
    """
    try:
        file_data = db.fs.chunks.find_one({"files_id": file_id})
        if file_data:
            img = Image.open(io.BytesIO(file_data["data"])).resize((128, 128)).convert("RGB")
            return np.array(img) / 255.0  
        else:
            logging.warning(f"Image data for file_id {file_id} not found!")
            return None
    except Exception as e:
        logging.error(f"Error processing image with file_id {file_id}: {e}")
        return None

def predict_image(image):
    """
    Predict the class of the image using the loaded model.
    """
    image = np.expand_dims(image, axis=0)  
    prediction = model.predict(image)
    return prediction

def evaluate_model(X_val, y_val):
    """
    Evaluate the model on validation data.
    """
    loss, accuracy = model.evaluate(X_val, y_val)
    logging.info(f"Validation Loss: {loss}, Accuracy: {accuracy}")


def predict_from_mongo(file_id):
    image = fetch_image_from_mongo(file_id)
    if image is not None:
        prediction = predict_image(image)
        class_pred = np.argmax(prediction, axis=1)[0]
        logging.info(f"Prediction: {class_pred} (0 = No Glaucom, 1 = Glaucoma)")
        return class_pred
    else:
        logging.error("Image could not be processed.")
        return None


file_id = "<MongoDB file_id_here>"  
predict_from_mongo(file_id)
