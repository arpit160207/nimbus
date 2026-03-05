export const API_BASE_URL = import.meta.env.PROD
    ? '/api/v1'
    : 'http://localhost:8000/api/v1';

export const getHeaders = (token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};
