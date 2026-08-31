import api from './api';

export const contactService = {
  getContacts: async () => {
    const res = await api.get('/emergency-contacts');
    return res.data;
  },

  createContact: async (contactData) => {
    const res = await api.post('/emergency-contacts', contactData);
    return res.data;
  },

  updateContact: async (id, contactData) => {
    const res = await api.put(`/emergency-contacts/${id}`, contactData);
    return res.data;
  },

  deleteContact: async (id) => {
    const res = await api.delete(`/emergency-contacts/${id}`);
    return res.data;
  }
};
