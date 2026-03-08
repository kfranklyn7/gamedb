import apiClient from './client';

export const companiesApi = {
    getCompanyById: async (id) => {
        const response = await apiClient.get(`/companies/${id}`);
        return response.data;
    },
    searchCompanies: async (name) => {
        const response = await apiClient.get(`/companies/search`, {
            params: { name }
        });
        return response.data;
    }
};
