# predict.py

import logging
import numpy as np
from tensorflow.keras.models import load_model
from .mongo_utils import fetch_image_from_mongo 

MODEL_PATH = "models/CNN_Model_Updated"  


logging.basicConfig(level=logging.INFO)


model = load_model(MODEL_PATH)  
if os.path.exists(MODEL_PATH):
    model = load_model(MODEL_PATH)
else:
    logging.error(f"Model file {MODEL_PATH} not found! Please upload it.")
    model = None
logging.info("✅ Model loaded successfully!")

def predict_image(image):
    """
    Predict the class of the image using the loaded model.
    """
    image = np.expand_dims(image, axis=0)  
    prediction = model.predict(image)
    return prediction

def predict_from_mongo(file_id):
    """
    Fetch image from MongoDB and predict its class (Glaucoma or Healthy).
    """
    image = fetch_image_from_mongo(file_id)
    if image is not None:
        prediction = predict_image(image)
        class_pred = np.argmax(prediction, axis=1)[0]  
        logging.info(f"Prediction: {class_pred} (0 = Healthy, 1 = Glaucoma)")
        return class_pred
    else:
        logging.error("Image could not be processed.")
        return None
