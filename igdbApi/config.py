# Mapping of endpoints to their MongoDB collections and requested fields

ENDPOINTS = {
    'genres': {
        'collection': 'genres',
        'fields': 'id, name, slug;',
        'limit': 500,
        'where': ''
    },
    'themes': {
        'collection': 'themes',
        'fields': 'id, name, slug;',
        'limit': 500,
        'where': ''
    },
    'platforms': {
        'collection': 'platforms',
        'fields': 'id, name, abbreviation, slug, category, generation;',
        'limit': 500,
        'where': ''
    },
    'keywords': {
        'collection': 'keywords',
        'fields': 'id, name, slug;',
        'limit': 500,
        'where': ''
    },
    'game_modes': {
        'collection': 'gameModes',
        'fields': 'id, name, slug;',
        'limit': 500,
        'where': ''
    },
    'companies': {
        'collection': 'companies',
        'fields': 'id, name, slug, description, developed, published, url;',
        'limit': 500,
        'where': ''
    },
    'involved_companies': {
        'collection': 'involvedCompanies',
        'fields': 'id, company, game, developer, publisher, supporting, porting;',
        'limit': 500,
        'where': ''
    },
    'franchises': {
        'collection': 'franchises',
        'fields': 'id, name, slug, games;',
        'limit': 500,
        'where': ''
    },
    'collections': {
        'collection': 'collections',
        'fields': 'id, name, slug, games, type;',
        'limit': 500,
        'where': ''
    },
    'covers': {
        'collection': 'covers',
        'fields': 'id, game, height, width, image_id, url;',
        'limit': 500,
        'where': ''
    },
    'artworks': {
        'collection': 'artworks',
        'fields': 'id, game, height, width, image_id, url;',
        'limit': 500,
        'where': ''
    },
    'screenshots': {
        'collection': 'screenshots',
        'fields': 'id, game, height, width, image_id, url;',
        'limit': 500,
        'where': ''
    },
    'release_dates': {
        'collection': 'releaseDates',
        'fields': 'id, game, category, platform, date, human, m, y;',
        'limit': 500,
        'where': ''
    },
    'game_videos': {
        'collection': 'videos',
        'fields': 'id, game, name, video_id;',
        'limit': 500,
        'where': ''
    },
    'websites': {
        'collection': 'websites',
        'fields': 'id, game, category, trusted, url;',
        'limit': 500,
        'where': ''
    },
    'player_perspectives': {
        'collection': 'playerPerspectives',
        'fields': 'id, name, slug;',
        'limit': 500,
        'where': ''
    },
    'game_engines': {
        'collection': 'gameEngines',
        'fields': 'id, name, slug, url;',
        'limit': 500,
        'where': ''
    },
    'age_ratings': {
        'collection': 'ageRatings',
        'fields': 'id, category, rating;',
        'limit': 500,
        'where': ''
    },
    'language_supports': {
        'collection': 'languageSupports',
        'fields': 'id, game, language, language_support_type;',
        'limit': 500,
        'where': ''
    },
    'multiplayer_modes': {
        'collection': 'multiplayerModes',
        'fields': 'id, game, campaigncoop, dropin, lancoop, offlinecoop, onlinecoop, splitscreen, onlinecoopmax, offlinecoopmax;',
        'limit': 500,
        'where': ''
    },
    'games': {
        'collection': 'games',
        'fields': 'id, name, slug, summary, storyline, category, first_release_date, themes, genres, platforms, game_modes, keywords, involved_companies, cover, artworks, screenshots, franchises, total_rating, total_rating_count, hypes, parent_game, dlcs, expansions, remakes, remasters, similar_games',
        'limit': 500,
        'where': 'category = (0, 8, 9, 10, 11)'
    }
}
