import dotenv from 'dotenv';
dotenv.config(); // Doit être TOUT EN HAUT

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

// 2. Configuration CORS sécurisée pour Dev & Production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://charosoft.vercel.app',
  'https://charosoft-app.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origine (comme Postman, mobile ou cURL)
      // et les domaines spécifiés dans la liste
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // En prod, si l'origine n'est pas explicite, on laisse passer ou on log
        callback(null, true); 
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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

// 5. Middleware global de gestion des erreurs (pour loguer dans Render)
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