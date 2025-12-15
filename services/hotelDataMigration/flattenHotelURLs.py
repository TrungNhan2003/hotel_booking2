from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os

def createAMongodbConnection() -> MongoClient:
    connectionString = (
        f"mongodb+srv://{os.environ['MONGODB_USERNAME']}:"
        f"{os.environ['MONGODB_PASSWD']}@cluster0.qsa9hsq.mongodb.net/"
        "?appName=Cluster0"
    )
    client = MongoClient(connectionString, server_api=ServerApi("1"))
    client.admin.command("ping")
    return client


mongodbconnection = createAMongodbConnection()
db = mongodbconnection["hotel_info"]

source_collection = db["currentAvailableHotelsPhoto"]
target_collection = db["hotelPhotoUrl"]

rows = []

documents = source_collection.find({})

for hotel_doc in documents:
    hotel_id = hotel_doc.get("hotel_id")

    photos = hotel_doc.get("data", [])
    if not photos:
        continue

    for photo in photos:
        base_info = {
            "hotel_id": hotel_id,
            "photo_id": photo.get("id"),
            "is_blessed": photo.get("is_blessed"),
            "caption": photo.get("caption"),
            "published_date": photo.get("published_date"),
            "album": photo.get("album"),
            "source_name": photo.get("source", {}).get("name"),
            "source_localized_name": photo.get("source", {}).get("localized_name"),
        }

        images = photo.get("images")

        # images can be null
        if not images:
            continue

        for size, img in images.items():
            if not img:
                continue

            rows.append({
                **base_info,
                "image_size": size,
                "image_url": img.get("url"),
                "image_height": img.get("height"),
                "image_width": img.get("width"),
            })

# Bulk insert
if rows:
    target_collection.insert_many(rows)
    print(f"Inserted {len(rows)} image rows")
else:
    print("No data to insert")
