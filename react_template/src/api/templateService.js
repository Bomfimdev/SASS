import apiClient from './apiClient';

const templateService = {
  getTemplates: async (filters = {}) => {
    const response = await apiClient.get('/templates', { params: filters });
    return response.data;
  },
  
  getTemplateById: async (id) => {
    const response = await apiClient.get(`/templates/${id}`);
    return response.data;
  },
  
  createTemplate: async (templateData) => {
    const response = await apiClient.post('/templates', templateData);
    return response.data;
  },
  
  updateTemplate: async (id, templateData) => {
    const response = await apiClient.put(`/templates/${id}`, templateData);
    return response.data;
  },
  
  deleteTemplate: async (id) => {
    await apiClient.delete(`/templates/${id}`);
    return true;
  },
  
  duplicateTemplate: async (id) => {
    const response = await apiClient.post(`/templates/${id}/duplicate`);
    return response.data;
  },
  
  uploadTemplateImage: async (templateId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(`/templates/${templateId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  },
  
  getPublicTemplates: async (category) => {
    const response = await apiClient.get('/templates/public', {
      params: { category }
    });
    return response.data;
  },
  
  previewTemplate: async (templateData) => {
    const response = await apiClient.post('/templates/preview', templateData, {
      responseType: 'blob'
    });
    return response.data;
  }
};

export default templateService;