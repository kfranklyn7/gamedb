import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
client = MongoClient(MONGO_URI)
db = client['gamedb']

p = db['platforms'].find_one({'igdbId': 6})
print(f"DEBUG_RAW_LOGO_6: '{p.get('platformLogoUrl')}'")

g_with_themes = db['games'].find_one({'themes': {'$exists': True, '$ne': []}})
if g_with_themes:
    print(f"Game with themes: {g_with_themes.get('name')} | IDs: {g_with_themes.get('themes')}")
else:
    print("No games with themes found in DB.")

