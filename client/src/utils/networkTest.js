/**
 * Network Test Utility
 * 
 * This utility provides a simple way to test network connectivity
 * without relying on the API instance.
 */

import axios from 'axios';

/**
 * Test direct connection to a URL without using the configured API instance
 * @param {string} url - The URL to test
 * @param {Object} options - Additional options for the request
 * @returns {Promise<Object>} - Result of the test
 */
export const testDirectConnection = async (url = 'https://user-authentication-icm4.onrender.com', options = {}) => {
  try {
    console.log(`🔍 Testing direct connection to ${url}${options.endpoint || '/'}...`);
    const startTime = Date.now();
    
    // Create a new axios instance for this test only
    const testAxios = axios.create({
      timeout: options.timeout || 15000, // 15 second timeout by default
      ...options
    });
    
    // Test endpoint
    const response = await testAxios.get(`${url}${options.endpoint || '/'}`);
    const endTime = Date.now();
    
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers,
      responseTime: `${endTime - startTime}ms`
    };
  } catch (error) {
    console.error('❌ Direct connection test failed:', error);
    
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      }
    };
  }
};

/**
 * Test connection with different configurations
 * @param {string} baseUrl - The base URL to test
 * @returns {Promise<Object>} Test results with different configurations
 */
export const runNetworkDiagnostics = async (baseUrl = 'https://user-authentication-icm4.onrender.com') => {
  const clientUrl = 'https://user-authentication-client.vercel.app';
  console.log(`🔧 Running network diagnostics for ${baseUrl}...`);
  
  const results = {
    timestamp: new Date().toISOString(),
    baseUrl,
    clientUrl,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Not available',
    directConnection: null,
    withCredentials: null,
    withOrigin: null,
    withProxy: null
  };
  
  // Add browser network information if available
  if (typeof navigator !== 'undefined' && navigator.connection) {
    const connection = navigator.connection;
    results.networkInfo = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };
  } else {
    results.networkInfo = 'Not available';
  }
  
  // Test 1: Direct connection to root endpoint
  results.directConnection = await testDirectConnection(baseUrl, {
    endpoint: '/'
  });
  
  // Test 2: With credentials
  try {
    console.log(`🔍 Testing connection with credentials to ${baseUrl}/health...`);
    const startTime = Date.now();
    const testAxios = axios.create({
      timeout: 15000,
      withCredentials: true
    });
    
    const response = await testAxios.get(`${baseUrl}/health`);
    const endTime = Date.now();
    
    results.withCredentials = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      responseTime: `${endTime - startTime}ms`,
      headers: response.headers
    };
  } catch (error) {
    console.error('❌ Connection with credentials error:', error);
    results.withCredentials = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      }
    };
  }
  
  // Test 3: With Origin header
  try {
    console.log(`🔍 Testing CORS with Origin header to ${baseUrl}/api/cors-test...`);
    const startTime = Date.now();
    const testAxios = axios.create({
      timeout: 15000,
      headers: {
        'Origin': clientUrl
      },
      withCredentials: true
    });
    
    const response = await testAxios.get(`${baseUrl}/api/cors-test`);
    const endTime = Date.now();
    
    results.withOrigin = {
      success: true,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      responseTime: `${endTime - startTime}ms`,
      corsHeaders: {
        'access-control-allow-origin': response.headers['access-control-allow-origin'],
        'access-control-allow-credentials': response.headers['access-control-allow-credentials'],
        'access-control-allow-methods': response.headers['access-control-allow-methods']
      }
    };
  } catch (error) {
    console.error('❌ CORS test error:', error);
    results.withOrigin = {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      },
      corsHeaders: error.response?.headers ? {
        'access-control-allow-origin': error.response.headers['access-control-allow-origin'],
        'access-control-allow-credentials': error.response.headers['access-control-allow-credentials'],
        'access-control-allow-methods': error.response.headers['access-control-allow-methods']
      } : null
    };
  }
  
  return results;
};

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  window.networkTest = {
    testDirectConnection,
    runNetworkDiagnostics
  };
  
  console.log('✅ Network testing utilities loaded. Run window.networkTest.runNetworkDiagnostics() to test connection.');
}

export default {
  testDirectConnection,
  runNetworkDiagnostics
};