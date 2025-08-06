/**
 * Authentication Test Script
 * 
 * This script helps test the authentication flow in both development and production.
 * Run it with: node test-auth.js
 */

const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
let API_URL = process.env.API_URL || 'http://localhost:5000';
let testEmail = 'test@example.com';
let testPassword = 'password123';
let testUsername = 'testuser';

// Store cookies between requests
const cookieJar = [];

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include cookies
api.interceptors.request.use(config => {
  if (cookieJar.length > 0) {
    config.headers.Cookie = cookieJar.join('; ');
  }
  return config;
});

// Add response interceptor to capture cookies
api.interceptors.response.use(response => {
  const setCookie = response.headers['set-cookie'];
  if (setCookie) {
    setCookie.forEach(cookie => {
      const cookiePart = cookie.split(';')[0];
      if (!cookieJar.includes(cookiePart)) {
        cookieJar.push(cookiePart);
      }
    });
  }
  return response;
});

// Test functions
async function testHealth() {
  console.log('\n🔍 Testing server health...');
  try {
    const response = await api.get('/health');
    console.log('✅ Server is healthy:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

async function testCors() {
  console.log('\n🔍 Testing CORS configuration...');
  try {
    const response = await api.get('/api/cors-test');
    console.log('✅ CORS is configured correctly:', response.data);
    return true;
  } catch (error) {
    console.error('❌ CORS test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

async function testSignup() {
  console.log('\n🔍 Testing signup...');
  try {
    const response = await api.post('/api/signup', {
      email: testEmail,
      password: testPassword,
      username: testUsername
    });
    console.log('✅ Signup response:', response.data);
    console.log('📋 Cookies:', cookieJar);
    return response.data.success;
  } catch (error) {
    console.error('❌ Signup failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

async function testLogin() {
  console.log('\n🔍 Testing login...');
  try {
    const response = await api.post('/api/login', {
      email: testEmail,
      password: testPassword
    });
    console.log('✅ Login response:', response.data);
    console.log('📋 Cookies:', cookieJar);
    return response.data.success;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

async function testVerification() {
  console.log('\n🔍 Testing token verification...');
  try {
    const response = await api.post('/api/');
    console.log('✅ Verification response:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting authentication tests');
  console.log(`🔗 API URL: ${API_URL}`);
  
  // Test server health
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('❌ Server health check failed. Aborting tests.');
    return;
  }
  
  // Test CORS
  const corsOk = await testCors();
  if (!corsOk) {
    console.warn('⚠️ CORS test failed. This might cause issues with the frontend.');
  }
  
  // Test signup
  const signupOk = await testSignup();
  if (!signupOk) {
    console.warn('⚠️ Signup failed. This might be because the user already exists.');
  }
  
  // Test login
  const loginOk = await testLogin();
  if (!loginOk) {
    console.error('❌ Login failed. Authentication flow is broken.');
    return;
  }
  
  // Test verification
  const verificationOk = await testVerification();
  if (!verificationOk) {
    console.error('❌ Token verification failed. Authentication flow is broken.');
    return;
  }
  
  console.log('\n✅ All tests completed successfully!');
  console.log('🎉 Authentication flow is working correctly.');
}

// Ask for API URL
rl.question(`Enter API URL (default: ${API_URL}): `, (url) => {
  if (url) API_URL = url;
  
  rl.question(`Enter test email (default: ${testEmail}): `, (email) => {
    if (email) testEmail = email;
    
    rl.question(`Enter test password (default: ${testPassword}): `, (password) => {
      if (password) testPassword = password;
      
      rl.question(`Enter test username (default: ${testUsername}): `, (username) => {
        if (username) testUsername = username;
        
        rl.close();
        runTests();
      });
    });
  });
});