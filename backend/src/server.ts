import dotenv from 'dotenv';
dotenv.config(); // Doit être TOUT EN HAUT

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import './db'; // Charge le client Supabase

import contactRoute from './routes/contact';
import analyticsRoutes from './routes/analytics';
import projectRoutes from './routes/projectRoutes';
import messageRoutes from './routes/messageRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// 1. S'assurer que le dossier 'uploads' existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 2. Configuration CORS simple et universelle
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://charosoft.vercel.app',
  'https://charosoft-app.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // Autoriser si l'origine est dans la liste ou si la requête n'a pas d'en-tête origin (ex: mobile, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, origin); // Autoriser les autres origines en prod
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

// 3. Middlewares pour lire le JSON
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// 4. Définition des routes API
app.use('/api/analytics', analyticsRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', contactRoute);

// Service des fichiers statiques
app.use('/uploads', express.static(uploadsDir));

// Route de test
app.get('/', (_req: Request, res: Response) => {
  res.send('🚀 Backend Charosoft opérationnel !');
});

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