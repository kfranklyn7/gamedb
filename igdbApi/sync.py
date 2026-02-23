import os
import json
import time
import requests
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

from auth import IGDBAuth
from config import ENDPOINTS

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = 'gamedb'
STATE_FILE = 'sync_state.json'
MAX_WORKERS = 4  # IGDB allows 4 requests per second

class IGDBSync:
    def __init__(self):
        self.auth = IGDBAuth()
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.state = self.load_state()

    def load_state(self):
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, 'r') as f:
                try:
                    return json.load(f)
                except:
                    return {}
        return {}

    def save_state(self):
        with open(STATE_FILE, 'w') as f:
            json.dump(self.state, f, indent=4)

    def flatten_id(self, item):
        if 'id' in item:
            item['igdbId'] = item.pop('id')
        return item

    def fetch_and_upsert(self, endpoint_name, offset, base_url, headers, body_template, coll):
        body = body_template.replace("OFFSET_PLACEHOLDER", str(offset))
        try:
            response = requests.post(base_url, headers=headers, data=body)
            response.raise_for_status()
            data = response.json()
            
            if not data:
                return 0
                
            ops = []
            for item in data:
                item = self.flatten_id(item)
                ops.append(
                    UpdateOne(
                        {'igdbId': item['igdbId']},
                        {'$set': item},
                        upsert=True
                    )
                )
            
            if ops:
                result = coll.bulk_write(ops)
                return len(ops)
        except Exception as e:
            print(f"Error at offset {offset}: {e}")
            return -1
        return 0

    def sync_endpoint(self, endpoint_name):
        if endpoint_name not in ENDPOINTS:
            return
            
        config = ENDPOINTS[endpoint_name]
        collection_name = config['collection']
        limit = config['limit']
        fields = config['fields']
        where = config.get('where', '')
        coll = self.db[collection_name]
        
        offset = self.state.get(endpoint_name, 0)
        print(f"\n>>> Turbo Sync: '{endpoint_name}' -> '{collection_name}' (Starting at {offset})")
        
        base_url = f"https://api.igdb.com/v4/{endpoint_name}"
        body_template = f"fields {fields} limit {limit}; offset OFFSET_PLACEHOLDER;"
        if where:
            body_template += f" {where}"

        while True:
            headers = self.auth.get_headers()
            offsets_to_fetch = [offset + (i * limit) for i in range(MAX_WORKERS)]
            
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = {executor.submit(self.fetch_and_upsert, endpoint_name, off, base_url, headers, body_template, coll): off for off in offsets_to_fetch}
                
                results = []
                for future in as_completed(futures):
                    results.append(future.result())
                
                # If any returned 0, we reached the end soon
                if any(r == 0 for r in results):
                    # Find the highest offset that actually returned data before reaching 0
                    # For simplicity, if we hit 0, we just finish this collection after this batch
                    # and assume we'll catch any stragglers on next run or just move on.
                    print(f"Reached end of {endpoint_name}.")
                    self.state[endpoint_name] = offset + (MAX_WORKERS * limit)
                    self.save_state()
                    break
                
                # If any failed (-1), we pause and retry this batch
                if any(r == -1 for r in results):
                    print("Error detected, pausing 5s...")
                    time.sleep(5)
                    continue

                total_upserted = sum(results)
                print(f"[{endpoint_name}] Batch {offset}-{offset + (MAX_WORKERS * limit)}: Upserted {total_upserted} docs.")
                
                offset += (MAX_WORKERS * limit)
                self.state[endpoint_name] = offset
                self.save_state()
                
                # 4 requests per second. Each worker did 1 request.
                # So we wait 1 second to start the next batch of 4.
                time.sleep(1.1)

    def run_all(self):
        order = [
            'genres', 'themes', 'platforms', 'keywords', 'game_modes',
            'companies', 'franchises', 'collections', 'release_dates',
            'covers', 'artworks', 'screenshots', 'involved_companies',
            'game_videos', 'websites', 'player_perspectives', 'game_engines',
            'age_ratings', 'language_supports', 'multiplayer_modes',
            'games'
        ]
        for ep in order:
            if ep in ENDPOINTS:
                self.sync_endpoint(ep)
        print("\n=== TURBO SYNC COMPLETE ===")

if __name__ == "__main__":
    sync = IGDBSync()
    sync.run_all()
