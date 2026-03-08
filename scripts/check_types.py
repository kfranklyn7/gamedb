import os
from pymongo import MongoClient

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']

game = db.games.find_one({'igdbId': 1068})
print('Super Mario Bros 3:')
print('platforms type:', type(game.get('platforms', [])[0]).__name__)
print('genres type:', type(game.get('genres', [])[0]).__name__)
print('themes type:', type(game.get('themes', [])[0]).__name__)

theme = db.themes.find_one()
print('Theme igdbId type:', type(theme['igdbId']).__name__)
