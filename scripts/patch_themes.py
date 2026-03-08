import time
from pymongo import MongoClient, UpdateOne
import sys
sys.path.append('igdbApi')
try:
    from auth import IGDBAuth
except ImportError:
    import json
    # Mock auth if running outside dir or auth module missing
    pass
import requests

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']
auth = IGDBAuth()

# Find top 2000 games by rating that miss themes
top_games = list(db.games.find({'themes': {'$exists': False}}, {'igdbId': 1}).sort('total_rating_count', -1).limit(2000))
ids_to_fetch = [str(g.get('igdbId', g.get('_id'))) for g in top_games if g.get('igdbId') or g.get('_id')]

print(f'Fetching themes for {len(ids_to_fetch)} games from IGDB...')
if not ids_to_fetch:
    print('No games found missing themes.')
    sys.exit(0)

chunk_size = 200
for i in range(0, len(ids_to_fetch), chunk_size):
    chunk = ids_to_fetch[i:i + chunk_size]
    print(f'Fetching chunk {i} to {i+len(chunk)}')
    ids_str = ','.join(chunk)
    body = f'fields id, themes; where id = ({ids_str}); limit 500;'
    
    resp = requests.post('https://api.igdb.com/v4/games', headers=auth.get_headers(), data=body)
    data = resp.json()
    
    ops = []
    for item in data:
        if 'themes' in item:
            ops.append(UpdateOne({'igdbId': item['id']}, {'$set': {'themes': item['themes']}}))
            
    if ops:
        res = db.games.bulk_write(ops, ordered=False)
        print(f'Updated {res.modified_count} games.')
    time.sleep(0.5)

print('Done patching themes!')
