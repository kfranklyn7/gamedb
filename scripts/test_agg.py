import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['gamedb']

# Mirror of GameSearchService pipeline
pipeline = [
    # Sort by total_rating DESC
    {"$sort": {"total_rating": -1}},
    {"$limit": 24},
    # Lookups
    {"$lookup": {"from": "platforms", "localField": "platforms", "foreignField": "igdbId", "as": "found_platforms"}},
    {"$lookup": {"from": "genres", "localField": "genres", "foreignField": "igdbId", "as": "found_genres"}}
]

results = list(db['games'].aggregate(pipeline))
print(f"Results count: {len(results)}")
for r in results:
    print(f"- {r.get('name')} | Rating: {r.get('total_rating')} | Platforms: {len(r.get('found_platforms', []))} | Genres: {len(r.get('found_genres', []))}")
