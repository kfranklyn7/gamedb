import client from './client';

export const gamesApi = {
    getGames: async ({ page = 0, size = 10, sortBy = 'total_rating', ascending = false }) => {
        const response = await client.get('/games', {
            params: { page, size, sortBy, ascending }
        });
        return response.data;
    },

    getGameById: async (id) => {
        const response = await client.get(`/games/${id}`);
        return response.data;
    },

    searchAdvanced: async (criteria) => {
        const response = await client.post('/games/search-advanced', criteria);
        return response.data;
    },

    // Reference data
    getGenres: async () => {
        const response = await client.get('/genres', { params: { size: 100, sortBy: 'name', ascending: true } });
        return response.data.content;
    },

    getPlatforms: async () => {
        const response = await client.get('/platforms', { params: { size: 500, sortBy: 'name', ascending: true } });
        return response.data.content;
    },

    getThemes: async () => {
        const response = await client.get('/themes', { params: { size: 100, sortBy: 'name', ascending: true } });
        return response.data.content;
    }
};
