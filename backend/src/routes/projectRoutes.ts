import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { supabase } from '../db';

const router = Router();

// Configuration du stockage Multer pour les images & vidéos (Limite 100 Mo)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de 100 Mo par fichier
});

// 1. GET /api/projects : Récupérer les projets depuis Supabase
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data);
  } catch (error) {
    console.error('Erreur lecture projets :', error);
    return res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

// 2. POST /api/projects : Créer un projet
router.post(
  '/',
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    try {
      const { title, slug, description, full_content, live_url, technologies } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Détection dynamique de l'URL de domaine (Ex: https://charosoft-api.onrender.com ou http://localhost:5000)
      const hostUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;

      // Génération automatique d'un slug si non renseigné
      const generatedSlug =
        slug ||
        title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ||
        `project-${Date.now()}`;

      // URLs publiques dynamiques des fichiers uploadés
      const thumbnailUrl = files?.thumbnail?.[0]
        ? `${hostUrl}/uploads/${files.thumbnail[0].filename}`
        : '';

      const videoUrl = files?.video?.[0]
        ? `${hostUrl}/uploads/${files.video[0].filename}`
        : null;

      // Formatage des technologies
      let parsedTech: string[] = [];
      if (typeof technologies === 'string') {
        parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(technologies)) {
        parsedTech = technologies;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            title,
            slug: generatedSlug,
            description: description || '',
            full_content: full_content || '',
            thumbnail_url: thumbnailUrl,
            video_demo_url: videoUrl,
            technologies: parsedTech,
            live_url: live_url || null,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Erreur Supabase :', error);
        throw error;
      }

      console.log('✅ Projet sauvegardé avec succès :', data.title);
      return res.status(201).json(data);
    } catch (error: any) {
      console.error('Erreur lors de la création du projet :', error);
      return res.status(500).json({ error: error.message || 'Erreur lors de la création' });
    }
  }
);

// 3. DELETE /api/projects/:id : Supprimer un projet
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression projet :', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;