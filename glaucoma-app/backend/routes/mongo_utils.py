import logging
import io
from pymongo import MongoClient
from gridfs import GridFS
from PIL import Image
import numpy as np
from dotenv import load_dotenv


load_dotenv()

# MongoDB connection setup
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
