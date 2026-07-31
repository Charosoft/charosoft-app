import { Router, Request, Response } from 'express';
import multer from 'multer';
import { supabase } from '../db';

const router = Router();

// On garde les fichiers en mémoire RAM temporairement au lieu de les écrire sur le disque
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50 Mo
});

// Helper pour uploader un fichier sur Supabase Storage
const uploadToSupabase = async (file: Express.Multer.File, folder: string) => {
  const fileExt = file.originalname.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('projects-files') // Nom de ton bucket public Supabase
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  // Récupération de l'URL publique permanente
  const { data: publicUrlData } = supabase.storage
    .from('projects-files')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

// Route POST : Créer un projet
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

      let thumbnailUrl = '';
      let videoUrl: string | null = null;

      // Upload de l'image vers Supabase Storage
      if (files?.thumbnail?.[0]) {
        thumbnailUrl = await uploadToSupabase(files.thumbnail[0], 'thumbnails');
      }

      // Upload de la vidéo vers Supabase Storage
      if (files?.video?.[0]) {
        videoUrl = await uploadToSupabase(files.video[0], 'videos');
      }

      // Génération du slug
      const generatedSlug =
        slug ||
        title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') ||
        `project-${Date.now()}`;

      // Formatage des technologies
      let parsedTech: string[] = [];
      if (typeof technologies === 'string') {
        parsedTech = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(technologies)) {
        parsedTech = technologies;
      }

      // Insertion dans la base de données PostgreSQL
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

      if (error) throw error;

      return res.status(201).json(data);
    } catch (error: any) {
      console.error('Erreur création projet :', error);
      return res.status(500).json({ error: error.message || 'Erreur lors de la création' });
    }
  }
);

export default router;