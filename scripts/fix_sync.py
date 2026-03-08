import os
from pymongo import MongoClient
from dotenv import load_dotenv
import requests
from datetime import datetime
import json
import time

# Load config from sync.py context
load_dotenv()
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
TWITCH_CLIENT = os.getenv('TWITCH_CLIENT')
TWITCH_SECRET = os.getenv('TWITCH_SECRET')

# Minimal Auth
def get_token():
    url = f"https://id.twitch.tv/oauth2/token?client_id={TWITCH_CLIENT}&client_secret={TWITCH_SECRET}&grant_type=client_credentials"
    r = requests.post(url)
    return r.json().get('access_token')

TOKEN = get_token()
HEADERS = {
    'Client-ID': TWITCH_CLIENT,
    'Authorization': f'Bearer {TOKEN}'
}

client = MongoClient(MONGO_URI)
db = client['gamedb']

def sync_endpoint(endpoint, collection_name, fields):
    print(f"Syncing {endpoint}...")
    url = f"https://api.igdb.com/v4/{endpoint}"
    body = f"fields {fields}; limit 500;"
    r = requests.post(url, headers=HEADERS, data=body)
    data = r.json()
    
    upserts = 0
    for item in data:
        item['igdbId'] = item.pop('id')
        if 'url' in item and isinstance(item['url'], str) and item['url'].startswith('//'):
            item['url'] = 'https:' + item['url']
        
        db[collection_name].update_one(
            {'igdbId': item['igdbId']},
            {'$set': item},
            upsert=True
        )
        upserts += 1
    print(f"Done {endpoint}: {upserts} items.")

# 1. Sync Themes and Logos
sync_endpoint('themes', 'themes', 'name, slug, url')
sync_endpoint('platform_logos', 'platform_logos', 'id, alpha_channel, animated, height, image_id, url, width')

# 2. Sync Platforms (to get logo resolution)
sync_endpoint('platforms', 'platforms', 'id, name, abbreviation, slug, category, generation, platform_family, platform_logo, summary, url')

# 3. Resolve platformLogoUrl in platforms collection
print("Resolving platformLogoUrl in platforms collection...")
platforms = list(db['platforms'].find({'platform_logo': {'$exists': True}}))
resolved = 0
for p in platforms:
    logo_id = p['platform_logo']
    logo_doc = db['platform_logos'].find_one({'igdbId': logo_id})
    if logo_doc and 'url' in logo_doc:
        db['platforms'].update_one(
            {'_id': p['_id']},
            {'$set': {'platformLogoUrl': logo_doc['url']}}
        )
        resolved += 1
print(f"Resolved {resolved} platform logo URLs.")

print("=== SYNC COMPLETE ===")
