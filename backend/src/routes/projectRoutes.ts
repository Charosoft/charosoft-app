import { Router, Request, Response } from 'express';
import multer from 'multer';
import { supabase } from '../db';

const router = Router();

// 1. Configuration Multer : Utilisation de la mémoire RAM (MemoryStorage)
// au lieu du disque local de Render qui est éphémère.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // Limite de 100 Mo par fichier
});

// Helper pour uploader un fichier vers le bucket Supabase Storage "projects-files"
const uploadToSupabase = async (file: Express.Multer.File, folder: string) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.floor(Math.random() * 10000)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('projects-files') // Nom de ton bucket public dans Supabase Storage
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false, // Forcer un pur INSERT pour éviter les erreurs de droits (403 RLS)
    });

  if (error) {
    console.error(`❌ Erreur upload Supabase (${folder}):`, error);
    throw error;
  }

  // Récupération de l'URL publique permanente
  const { data: publicUrlData } = supabase.storage
    .from('projects-files')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

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

      // Génération automatique d'un slug unique avec timestamp pour éviter le conflit "already exists"
      const generatedSlug =
        slug ||
        `${title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || 'project'}-${Date.now()}`;

      let thumbnailUrl = '';
      let videoUrl: string | null = null;

      // Upload de la miniature vers Supabase Storage si un fichier est fourni
      if (files?.thumbnail?.[0]) {
        thumbnailUrl = await uploadToSupabase(files.thumbnail[0], 'thumbnails');
      }

      // Upload de la vidéo démo vers Supabase Storage si un fichier est fourni
      if (files?.video?.[0]) {
        videoUrl = await uploadToSupabase(files.video[0], 'videos');
      }

      // Formatage des technologies (Array/String)
      let parsedTech: string[] = [];
      if (typeof technologies === 'string') {
        parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(technologies)) {
        parsedTech = technologies;
      }

      // Enregistrement dans la table PostgreSQL 'projects' sur Supabase
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
        console.error('❌ Erreur Supabase DB :', error);
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