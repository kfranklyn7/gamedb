from pymongo import MongoClient
import json

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']

pipeline = [
    {"$match": {"name": {"$regex": "Mario", "$options": "i"}}},
    {"$limit": 1},
    {"$lookup": {"from": "genres", "localField": "genres", "foreignField": "igdbId", "as": "genreObjects"}},
    {"$lookup": {"from": "themes", "localField": "themes", "foreignField": "igdbId", "as": "themeObjects"}},
    {"$project": {
        "name": 1,
        "genres": 1,
        "genreObjects_names": {"$map": {"input": "$genreObjects", "as": "g", "in": "$$g.name"}},
        "themes": 1,
        "themeObjects_names": {"$map": {"input": "$themeObjects", "as": "t", "in": "$$t.name"}}
    }}
]

result = list(db.games.aggregate(pipeline))
print(json.dumps(result, indent=2, default=str))
