import os
import json
import time
import requests
from datetime import datetime
from pymongo import MongoClient, UpdateOne
from concurrent.futures import ThreadPoolExecutor, as_completed
from dotenv import load_dotenv

from auth import IGDBAuth
from config import ENDPOINTS

load_dotenv()

# Handle both naming conventions for better compatibility
MONGO_URI = os.getenv('MONGO_URI') or os.getenv('MONGODB_URI') or 'mongodb://localhost:27017/'
DB_NAME = 'gamedb'
STATE_FILE = 'sync_state.json'
MAX_WORKERS = 8  # Higher concurrency for multi-threaded fetching
UPSERT_INDEX_BATCH = 1000 # Create indexes after this many docs if not exists

class IGDBSync:
    def __init__(self):
        self.auth = IGDBAuth()
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.state = self.load_state()
        self.session = requests.Session()

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

    def format_item(self, item, endpoint_name):
        # 1. Map 'id' to 'igdbId' and potentially '_id'
        if 'id' in item:
            item['igdbId'] = item.pop('id')
            
            # SCHEMA PARITY: Match Java @Id fields
            # Video.java: @Id private Integer igdbId;
            if endpoint_name == 'game_videos':
                item['_id'] = item['igdbId']
            # Website.java, AgeRating.java, etc. use String id
            # We let MongoDB handle ObjectId, but ensure igdbId is present for lookups
            
        # 2. Convert Unix timestamps (seconds) to BSON Dates for Spring Boot
        date_fields = ['first_release_date', 'date', 'created_at', 'updated_at']
        for field in date_fields:
            if item.get(field) and isinstance(item[field], (int, float)):
                item[field] = datetime.fromtimestamp(item[field])
        
        # 3. Ensure image URLs have protocol prefix
        if 'url' in item and isinstance(item['url'], str) and item['url'].startswith('//'):
            item['url'] = 'https:' + item['url']

        # 4. Handle Field Aliases and Type Conversions for Spring Boot
        status_map = {1: "released", 2: "alpha", 3: "beta", 4: "early_access", 5: "offline", 6: "cancelled", 7: "rumored", 8: "delisted"}
        
        if endpoint_name == 'games':
            if 'category' in item:
                item['game_type'] = item.pop('category')
            if 'status' in item:
                val = item.pop('status')
                item['game_status'] = status_map.get(val, str(val))
        
        if endpoint_name == 'release_dates':
            if 'status' in item:
                val = item.pop('status')
                item['status'] = status_map.get(val, str(val))
            
        return item

    def fetch_and_upsert(self, endpoint_name, offset, base_url, headers, body_template, coll):
        body = body_template.replace("OFFSET_PLACEHOLDER", str(offset))
        try:
            response = self.session.post(base_url, headers=headers, data=body, timeout=30)
            
            if response.status_code == 429:
                return -429
            
            response.raise_for_status()
            data = response.json()
            
            if not data:
                return 0
                
            ops = []
            for item in data:
                item = self.format_item(item, endpoint_name)
                ops.append(
                    UpdateOne(
                        {'igdbId': item['igdbId']},
                        {'$set': item},
                        upsert=True
                    )
                )
            
            if ops:
                coll.bulk_write(ops, ordered=False)
                return len(ops)
        except Exception as e:
            # Verbose error for 400 Bad Request
            resp = getattr(e, 'response', None)
            if resp is not None:
                sc = resp.status_code
                print(f"Error at offset {offset}: {sc} - {resp.text}")
            else:
                print(f"Error at offset {offset}: No Response - {str(e)[:100]}")
            return -1
        return 0

    def sync_endpoint(self, endpoint_name):
        if endpoint_name not in ENDPOINTS:
            return
            
        config = ENDPOINTS[endpoint_name]
        collection_name = config['collection']
        limit = config['limit']
        fields = config['fields'].strip().rstrip(';')
        where = config.get('where', '').strip().rstrip(';')
        coll = self.db[collection_name]
        
        offset = self.state.get(endpoint_name, 0)
        print(f"\n>>> SYNC: '{endpoint_name}' (Starting at {offset})")
        
        base_url = f"https://api.igdb.com/v4/{endpoint_name}"
        
        # Pure IGDB Syntax: "fields X;where Y;limit Z;offset W;"
        # (Matched exactly to verified successful curl command)
        query_parts = [f"fields {fields}"]
        if where:
            clean_where = where.replace('where ', '', 1) if where.lower().startswith('where ') else where
            query_parts.append(f"where {clean_where}")
        
        query_parts.append(f"limit {limit}")
        query_parts.append("offset OFFSET_PLACEHOLDER")
        body_template = ";".join(query_parts) + ";"

        while True:
            start_time = time.time()
            headers = self.auth.get_headers()
            offsets_to_fetch = [offset + (i * limit) for i in range(MAX_WORKERS)]
            
            results_by_offset = {}
            with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
                futures = {executor.submit(self.fetch_and_upsert, endpoint_name, off, base_url, headers, body_template, coll): off for off in offsets_to_fetch}
                for future in as_completed(futures):
                    off = futures[future]
                    results_by_offset[off] = future.result()
            
            # 1. Handle Critical Failures
            if any(r == -429 for r in results_by_offset.values()):
                print("Rate limited! Waiting 15s...")
                time.sleep(15)
                continue
                
            if any(r == -1 for r in results_by_offset.values()):
                print(f"Batch at {offset} had errors. Retrying...")
                time.sleep(5)
                continue

            # 2. Check for End of Data
            # Note: We use min(offsets_to_fetch) to ensure we don't break if a later offset is empty
            # but an earlier one still has data.
            base_result = results_by_offset[min(offsets_to_fetch)]
            if base_result == 0:
                print(f"Reached end of {endpoint_name} collection (Returned 0 items at Offset {min(offsets_to_fetch)}).")
                if offset == 0:
                    print(f"DEBUG: Body was: {body_template.replace('OFFSET_PLACEHOLDER', '0')}")
                break
            
            total_upserted = sum(r for r in results_by_offset.values() if r > 0)
            print(f"[{endpoint_name}] Offset {offset}: +{total_upserted} items")
            
            # 3. Post-Sync Indexing (First Batch Only)
            if offset == 0 and endpoint_name == 'games':
                print(f"Creating indexes for {endpoint_name}...")
                coll.create_index([("name", "text")])
                coll.create_index([("igdbId", 1)], unique=True)
                coll.create_index([("first_release_date", -1)])
                print("Indexes created.")
            
            offset += (MAX_WORKERS * limit)
            self.state[endpoint_name] = offset
            self.save_state()
            
            # Maintain target requests per second (balanced with concurrency)
            elapsed = time.time() - start_time
            # With MAX_WORKERS=8 and 2.2s sleep, we average ~3.6 rps
            time.sleep(max(0.1, 2.2 - elapsed))

    def ensure_indexes(self):
        """Creates indexes for ALL collections to prevent O(N) scan slowdowns during sync."""
        print("Ensuring indexes for all collections (High Performance Mode)...")
        for ep_name, config in ENDPOINTS.items():
            coll_name = config['collection']
            coll = self.db[coll_name]
            
            # 1. igdbId index for all collections (unless it's the primary _id)
            if ep_name != 'game_videos':
                try:
                    coll.create_index([("igdbId", 1)], unique=True)
                    # print(f" - {coll_name}: Unique index on igdbId ensured.")
                except Exception as e:
                    print(f" - {coll_name}: Warning ensuring index: {str(e)[:50]}")
            
            # 2. Specialized indexes
            if ep_name == 'games':
                coll.create_index([("name", "text")])
                coll.create_index([("first_release_date", -1)])
            
            if ep_name == 'companies':
                coll.create_index([("name", 1)])

        print("All critical indexes ensured. Upserts will be O(1).")

    def run_all(self):
        # ensure indexes first so upserts don't slow down to a crawl
        self.ensure_indexes()
        
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
        print("\n=== COMPLETE ===")

if __name__ == "__main__":
    sync = IGDBSync()
    sync.run_all()
