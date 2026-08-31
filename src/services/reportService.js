import api from './api';

export const reportService = {
  submitReport: async (formData) => {
    const res = await api.post('/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return res.data;
  },

  getMyReports: async (params = {}) => {
    const res = await api.get('/reports/my-reports', { params });
    return res.data;
  },

  getReportById: async (id) => {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },

  getPublicSafetyMap: async () => {
    const res = await api.get('/reports/public-map');
    return res.data;
  }
};
