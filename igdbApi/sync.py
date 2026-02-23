import os
import json
import time
import requests
from pymongo import MongoClient
from pymongo import UpdateOne
from dotenv import load_dotenv

from auth import IGDBAuth
from config import ENDPOINTS

load_dotenv()

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = 'gamedb'
STATE_FILE = 'sync_state.json'

class IGDBSync:
    def __init__(self):
        self.auth = IGDBAuth()
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.state = self.load_state()

    def load_state(self):
        if os.path.exists(STATE_FILE):
            with open(STATE_FILE, 'r') as f:
                return json.load(f)
        return {}

    def save_state(self):
        with open(STATE_FILE, 'w') as f:
            json.dump(self.state, f, indent=4)

    def flatten_id(self, item):
        """
        Translates IGDB ID to `igdbId` so it doesn't conflict with MongoDB's `_id` ObjectId.
        Also renames `id` arrays to just list of IDs if necessary.
        """
        if 'id' in item:
            item['igdbId'] = item.pop('id')
        
        # Flatten simple relational fields to integers if they come as dicts somehow,
        # Though the fields string in Config doesn't ask for expanded fields, it's good practice.
        return item

    def sync_endpoint(self, endpoint_name):
        if endpoint_name not in ENDPOINTS:
            print(f"Unknown endpoint: {endpoint_name}")
            return
            
        config = ENDPOINTS[endpoint_name]
        collection_name = config['collection']
        limit = config['limit']
        fields = config['fields']
        where = config.get('where', '')
        
        coll = self.db[collection_name]
        
        # Start from offset 0, or resume from state file
        offset = self.state.get(endpoint_name, 0)
        
        print(f"\n--- Starting sync for '{endpoint_name}' into collection '{collection_name}' ---")
        print(f"Resuming at offset: {offset}")
        
        base_url = f"https://api.igdb.com/v4/{endpoint_name}"
        
        while True:
            headers = self.auth.get_headers()
            
            # Construct the query body manually
            body = f"fields {fields} limit {limit}; offset {offset};"
            if where:
                body += f" {where}"
                
            try:
                response = requests.post(base_url, headers=headers, data=body)
                response.raise_for_status()
                data = response.json()
                
                if not data:
                    print(f"Reached end of data for {endpoint_name}. Items returned: 0")
                    break
                    
                ops = []
                for item in data:
                    item = self.flatten_id(item)
                    
                    # Upsert logic: if igdbId exists, update it. If not, insert it.
                    ops.append(
                        UpdateOne(
                            {'igdbId': item['igdbId']},
                            {'$set': item},
                            upsert=True
                        )
                    )
                    
                # Bulk execute the batch
                if ops:
                    result = coll.bulk_write(ops)
                    print(f"[{endpoint_name}] Offset {offset}: Upserted {len(ops)} documents. Modified: {result.modified_count}, Inserted: {result.upserted_count}")
                    
                # Advance pagination
                offset += limit
                self.state[endpoint_name] = offset
                self.save_state()
                
                # Rate limit safety (IGDB allows 4 requests per second)
                time.sleep(0.3)
                
            except Exception as e:
                print(f"Error during execution at offset {offset}: {str(e)}")
                try:
                    print(response.content)
                except:
                    pass
                print("Pausing for 5 seconds before retrying...")
                time.sleep(5)
                # Loop repeats at the exact same offset, preventing data gap!

    def run_all(self):
        # We start with reference collections first, so that documents like Games have targets
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
        
        print("\n=== SYNC COMPLETE ===")

if __name__ == "__main__":
    sync = IGDBSync()
    sync.run_all()
