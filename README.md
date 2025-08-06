# MERN Authentication Project

This project is a full-stack MERN (MongoDB, Express, React, Node.js) authentication system with JWT tokens and HTTP-only cookies.

## Project Structure

- `/client` - React frontend (deployed on Vercel)
- `/server` - Express backend (deployed on Render)

## Deployment Instructions

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: user-authentication-backend (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Root Directory**: `server` (if your repo contains both client and server)

4. Add the following environment variables in Render dashboard:
   - `MONGO_URL`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: Your Vercel frontend URL
   - `NODE_ENV`: Set to `production`

5. Deploy the service and note the URL (e.g., `https://your-backend.onrender.com`)

### Frontend Deployment (Vercel)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client` (if your repo contains both client and server)

4. Add the following environment variable in Vercel dashboard:
   - `REACT_APP_API_URL`: Your Render backend URL (e.g., `https://your-backend.onrender.com`)

5. Deploy the project

## Troubleshooting Production Issues

If you encounter issues with authentication in production, check the following:

1. **CORS Configuration**: Ensure the backend CORS settings include your Vercel domain
2. **Cookie Settings**: Verify cookies are set with `SameSite=None` and `Secure` flags in production
3. **API URLs**: Confirm the frontend is using the correct backend URL
4. **Network Requests**: Use browser dev tools to check for network errors
5. **Environment Variables**: Verify all environment variables are correctly set in both Vercel and Render

## Local Development

### Backend

```bash
cd server
npm install
npm start
```

### Frontend

```bash
cd client
npm install
npm start
```

## Environment Variables

### Client (.env)

```
# Development API URL (uncomment when developing locally)
# REACT_APP_API_URL=http://localhost:5000

# Production API URL
REACT_APP_API_URL=https://your-backend.onrender.com
```

### Server (.env)

```
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=development # or production
```