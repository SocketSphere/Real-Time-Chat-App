// Production backend URL from environment variable
// Fallback to localhost for development
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

console.log('API URL configured:', API_URL);
console.log('WebSocket URL configured:', WS_URL);