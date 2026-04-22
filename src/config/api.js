// API Configuration
// In production, use relative URLs so nginx proxies /api to the backend
// In development, use localhost:5001 (backend server default)

const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? 'http://localhost:3002' 
  : 'https://api.travelofaredeals.com';  // Empty string for production - uses relative URLs through nginx

export const SOCKET_URL = isDevelopment
  ? 'http://localhost:3002'
  : 'https://api.travelofaredeals.com';  // Use same origin for production websocket

export default API_URL;
