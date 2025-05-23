import apiClient from './apiClient';

const customerService = {
  getCustomers: async (filters = {}) => {
    const response = await apiClient.get('/customers', { params: filters });
    return response.data;
  },
  
  getCustomerById: async (id) => {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data;
  },
  
  createCustomer: async (customerData) => {
    const response = await apiClient.post('/customers', customerData);
    return response.data;
  },
  
  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`/customers/${id}`, customerData);
    return response.data;
  },
  
  deleteCustomer: async (id) => {
    await apiClient.delete(`/customers/${id}`);
    return true;
  },
  
  getCustomerProposals: async (id, filters = {}) => {
    const response = await apiClient.get(`/customers/${id}/proposals`, { params: filters });
    return response.data;
  },
  
  importCustomers: async (customersData) => {
    const response = await apiClient.post('/customers/import', customersData);
    return response.data;
  },
  
  exportCustomers: async () => {
    const response = await apiClient.get('/customers/export', {
      responseType: 'blob'
    });
    return response.data;
  },
  
  searchCustomers: async (searchTerm) => {
    const response = await apiClient.get('/customers/search', {
      params: { q: searchTerm }
    });
    return response.data;
  }
};

export default customerService;