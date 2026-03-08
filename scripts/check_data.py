import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['gamedb']

total = db['games'].count_documents({})
with_rating = db['games'].count_documents({'total_rating': {'$exists': True, '$ne': None}})
with_genres = db['games'].count_documents({'genres': {'$exists': True, '$ne': []}})
with_platforms = db['games'].count_documents({'platforms': {'$exists': True, '$ne': []}})

print(f"Total games: {total}")
print(f"With rating: {with_rating}")
print(f"With genres: {with_genres}")
print(f"With platforms: {with_platforms}")

# Check first 5 items
print("\nFirst 5 items:")
for doc in db['games'].find().limit(5):
    print(f"- {doc.get('name')} | Rating: {doc.get('total_rating')} | Genres: {doc.get('genres')} | Platforms: {doc.get('platforms')}")
