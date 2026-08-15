import dotenv from 'dotenv';
dotenv.config(); // Doit être TOUT EN HAUT
import contactRoute from './routes/contact';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import './db'; // Charge le client Supabase

import projectRoutes from './routes/projectRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. S'assurer que le dossier 'uploads' existe sur le disque
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Configuration CORS universelle / tolérante pour Dev & Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://charosoft.vercel.app',
  'https://charosoft-app.vercel.app',
];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Si pas d'origine (Postman, mobile, server-to-server) ou origine dans la whitelist
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Pour éviter les blocages en prod, on autorise l'origine entrante dynamiquement
      callback(null, origin);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200, // Important pour la compatibilité des requêtes preflight OPTIONS
};

// Application du middleware CORS sur toutes les routes
app.use(cors(corsOptions));

// Gestion explicite des requêtes Preflight OPTIONS
app.options('*', cors(corsOptions));

// 3. Middlewares pour lire le JSON et les données de formulaires
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Service des fichiers statiques (images / fichiers uploadés)
app.use('/uploads', express.static(uploadsDir));

// 4. Définition des routes API
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// Route de test
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Backend Charosoft opérationnel !');
});
app.use('/api', contactRoute); // Rend la route disponible sur /api/contact

// 5. Middleware global de gestion des erreurs
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('❌ Erreur serveur :', err.stack || err.message);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue sur le serveur.',
    error: err.message,
  });
});

// 6. Lancement du serveur
app.listen(PORT, () => {
  console.log(`🌐 Serveur démarré avec succès sur le port ${PORT}`);
});