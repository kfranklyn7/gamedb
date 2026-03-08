import requests
import os
import time

LOGOS_DIR = "frontend/src/assets/logos"
os.makedirs(LOGOS_DIR, exist_ok=True)

# Direct Wikimedia Commons raw SVG URLs for reliability
OFFICIAL_SVGS = {
    # PlayStation
    "ps1.svg": "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
    "ps2.svg": "https://upload.wikimedia.org/wikipedia/commons/7/76/PlayStation_2_logo.svg",
    "ps3.svg": "https://upload.wikimedia.org/wikipedia/commons/f/fb/PlayStation_3_logo_on_white_%282009%29.svg",
    "ps4.svg": "https://upload.wikimedia.org/wikipedia/commons/8/87/PlayStation_4_logo_and_wordmark.svg",
    "ps5.svg": "https://upload.wikimedia.org/wikipedia/commons/3/35/PlayStation_5_logo.svg",
    "psp.svg": "https://upload.wikimedia.org/wikipedia/commons/0/0e/PlayStation_Portable_logo.svg",
    "ps_vita.svg": "https://upload.wikimedia.org/wikipedia/commons/6/6d/PlayStation_Vita_logo.svg",
    
    # Xbox
    "xbox_original.svg": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xbox_logo_%282001%E2%80%932005%29.svg",
    "xbox_360.svg": "https://upload.wikimedia.org/wikipedia/commons/2/29/Xbox_360_logo_and_wordmark.svg",
    "xbox_one.svg": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Xbox_one_logo.svg",
    "xbox_series.svg": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Xbox_Series_X_S_black.svg",
    
    # Nintendo Home
    "nes.svg": "https://upload.wikimedia.org/wikipedia/commons/b/b2/Nintendo_Entertainment_System_logo.svg",
    "snes.svg": "https://upload.wikimedia.org/wikipedia/commons/3/33/Super_Nintendo_Entertainment_System_logo.svg",
    "n64.svg": "https://upload.wikimedia.org/wikipedia/commons/2/24/Nintendo_64_Logo.svg",
    "gamecube.svg": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Nintendo_GameCube_Logo.svg",
    "wii.svg": "https://upload.wikimedia.org/wikipedia/commons/7/77/Wii.svg",
    "wiiu.svg": "https://upload.wikimedia.org/wikipedia/commons/c/ca/Wii_U_Logo.svg",
    "switch.svg": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Nintendo.svg",
    
    # Nintendo Handheld
    "gameboy.svg": "https://upload.wikimedia.org/wikipedia/commons/f/f4/Game_Boy_Logo.svg",
    "ds.svg": "https://upload.wikimedia.org/wikipedia/commons/1/18/Nintendo_DS_Lite_logo.svg",
    "3ds.svg": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Nintendo_3DS_logo.svg",
    "gba.svg": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Game_Boy_Advance_logo.svg",
    
    # Sega
    "master_system.svg": "https://upload.wikimedia.org/wikipedia/commons/e/ea/Sega_Master_System_logo.svg",
    "mega_drive.svg": "https://upload.wikimedia.org/wikipedia/commons/8/87/Sega_Mega_Drive_logo.svg",
    "saturn.svg": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Sega_Saturn_logo.svg",
    "dreamcast.svg": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Dreamcast_logo.svg",
}

def main():
    headers = {'User-Agent': 'Mozilla/5.0'}
    for filename, url in OFFICIAL_SVGS.items():
        filepath = os.path.join(LOGOS_DIR, filename)
        if os.path.exists(filepath) and os.path.getsize(filepath) > 500: # skip if already exists and is a valid size
            print(f"Skipping {filename}, already exists")
            continue
            
        print(f"Downloading {filename}...")
        for attempt in range(3):
            try:
                r = requests.get(url, headers=headers)
                if r.status_code == 429:
                    print(f"  Rate limited, waiting 3 seconds...")
                    time.sleep(3)
                    continue
                r.raise_for_status()
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(r.text)
                print(f"  Success: {filename}")
                time.sleep(1) # Be nice to the server
                break
            except Exception as e:
                print(f"  Failed: {e}")
                time.sleep(2)

if __name__ == "__main__":
    main()
