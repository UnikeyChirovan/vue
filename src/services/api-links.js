// services/api-link.js
import api from './axiosInterceptor';
import axios from 'axios';
const baseUrl = 'http://127.0.0.1:8000'

const apiLinks = {
  notifications: {
    getAll: () => axios.get(`${baseUrl}/api/user-notifications`),
    getDetail: (id) => axios.get(`${baseUrl}/api/user-notifications/${id}`),
    create: (data) => api.post('/user-notifications', data),
    updateText: (id, data) => api.put(`/user-notifications/${id}/text`, data),
    delete: (id) => api.delete(`/user-notifications/${id}`),
  },
  auth: {
    resetPassword: (data) => api.post('/auth/password-reset', data),
    resetPasswordRequest: (data) => api.post('/auth/password-reset-request', data),
    register: (data) => axios.post(`${baseUrl}/api/auth/register`, data),
    login: (data) => axios.post(`${baseUrl}/api/auth/login`, data),
    logout: () => api.post('/auth/logout'),
    forceLogout: (userId) => api.post('/auth/force-logout', { user_id: userId }),
    verifyEmail: () => api.get('/auth/verify-email'),
    refreshToken: () => api.post('/auth/refresh'),
  },
  votes: {
    createOrUpdate: (data) => api.post('/vote/createOrUpdate', data),
    getUserVote: () => api.get('/vote/getUserVote'),
    getVoteResults: () => api.get('/vote/results'),
  },
  newsletter: {
    subscribe: (email) => axios.post(`${baseUrl}/api/newsletter/subscribe`, { email }),
    unsubscribe: () => api.get('/newsletter/unsubscribe'),
    createNotification: (data) => api.post('/newsletter/notifications/create', data),
    getAllNotifications: () => api.get('/newsletter/notifications'),
    deleteNotification: (id) => api.delete(`/newsletter/notifications/${id}`),
  },
  users: {
    create: (data) => api.post('/users', data),
    getData: () => api.get('/create'),
    getAll: () => api.get('/users'),
    edit: (id) => api.get(`/users/${id}/edit`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    getAllDeviceInfo: () => api.get('/users/device-info'),
    getAllBlacklist: () => api.get('/users/blacklist'),
    transferToBlacklist: (userId) => api.post(`/users/transfer-to-blacklist/${userId}`),
    deleteFromBlacklist: (id) => api.delete(`/users/blacklist/${id}`),
    getAllRequestLogs: () => api.get('/users/request-logs'),
    deleteRequestLog: (id) => api.delete(`/users/request-log/${id}`),
    deleteAllRequestLogs: () => api.delete('/users/request-logs'),
    transferFromRequestLog: (id) => api.post(`/users/transfer-from-request-log/${id}`),
  },
  upload: {
    uploadAvatar: (data) => api.post('/link/upload/avatar', data),
    uploadCover: (data) => api.post('/link/upload/cover', data),
    updateCoverPosition: (data) => api.patch('/link/update/cover-position', data),
    deleteAvatar: (id) => api.delete(`/link/${id}/avatar`),
    deleteCover: (id) => api.delete(`/link/${id}/cover`),
  },
  profile: {
    show: (id) => api.get(`/profile/${id}`),
    edit: (id) => api.get(`/profile/${id}/edit`),
    update: (id, data) => api.put(`/profile/${id}`, data),
    updatePosition: (id, data) => api.put(`/profile/${id}/position`, data),
  },
  story: {
    getChapters: () => api.get('/story/chapters'),
    getChapter: (id) => api.get(`/story/chapters/${id}`),
    getBackgrounds: () => api.get('/story/backgrounds'),
    getImage: (id) => api.get(`/story/backgrounds/${id}`),
    saveSettings: (data) => api.post('/story/save-settings', data),
    getSettings: (userId) => api.get(`/story/${userId}/settings`),
    updateSettings: (data) => api.put('/story/settings', data),
    saveCurrentChapter: (data) => api.post('/story/user-chapter', data),
    getLastReadChapter: () => api.get('/story/user-chapter'),
    uploadBackground: (data) => api.post('/story/upload-background', data),
    updateChapter: (id, data) => api.put(`/story/chapters/${id}`, data),
    createChapter: (data) => api.post('/story/chapters', data),
    deleteChapter: (id) => api.delete(`/story/chapters/${id}`),
    updateBackground: (id, data) => api.put(`/story/backgrounds/${id}`, data),
    deleteBackground: (id) => api.delete(`/story/backgrounds/${id}`),
  },
  imageManager: {
    uploadImage: (data) => api.post('/image-manager/upload', data),
    getImages: () => api.get('/image-manager'),
    getImage: (id) => api.get(`/image-manager/${id}`),
    updateImage: (id, data) => api.put(`/image-manager/${id}`, data),
    deleteImage: (id) => api.delete(`/image-manager/${id}`),
  },
  sections: {
    getAll: () => api.get('/sections'),
    createSection: (data) => api.post('/sections', data),
    getSection: (id) => api.get(`/sections/${id}`),
    updateSection: (id, data) => api.put(`/sections/${id}`, data),
    deleteSection: (id) => api.delete(`/sections/${id}`),
  },
  categories: {
    getAll: () => api.get('/categories'),
    getCategory: (id) => api.get(`/categories/${id}`),
    createCategory: (data) => api.post('/categories', data),
    updateCategory: (id, data) => api.put(`/categories/${id}`, data),
    deleteCategory: (id) => api.delete(`/categories/${id}`),
  },
  noauth: {
    postContact: (data) => axios.post(`${baseUrl}/noauth/contact`, data),
    getContacts: () => api.get('/noauth/contacts'),
    deleteContact: (id) => api.delete(`/noauth/contacts/${id}`),
    replyEmail: (data) => api.post('/noauth/reply-email', data),
  },
  companyInfo: {
    getAll: () => api.get('/company-info'),
    getDetail: (id) => api.get(`/company-info/${id}`),
    create: (data) => api.post('/company-info', data),
    update: (id, data) => api.put(`/company-info/${id}`, data),
    delete: (id) => api.delete(`/company-info/${id}`),
  },
  heroSlides: {
    getAll: () => api.get('/hero-slides'),
    getDetail: (id) => api.get(`/hero-slides/${id}`),
    create: (data) => api.post('/hero-slides', data),
    update: (id, data) => api.put(`/hero-slides/${id}`, data),
    delete: (id) => api.delete(`/hero-slides/${id}`),
  },
  futureProjects: {
    getAll: () => api.get('/future-projects'),
    getDetail: (id) => api.get(`/future-projects/${id}`),
    create: (data) => api.post('/future-projects', data),
    update: (id, data) => api.put(`/future-projects/${id}`, data),
    delete: (id) => api.delete(`/future-projects/${id}`),
  },
  features: {
    getAll: () => api.get('/features'),
    getDetail: (id) => api.get(`/features/${id}`),
    create: (data) => api.post('/features', data),
    update: (id, data) => api.put(`/features/${id}`, data),
    delete: (id) => api.delete(`/features/${id}`),
  },
    videos: {
    getAll: () => api.get('/video-manager'),
    getDetail: (id) => api.get(`/video-manager/${id}`),
    create: (data) => api.post('/video-manager/upload', data),
    update: (id, data) => api.put(`/video-manager/${id}`, data),
    delete: (id) => api.delete(`/video-manager/${id}`),
    getLastWatchEpisode: () => api.get('/videos/user-episode'),
  },

};

export default apiLinks;
