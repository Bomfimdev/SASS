import apiClient from './apiClient';

const proposalService = {
  getProposals: async (filters = {}) => {
    const response = await apiClient.get('/proposals', { params: filters });
    return response.data;
  },
  
  getProposalById: async (id) => {
    const response = await apiClient.get(`/proposals/${id}`);
    return response.data;
  },
  
  createProposal: async (proposalData) => {
    const response = await apiClient.post('/proposals', proposalData);
    return response.data;
  },
  
  updateProposal: async (id, proposalData) => {
    const response = await apiClient.put(`/proposals/${id}`, proposalData);
    return response.data;
  },
  
  addProposalItem: async (proposalId, itemData) => {
    const response = await apiClient.post(`/proposals/${proposalId}/items`, itemData);
    return response.data;
  },
  
  updateProposalItem: async (proposalId, itemId, itemData) => {
    const response = await apiClient.put(`/proposals/${proposalId}/items/${itemId}`, itemData);
    return response.data;
  },
  
  deleteProposalItem: async (proposalId, itemId) => {
    await apiClient.delete(`/proposals/${proposalId}/items/${itemId}`);
    return true;
  },
  
  sendProposal: async (id, sendData) => {
    const response = await apiClient.post(`/proposals/${id}/send`, sendData);
    return response.data;
  },
  
  generatePdf: async (id) => {
    const response = await apiClient.get(`/proposals/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  },
  
  getProposalAnalytics: async (id) => {
    const response = await apiClient.get(`/proposals/${id}/analytics`);
    return response.data;
  },
  
  getProposalStatus: async (id) => {
    const response = await apiClient.get(`/proposals/${id}/status`);
    return response.data;
  },

  getPublicProposal: async (token) => {
    const response = await apiClient.get(`/public/proposals/${token}`);
    return response.data;
  },
  
  approveProposal: async (token, approvalData) => {
    const response = await apiClient.post(`/public/proposals/${token}/approve`, approvalData);
    return response.data;
  },
  
  rejectProposal: async (token, rejectionData) => {
    const response = await apiClient.post(`/public/proposals/${token}/reject`, rejectionData);
    return response.data;
  },
  
  recordProposalView: async (token, viewData) => {
    const response = await apiClient.post(`/public/proposals/${token}/view`, viewData);
    return response.data;
  }
};

export default proposalService;