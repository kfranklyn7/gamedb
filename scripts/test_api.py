import requests
import json

url = "http://localhost:5731/api/v1/games/search-advanced"
body = {
  "searchTerm": "Murder Miners X",
  "genres": [],
  "platforms": [],
  "themes": [],
  "page": 0,
  "size": 20,
  "sortBy": "total_rating",
  "sortDirection": "desc"
}

r = requests.post(url, json=body)
print(f"Status: {r.status_code}")
if r.status_code == 200:
    data = r.json()
    games = data.get("games", [])
    total = data.get("total", 0)
    print(f"Total results: {total}")
    print(f"Games in this page: {len(games)}")
    with open('api_output.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Full response saved to api_output.json")
    if len(games) > 0:
        first_game = games[0]
        print(f"First game: {first_game.get('name')}")
        print(f"Platform Data: {first_game.get('platformData')}")
        print(f"Genre Names: {first_game.get('genreNames')}")
else:
    print(f"Error: {r.text}")
