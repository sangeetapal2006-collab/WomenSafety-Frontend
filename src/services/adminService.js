import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const res = await api.get('/admin/dashboard-stats');
    return res.data;
  },

  getAllReports: async (params = {}) => {
    const res = await api.get('/admin/reports', { params });
    return res.data;
  },

  updateReportStatus: async (id, data) => {
    const res = await api.put(`/admin/reports/${id}/status`, data);
    return res.data;
  },

  getAllUsers: async (params = {}) => {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  toggleUserStatus: async (id) => {
    const res = await api.put(`/admin/users/${id}/toggle-status`);
    return res.data;
  },

  getAllSOSEvents: async (params = {}) => {
    const res = await api.get('/admin/sos', { params });
    return res.data;
  },

  getAuditLogs: async (params = {}) => {
    const res = await api.get('/admin/audit-logs', { params });
    return res.data;
  }
};
