from pymongo import MongoClient
import random
from datetime import datetime
import bcrypt
import os
from dotenv import load_dotenv

def seed_data():
    load_dotenv()
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
    client = MongoClient(mongo_uri)
    db = client["gamedb"]
    users_col = db["users"]
    lists_col = db["user_lists"]
    games_col = db["games"]
    
    # Get some popular games to add
    popular_games = list(games_col.find({"total_rating": {"$gte": 80}}).limit(50))
    if not popular_games:
        print("No games found to seed. Make sure the database has games.")
        return

    test_users = [
        {"username": "retro_gamer", "email": "retro@example.com", "avatarUrl": "https://api.dicebear.com/7.x/pixel-art/svg?seed=retro"},
        {"username": "rpg_master", "email": "rpg@example.com", "avatarUrl": "https://api.dicebear.com/7.x/pixel-art/svg?seed=rpg"},
        {"username": "casual_player", "email": "casual@example.com", "avatarUrl": "https://api.dicebear.com/7.x/pixel-art/svg?seed=casual"},
        {"username": "completionist", "email": "comp@example.com", "avatarUrl": "https://api.dicebear.com/7.x/pixel-art/svg?seed=comp"}
    ]

    for u in test_users:
        # Check if user exists
        existing = users_col.find_one({"username": u["username"]})
        if not existing:
            # Create user
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(b"password", salt)
            user_doc = {
                "username": u["username"],
                "email": u["email"],
                "password": hashed.decode('utf-8'),
                "avatarUrl": u["avatarUrl"],
                "roles": ["ROLE_USER"],
                "createdAt": datetime.utcnow()
            }
            users_col.insert_one(user_doc)
            print(f"Created user: {u['username']}")
        
        # Add games to their default list (Quest Journal)
        list_doc = lists_col.find_one({"username": u["username"], "isDefault": True})
        if not list_doc:
            list_doc = {
                "name": "Quest Journal",
                "username": u["username"],
                "isDefault": True,
                "isPublic": True,
                "description": "My main collection",
                "games": [],
                "createdAt": datetime.utcnow(),
                "updatedAt": datetime.utcnow()
            }
            res = lists_col.insert_one(list_doc)
            list_id = res.inserted_id
        else:
            list_id = list_doc["_id"]

        # Add random games
        num_games = random.randint(5, 15)
        games_to_add = random.sample(popular_games, num_games)
        
        list_games = list_doc.get("games", [])
        existing_ids = {g["igdbId"] for g in list_games}
        
        for g in games_to_add:
            if g["igdbId"] not in existing_ids:
                list_games.append({
                    "igdbId": g["igdbId"],
                    "status": random.choice(["PLAYING", "COMPLETED", "BACKLOG", "WISHLIST"]),
                    "addedAt": datetime.utcnow()
                })
        
        lists_col.update_one(
            {"_id": list_id},
            {"$set": {"games": list_games, "updatedAt": datetime.utcnow()}}
        )
        print(f"Populated {len(list_games)} games for {u['username']}'s Quest Journal")

if __name__ == "__main__":
    seed_data()
