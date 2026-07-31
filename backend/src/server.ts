import dotenv from 'dotenv';
dotenv.config(); // Doit être TOUT EN HAUT

import express from 'express';
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

// 2. Middlewares globaux
app.use(cors({
  origin: 'http://localhost:5173', // URL exacte de ton frontend React/Vite
  credentials: true,
}));

// Pour lire le JSON et les gros formulaires (jusqu'à 100 Mo)
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Service des fichiers statiques (pour accéder aux images/vidéos uploadées)
app.use('/uploads', express.static(uploadsDir));

// 3. Définition des routes API
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);

// Route de test
app.get('/', (_req, res) => {
  res.send('🚀 Backend Charosoft opérationnel !');
});

// 4. Lancement permanent du serveur
app.listen(PORT, () => {
  console.log(`🌐 Serveur démarré avec succès sur http://localhost:${PORT}`);
});