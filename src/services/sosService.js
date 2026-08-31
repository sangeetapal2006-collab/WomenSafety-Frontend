import api from './api';

export const sosService = {
  triggerSOS: async (sosData) => {
    const res = await api.post('/sos/trigger', sosData);
    return res.data;
  },

  getHistory: async () => {
    const res = await api.get('/sos/history');
    return res.data;
  },

  getActiveSOS: async () => {
    const res = await api.get('/sos/active');
    return res.data;
  },

  resolveSOS: async (id, resolveData) => {
    const res = await api.put(`/sos/${id}/resolve`, resolveData);
    return res.data;
  }
};
