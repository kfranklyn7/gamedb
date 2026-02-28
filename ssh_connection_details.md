# Oracle Cloud SSH Connection Details

Based on our previous conversation ([97d99ea6](file:///C:/Users/kevon/.gemini/antigravity/brain/97d99ea6-5c92-432c-8247-baf440048bd8)), here are the details for connecting to your Oracle Cloud VPS.

## Server Information
- **Public IP:** `150.136.104.186`
- **Domain:** `questlog.kfranklyn.dev`
- **Operating System:** Ubuntu (Oracle Cloud Always Free AMD Instance)
- **Username:** `ubuntu`

## SSH Connection Methods

### 1. Standard SSH (Local Terminal)
If you are on a network that allows SSH traffic (Port 22), use:
```bash
ssh ubuntu@150.136.104.186
```
*or*
```bash
ssh ubuntu@questlog.kfranklyn.dev
```

### 2. Oracle Cloud Shell (Recommended for Restricted Networks)
In our previous session, we used the **Oracle Cloud Shell** because your local network (School WiFi) was blocking standard SSH ports.
1. Log in to the [Oracle Cloud Console](https://cloud.oracle.com/).
2. Click the **Cloud Shell** icon (>_) in the top right header.
3. Once the shell initializes, you can SSH directly from there.

## Project Location on VPS
The project files are located in the following directory on the VPS:
```bash
~/gamedb
```
Common commands we used:
- `cd ~/gamedb`
- `docker compose up -d --build` (to restart the stack)
- `python3 igdbApi/sync.py` (to sync game data)

> [!NOTE]
> If you are using an SSH key (PEM/PPK), ensure you have it available on your local machine. If we set up a key in the previous session, it would typically be named something like `ssh-key-YYYY-MM-DD.key` or similar.
