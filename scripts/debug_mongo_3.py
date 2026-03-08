from pymongo import MongoClient
import builtins

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']

game = db['games'].find_one({"genres": {"$type": "array"}})
genre = db['genres'].find_one()
theme = db['themes'].find_one()

print("Game genres type:", type(game['genres'][0]) if game and game.get('genres') else "N/A")
print("Genre igdbId type:", type(genre['igdbId']) if genre and genre.get('igdbId') else "N/A")
print("Theme igdbId type:", type(theme['igdbId']) if theme and theme.get('igdbId') else "N/A")

print("Game example:", game['genres'][0])
print("Genre example:", genre['igdbId'])
