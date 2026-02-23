import os
from dotenv import load_dotenv
from auth import IGDBAuth
from pymongo import MongoClient
import requests

load_dotenv()
auth = IGDBAuth()
headers = auth.get_headers()

client = MongoClient(os.getenv('MONGO_URI', 'mongodb://localhost:27017/'))
db = client['gamedb']

BASE_URL = 'https://api.igdb.com/v4/'

# The game IDs for Dishonored and Zelda BOTW
TARGET_GAMES = [533, 7346]

queries = {
    'artworks': f"fields id, game, height, width, image_id, url; where game = ({','.join(map(str, TARGET_GAMES))}); limit 500;",
    'screenshots': f"fields id, game, height, width, image_id, url; where game = ({','.join(map(str, TARGET_GAMES))}); limit 500;",
    'game_videos': f"fields id, game, name, video_id; where game = ({','.join(map(str, TARGET_GAMES))}); limit 500;",
    'websites': f"fields id, game, category, trusted, url; where game = ({','.join(map(str, TARGET_GAMES))}); limit 500;"
}

for endpoint, query in queries.items():
    print(f"Fetching {endpoint} for target games...")
    res = requests.post(BASE_URL + endpoint, headers=headers, data=query)
    if res.status_code == 200:
        data = res.json()
        if data:
            collection_name = 'videos' if endpoint == 'game_videos' else endpoint
            for doc in data:
                doc['igdbId'] = doc.pop('id')
                db[collection_name].replace_one({'igdbId': doc['igdbId']}, doc, upsert=True)
            print(f"Upserted {len(data)} documents into {collection_name}.")
        else:
            print(f"No data returned for {endpoint}.")
    else:
        print(f"Error {res.status_code}: {res.text}")

print("Done!")
