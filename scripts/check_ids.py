import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['gamedb']

# Sample a game
game = db['games'].find_one({'platforms': {'$exists': True, '$ne': []}})
print(f"Game: {game.get('name')}")
platform_ids = game.get('platforms')
genre_ids = game.get('genres')
theme_ids = game.get('themes')

print(f"Platform IDs (IGDB): {platform_ids}")
print(f"Genre IDs (IGDB): {genre_ids}")
print(f"Theme IDs (IGDB): {theme_ids}")

if platform_ids:
    p_samples = list(db['platforms'].find({'igdbId': {'$in': platform_ids}}))
    print(f"Found {len(p_samples)} matching platforms in platforms collection.")
    for p in p_samples:
        print(f"  - {p.get('name')} (igdbId: {p.get('igdbId')})")

if genre_ids:
    g_samples = list(db['genres'].find({'igdbId': {'$in': genre_ids}}))
    print(f"Found {len(g_samples)} matching genres in genres collection.")
    for g in g_samples:
        print(f"  - {g.get('name')} (igdbId: {g.get('igdbId')})")

if theme_ids:
    t_samples = list(db['themes'].find({'igdbId': {'$in': theme_ids}}))
    print(f"Found {len(t_samples)} matching themes in themes collection.")
    for t in t_samples:
        print(f"  - {t.get('name')} (igdbId: {t.get('igdbId')})")
