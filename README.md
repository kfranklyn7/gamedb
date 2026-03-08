# QuestLog Archive

A high-performance "hacker terminal" and "physical archive" inspired game database and quest tracker.

## Features

- **Terminal Aesthetic**: Monospace typography, CRT-inspired visual effects, and a data-dense layout.
- **Physical Archive Hybrid**: "Cartridge" and "Case" views for a tactile, nostalgic feel.
- **Quest Tracker**: Log your gaming journey with detailed notes, scores, and status updates.
- **Advanced Search**: Powered by IGDB metadata and MongoDB full-text search.
- **Customizable Experience**: Toggle terminal effects, border styles, and UI density.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons.
- **Backend**: Spring Boot, Java 25, Spring Data MongoDB.
- **Database**: MongoDB.
- **Data Source**: IGDB API.

## Project Structure

- `/frontend`: React application (Vite).
- `/src/main/java`: Spring Boot backend.
- `/igdbApi`: Python scripts for data synchronization.

## Getting Started

### Prerequisites

- Java 25
- Node.js 20+
- MongoDB
- Twitch/IGDB API Credentials

### Configuration

Create a `.env` file in the root directory (see `.env.example`).

### Running the App

1. **Backend**: `./gradlew bootRun`
2. **Frontend**: `cd frontend && npm install && npm run dev`
3. **Data Sync**: `cd igdbApi && pip install -r requirements.txt && python fix_covers.py`
