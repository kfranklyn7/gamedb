import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

TWITCH_CLIENT = os.getenv('TWITCH_CLIENT')
TWITCH_SECRET = os.getenv('TWITCH_SECRET')

class IGDBAuth:
    def __init__(self):
        self.access_token = None
        self.expires_at = 0

    def get_token(self):
        # Refresh token if expired or close to expiring (within 5 minutes)
        if not self.access_token or time.time() > (self.expires_at - 300):
            print("Fetching new Twitch OAuth token...")
            auth_url = 'https://id.twitch.tv/oauth2/token'
            params = {
                'client_id': TWITCH_CLIENT,
                'client_secret': TWITCH_SECRET,
                'grant_type': 'client_credentials'
            }
            response = requests.post(auth_url, params=params)
            response.raise_for_status()
            data = response.json()
            
            self.access_token = data['access_token']
            self.expires_at = time.time() + data['expires_in']
            print(f"Token acquired. Expires in {data['expires_in']} seconds.")
            
        return self.access_token

    def get_headers(self):
        token = self.get_token()
        return {
            'Client-ID': TWITCH_CLIENT,
            'Authorization': f'Bearer {token}',
            'Accept': 'application/json'
        }
