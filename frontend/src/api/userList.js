import client from './client';

export const userListApi = {
    // Get user's list with pagination
    getList: async (listIdOrName = 'ALL', page = 0, size = 50) => {
        const response = await client.get(`/user/list/${listIdOrName}`, {
            params: { page, size }
        });
        return response.data;
    },

    // Get all user lists
    getLists: async () => {
        const response = await client.get('/user/list/lists');
        return response.data;
    },

    // Add a new game to the list
    addItem: async ({ gameId, status, personalRating, review, replayCount, startedAt, completedAt, priority }) => {
        const response = await client.post('/user/list', {
            gameId, status, personalRating, review, replayCount, startedAt, completedAt, priority
        });
        return response.data;
    },

    // Update an existing item fully (PUT body, no path param for gameId)
    updateItem: async (gameId, { status, personalRating, review, replayCount, startedAt, completedAt, priority }) => {
        const response = await client.put('/user/list', {
            gameId, status, personalRating, review, replayCount, startedAt, completedAt, priority
        });
        return response.data;
    },

    // Patch an item's status only
    patchItemStatus: async (gameId, status) => {
        const response = await client.patch(`/user/list/${gameId}`, { status });
        return response.data;
    },

    // Remove an item entirely
    removeItem: async (gameId) => {
        const response = await client.delete(`/user/list/${gameId}`);
        return response.data;
    },

    // Get user profile (stats, recent, preferences)
    getUserProfile: async (username) => {
        const response = await client.get(`/users/${username}`);
        return response.data;
    },

    // Update user preferences
    updatePreferences: async (username, preferences) => {
        const response = await client.put(`/users/${username}/preferences`, preferences);
        return response.data;
    },

    // Get the community users list
    getCommunityUsers: async () => {
        const response = await client.get('/users');
        return response.data;
    },

    // Get another user's public list
    getPublicList: async (username, listIdOrName = 'ALL', page = 0, size = 50) => {
        const response = await client.get(`/users/${username}/list/${listIdOrName}`, {
            params: { page, size }
        });
        return response.data;
    }
};
