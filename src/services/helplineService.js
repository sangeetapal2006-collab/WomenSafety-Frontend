import api from './api';

export const helplineService = {
  getHelplines: async (params = {}) => {
    const res = await api.get('/helplines', { params });
    return res.data;
  },

  getHelplineById: async (id) => {
    const res = await api.get(`/helplines/${id}`);
    return res.data;
  },

  createHelpline: async (data) => {
    const res = await api.post('/helplines', data);
    return res.data;
  },

  updateHelpline: async (id, data) => {
    const res = await api.put(`/helplines/${id}`, data);
    return res.data;
  },

  deleteHelpline: async (id) => {
    const res = await api.delete(`/helplines/${id}`);
    return res.data;
  }
};
