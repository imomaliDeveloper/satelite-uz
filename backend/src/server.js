import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import questionRoutes from './routes/questionRoutes.js';
import examRoutes from './routes/examRoutes.js';
import practiceRoutes from './routes/practiceRoutes.js';
import resultRoutes from './routes/resultRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import importRoutes from './routes/importRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net", "https://www.desmos.com", "https://*.desmos.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://www.desmos.com", "https://*.desmos.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com", "https://www.desmos.com", "https://*.desmos.com"],
      imgSrc: ["'self'", "data:", "blob:", "*", "https://www.desmos.com", "https://*.desmos.com"],
      frameSrc: ["'self'", "https://www.desmos.com", "https://*.desmos.com"],
      childSrc: ["'self'", "https://www.desmos.com", "https://*.desmos.com"],
      workerSrc: ["'self'", "blob:", "https://www.desmos.com", "https://*.desmos.com"],
      connectSrc: ["'self'", "*", "https://www.desmos.com", "https://*.desmos.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Serve uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SATELITE.UZ API Docs'
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/practice', practiceRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/import', importRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ONLINE',
    service: 'SATELITE.UZ API',
    timestamp: new Date().toISOString()
  });
});

// Cloud DB initialization and sync endpoint
app.get('/api/setup/sync-database', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== 'satelite2026') {
    return res.status(403).json({ error: 'Secret required' });
  }
  try {
    const { runInitDb } = await import('./utils/initDb.js');
    const result = await runInitDb();
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
});

// Serve frontend static files
const candidates = [
  path.join(__dirname, '../public'),
  path.resolve(__dirname, '../../public'),
  path.resolve(__dirname, '../../frontend')
];
const staticPath = candidates.find(p => fs.existsSync(p)) || path.join(__dirname, '../public');

if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.use('/frontend', express.static(staticPath));

  // Client-side fallback for pretty routes or landing page
  app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  const pages = [
    'bookmarks', 'dashboard', 'exam', 'forgot-password',
    'login', 'practice', 'profile', 'question-bank',
    'register', 'results', 'review'
  ];
  pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
      res.sendFile(path.join(staticPath, `${page}.html`));
    });
    app.get(`/${page}.html`, (req, res) => {
      res.sendFile(path.join(staticPath, `${page}.html`));
    });
  });

  app.get('/admin', (req, res) => {
    res.sendFile(path.join(staticPath, 'admin/index.html'));
  });
  app.get('/admin/', (req, res) => {
    res.sendFile(path.join(staticPath, 'admin/index.html'));
  });
}

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' does not exist.`,
    error: 'ENDPOINT_NOT_FOUND'
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start server if not imported by test runner or running on serverless (Vercel)
const isServerless = !!process.env.VERCEL || !!process.env.NOW_REGION;
const isTestEnv = process.env.NODE_ENV === 'test' || process.argv.some(a => a.includes('test'));
if (!isTestEnv && !isServerless) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛰️  SATELITE.UZ Platform Server Running on Port ${PORT}`);
    console.log(`🔗  Frontend Web:    http://localhost:${PORT}`);
    console.log(`🛡️  Admin Portal:    http://localhost:${PORT}/admin/`);
    console.log(`📚  API Docs:        http://localhost:${PORT}/api-docs`);
    console.log(`=======================================================`);
  });
}

export default app;
