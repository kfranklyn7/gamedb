from pymongo import MongoClient

client = MongoClient('mongodb://admin:password@localhost:27017/?authSource=admin')
db = client['gamedb']

print("Genres count:", db['genres'].count_documents({}))
print("Themes count:", db['themes'].count_documents({}))
print("Platforms count:", db['platforms'].count_documents({}))
