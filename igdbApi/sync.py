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
MAX_WORKERS = 4  # Target 4 requests per second

class IGDBSync:
    def __init__(self):
        self.auth = IGDBAuth()
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.state = self.load_state()
        self.session = requests.Session()  # Reuse TCP connections

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
            # Use the shared session for faster requests
            response = self.session.post(base_url, headers=headers, data=body, timeout=30)
            
            if response.status_code == 429:
                return -429
            
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
                # IMPORTANT: ordered=False is MUCH faster for bulk writes
                coll.bulk_write(ops, ordered=False)
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
        print(f"\n>>> MAX TURBO: '{endpoint_name}' (Starting at {offset})")
        
        base_url = f"https://api.igdb.com/v4/{endpoint_name}"
        
        body_template = f"fields {fields}"
        if where:
            if not where.strip().startswith('where'):
                body_template += f" where {where}"
            else:
                body_template += f" {where}"
        body_template += f" limit {limit}; offset OFFSET_PLACEHOLDER;"

        while True:
            start_time = time.time()
            headers = self.auth.get_headers()
            offsets_to_fetch = [offset + (i * limit) for i in range(MAX_WORKERS)]
            
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = {executor.submit(self.fetch_and_upsert, endpoint_name, off, base_url, headers, body_template, coll): off for off in offsets_to_fetch}
                
                results_by_offset = {}
                for future in as_completed(futures):
                    off = futures[future]
                    results_by_offset[off] = future.result()
                
                # Check for rate limiting or general errors
                if any(r == -429 for r in results_by_offset.values()):
                    print("Rate limited! Sleeping 10s...")
                    time.sleep(10)
                    continue
                    
                if any(r == -1 for r in results_by_offset.values()):
                    print("Network error, retrying batch in 5s...")
                    time.sleep(5)
                    continue

                # Break ONLY if the lowest requested offset returned nothing
                if results_by_offset[min(offsets_to_fetch)] == 0:
                    print(f"Reached end of {endpoint_name}.")
                    break
                
                total_upserted = sum(r for r in results_by_offset.values() if r > 0)
                print(f"[{endpoint_name}] Offset {offset}: +{total_upserted} items")
                
                offset += (MAX_WORKERS * limit)
                self.state[endpoint_name] = offset
                self.save_state()
                
                # Dynamically sleep to maintain exactly 4 requests per second
                elapsed = time.time() - start_time
                sleep_time = max(0.1, 1.05 - elapsed) 
                time.sleep(sleep_time)

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
        print("\n=== MAX TURBO SYNC COMPLETE ===")

if __name__ == "__main__":
    sync = IGDBSync()
    sync.run_all()
