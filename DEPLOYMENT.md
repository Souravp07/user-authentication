# Deployment Guide for MERN Authentication Project

This guide provides step-by-step instructions for deploying your MERN authentication project to Vercel (frontend) and Render (backend).

## Backend Deployment (Render)

### 1. Prepare Your Backend Code

- Ensure your CORS configuration includes your Vercel domain
- Set cookie options with `SameSite=None` and `Secure=true` for production
- Make sure all environment variables are properly configured

### 2. Create a Render Account

- Sign up at [render.com](https://render.com)
- Connect your GitHub repository

### 3. Create a New Web Service

- Click "New" and select "Web Service"
- Connect your repository
- Configure the service:
  - **Name**: `user-authentication-backend` (or your preferred name)
  - **Runtime**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `node index.js`
  - **Root Directory**: `server` (if your repo contains both client and server)

### 4. Configure Environment Variables

- In the Render dashboard, go to your service's "Environment" tab
- Add the following variables:
  ```
  MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
  JWT_SECRET=your_secure_jwt_secret_key
  FRONTEND_URL=https://your-frontend-url.vercel.app
  NODE_ENV=production
  ```

### 5. Deploy the Backend

- Click "Create Web Service"
- Wait for the deployment to complete
- Note your service URL (e.g., `https://user-authentication-backend.onrender.com`)

## Frontend Deployment (Vercel)

### 1. Prepare Your Frontend Code

- Update your API configuration to use environment variables
- Ensure your API calls include `withCredentials: true`
- Add proper error handling for API requests

### 2. Create a Vercel Account

- Sign up at [vercel.com](https://vercel.com)
- Connect your GitHub repository

### 3. Import Your Project

- Click "Add New..." → "Project"
- Select your repository
- Configure the project:
  - **Framework Preset**: Create React App
  - **Root Directory**: `client` (if your repo contains both client and server)

### 4. Configure Environment Variables

- In the Vercel dashboard, go to your project's "Settings" → "Environment Variables"
- Add the following variable:
  ```
  REACT_APP_API_URL=https://your-backend-url.onrender.com
  ```

### 5. Deploy the Frontend

- Click "Deploy"
- Wait for the deployment to complete
- Your app will be available at a URL like `https://your-project.vercel.app`

## Testing Your Deployment

### 1. Test API Connectivity

- Visit `https://your-backend-url.onrender.com/health` in your browser
- You should see a JSON response confirming the server is running

### 2. Test CORS Configuration

- Visit your frontend URL
- Open browser developer tools (F12)
- Go to the Console tab
- Check for any CORS-related errors

### 3. Test Authentication Flow

1. Sign up with a new account
2. Check the Network tab in developer tools to verify:
   - The request is sent to the correct backend URL
   - The response includes a Set-Cookie header
   - The cookie is properly set in the browser

3. Log out and log back in to verify the authentication flow works

## Troubleshooting

### CORS Issues

- Verify your backend CORS configuration includes your Vercel domain
- Check for any typos in the domain names
- Ensure the protocol (https://) is included in the CORS origin list

### Cookie Issues

- Verify cookies are set with `SameSite=None` and `Secure=true` in production
- Check that `withCredentials: true` is set in your frontend API calls
- Ensure your browser accepts third-party cookies

### Environment Variable Issues

- Double-check all environment variables are correctly set in both Vercel and Render
- Verify the variable names match what your code expects
- Remember that environment variables are case-sensitive

### Network Issues

- Check the Network tab in developer tools for any failed requests
- Verify your backend is actually running (check the Render logs)
- Test your backend endpoints directly using tools like Postman

## Maintenance

- Monitor your Render logs for any backend errors
- Set up automatic deployments for both frontend and backend
- Consider adding monitoring tools to track your application's performance