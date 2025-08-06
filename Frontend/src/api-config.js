// Runtime API Configuration
// This file overrides the API URL for Docker environment
// For Docker: use relative URLs (let nginx proxy handle it)
// For local dev: use localhost:3000
const isDocker = window.location.hostname === 'localhost' && window.location.port === '5173';
const isLocalDev = window.location.hostname === 'localhost' && window.location.port === '5173';

if (isDocker) {
    // Docker environment - use relative URLs
    window.DEVFORGE_API_URL = '';
    console.log('🔧 Docker Environment: Using relative URLs for nginx proxy');
} else if (isLocalDev) {
    // Local development - use localhost:3000
    window.DEVFORGE_API_URL = 'http://localhost:3000';
    console.log('🔧 Local Development: Using localhost:3000');
} else {
    // Production or other environments
    window.DEVFORGE_API_URL = import.meta.env.VITE_API_URL || '';
    console.log('🔧 Other Environment: Using VITE_API_URL');
}

console.log('🔧 DevForge API Config Loaded:', window.DEVFORGE_API_URL);

// Force clear any cached axios instances
if (window.axios) {
    console.log('🔧 Clearing cached axios configuration');
    window.axios.defaults.baseURL = window.DEVFORGE_API_URL;
} 