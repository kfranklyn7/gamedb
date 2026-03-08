import client from './client';

export const authApi = {
    login: async (credentials) => {
        // credentials: { username, password }
        const response = await client.post('/auth/login', credentials);
        return response.data;
    },

    register: async (userData) => {
        // userData: { username, password }
        const response = await client.post('/auth/register', userData);
        return response.data;
    }
};
