from pymongo import MongoClient
import json

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']

# Find games that actually have genres
games = list(db['games'].find({"name": {"$regex": "Mario", "$options": "i"}}).limit(2))
for g in games:
    print("Name:", g.get('name'))
    print("Genres:", g.get('genres'))
    print("Themes:", g.get('themes'))
    print("Platforms:", g.get('platforms'))
    print("---")
