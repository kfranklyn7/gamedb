import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['gamedb']

print(f"Themes count: {db['themes'].count_documents({})}")
print(f"Platform Logos count: {db['platform_logos'].count_documents({})}")
print(f"Platforms count: {db['platforms'].count_documents({})}")
p6 = db['platforms'].find_one({'igdbId': 6})
print(f"Platform 6: {p6.get('name')} | Logo: {p6.get('platformLogoUrl')}")
p130 = db['platforms'].find_one({'igdbId': 130})
print(f"Platform 130: {p130.get('name')} | Logo: {p130.get('platformLogoUrl')}")
if db['genres'].count_documents({}) > 0:
    print(f"Sample genre: {db['genres'].find_one()}")
print(f"Games with Platform 6: {db['games'].count_documents({'platforms': 6})}")

# Sample a few games to see if they have themes/platforms as stringified arrays
sample = list(db['games'].find({}, {'themes': 1, 'platforms': 1, 'genres': 1, 'name': 1}).limit(5))
for s in sample:
    p = s.get('platforms')
    g = s.get('genres')
    p_type = type(p[0]) if p and len(p) > 0 else "N/A"
    g_type = type(g[0]) if g and len(g) > 0 else "N/A"
    print(f"Game: {s.get('name')} | Platform[0] Type: {p_type} | Genre[0] Type: {g_type}")
    print(f"  Platforms: {p} | Genres: {g}")
