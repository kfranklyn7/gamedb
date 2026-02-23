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
        const response = await client.get('/genres');
        return response.data;
    },

    getPlatforms: async () => {
        const response = await client.get('/platforms');
        return response.data;
    }
};
