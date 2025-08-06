/**
 * Frontend Connection Test Utility
 * 
 * This utility helps test the connection between the frontend and backend.
 * It can be imported and used in development to verify API connectivity.
 */

import API from '../api';

/**
 * Test the connection to the backend API
 * @returns {Promise<Object>} Test results
 */
export const testApiConnection = async () => {
  console.log('🔍 Testing API connection...');
  const results = {
    success: false,
    health: null,
    cors: null,
    error: null
  };

  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await API.get('/health');
    results.health = healthResponse.data;
    console.log('✅ Health check successful:', healthResponse.data);

    // Test CORS
    console.log('🔍 Testing CORS configuration...');
    const corsResponse = await API.get('/api/cors-test');
    results.cors = corsResponse.data;
    console.log('✅ CORS test successful:', corsResponse.data);

    results.success = true;
  } catch (error) {
    console.error('❌ API connection test failed:', error);
    results.error = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    };
  }

  return results;
};

/**
 * Test the authentication flow
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {string} credentials.username - User username (for signup)
 * @param {boolean} isSignup - Whether to test signup or login
 * @returns {Promise<Object>} Test results
 */
export const testAuthentication = async (credentials, isSignup = false) => {
  const { email, password, username } = credentials;
  console.log(`🔍 Testing ${isSignup ? 'signup' : 'login'}...`);
  
  const results = {
    success: false,
    data: null,
    error: null,
    cookies: document.cookie ? 'Cookies present' : 'No cookies'
  };

  try {
    const endpoint = isSignup ? '/api/signup' : '/api/login';
    const payload = isSignup ? { email, password, username } : { email, password };
    
    console.log(`📡 Making API request to ${endpoint}`);
    const response = await API.post(endpoint, payload);
    
    results.data = response.data;
    results.success = response.data.success;
    results.cookies = document.cookie ? 'Cookies present' : 'No cookies';
    
    console.log(`✅ ${isSignup ? 'Signup' : 'Login'} response:`, response.data);
    console.log('📋 Cookies:', document.cookie);
  } catch (error) {
    console.error(`❌ ${isSignup ? 'Signup' : 'Login'} failed:`, error);
    results.error = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    };
  }

  return results;
};

/**
 * Run a complete connection test suite
 * @returns {Promise<Object>} Complete test results
 */
export const runConnectionTests = async () => {
  console.log('🚀 Starting frontend-backend connection tests');
  console.log(`🔗 API Base URL: ${API.defaults.baseURL}`);
  
  const results = {
    apiConnection: null,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    apiUrl: API.defaults.baseURL
  };

  // Test API connection
  results.apiConnection = await testApiConnection();
  
  return results;
};

// Export a function that can be called from the browser console
if (typeof window !== 'undefined') {
  window.testApi = {
    testConnection: testApiConnection,
    testAuth: testAuthentication,
    runTests: runConnectionTests
  };
  
  console.log('✅ API testing utilities loaded. Run window.testApi.runTests() to test connection.');
}

export default {
  testApiConnection,
  testAuthentication,
  runConnectionTests
};