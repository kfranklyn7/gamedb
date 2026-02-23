import json
import sys
from time import sleep

import requests
import os
from dotenv import load_dotenv
from requests import Response
from igdb.wrapper import IGDBWrapper
load_dotenv()
twitch_secret = os.getenv('TWITCH_SECRET')
twitch_client = os.getenv('TWITCH_CLIENT')

auth_url = 'https://id.twitch.tv/oauth2/token'
auth_request_url = auth_url + '?' + 'client_id=' + twitch_client + '&client_secret=' + twitch_secret + '&grant_type=client_credentials'
class token:
    def __init__(self):
        auth_request = requests.post(auth_request_url).json()
        access_token = auth_request['access_token']
        expires_in = auth_request['expires_in']
        self.access_token = access_token
        self.expires_in = expires_in
        self.token_type = 'Bearer'
    def auth(self):
        return 'Bearer {}'.format(self.access_token)
#https://api.igdb.com/v4
#https://id.twitch.tv/oauth2/token
token = token()
print(token.auth())
auth = token.auth()
os.environ['AUTH']=auth
iteration = int(os.getenv('ITERATION'))
for i in range(1,1000):
    response: Response = requests.post('https://api.igdb.com/v4/games', **{'headers': {'Client-ID': twitch_client, 'Authorization': auth},'data': f'fields *;   '})
    print(response.json())
    with open('games.json', "w") as json_file:
        json.dump(response.json(), json_file, indent=4)
    print(f'Dumped the games, {iteration} iteration')
    iteration = iteration + 1
    os.environ['ITERATION'] = str(iteration)
    sleep(2)
print(f'Last iteration: {iteration}')
