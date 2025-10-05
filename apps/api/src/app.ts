import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import habitsRoutes from "./modules/habits/habits.routes";
import streaksRoutes from "./modules/streaks/streaks.routes";
import progressRoutes from "./modules/progress/progress.routes";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth.middleware";
import { debugJwtToken } from "./utils/jwt-debug";
import env from "./config/env"; // Import env config

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();
const PORT = env.PORT || 8080; // Use env config instead of hardcoded value

// Middleware
app.use(helmet());
// Update CORS configuration to allow Railway deployment
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    /\.vercel\.app$/,  // Vercel deployments
    /\.railway\.app$/, // Railway deployments
    /\.up\.railway\.app$/, // Your specific Railway deployment
    'https://rare-integrity-production.up.railway.app'
  ],
  credentials: true
}));
app.use(express.json());

// Debug endpoint for JWT validation
app.post("/debug-jwt", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(400).json({ error: "Authorization header missing" });
  }
  
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(400).json({ error: "Bearer token missing" });
  }
  
  const result = await debugJwtToken(token);
  return res.json(result);
});

// Test endpoint for JWT validation with middleware
app.post("/test-jwt", authMiddleware, (req, res) => {
  const user = (req as any).user;
  return res.json({ 
    success: true, 
    message: "JWT token is valid",
    user: {
      id: user.id,
      email: user.email,
      aud: user.aud
    }
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/habits", habitsRoutes);
app.use("/streaks", streaksRoutes);
app.use("/progress", progressRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  return res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;