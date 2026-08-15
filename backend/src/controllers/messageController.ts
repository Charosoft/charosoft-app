import { Request, Response } from 'express';
import { supabase } from '../db'; // On utilise l'instance Supabase déjà configurée

// 1. Récupérer tous les projets (Espace Public & Admin)
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erreur récupération projets :', error);
    return res.status(500).json({ message: 'Erreur lors de la récupération des projets.', error: error.message });
  }
};

// 2. Récupérer un projet par son slug
export const getProjectBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erreur récupération projet :', error);
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// 3. Créer un nouveau projet (Espace Admin)
export const createProject = async (req: Request, res: Response) => {
  const {
    title,
    slug,
    description,
    full_content,
    thumbnail_url,
    video_demo_url,
    technologies,
    live_url,
    is_featured,
  } = req.body;

  try {
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
          slug,
          description: description || '',
          full_content: full_content || '',
          thumbnail_url: thumbnail_url || '',
          video_demo_url: video_demo_url || null,
          technologies: parsedTech,
          live_url: live_url || null,
          is_featured: is_featured || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (error: any) {
    console.error('Erreur création projet :', error);
    return res.status(500).json({ message: 'Erreur lors de la création du projet.', error: error.message });
  }
};

// 4. Supprimer un projet (Espace Admin)
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ message: 'Projet supprimé avec succès.' });
  } catch (error: any) {
    console.error('Erreur suppression projet :', error);
    return res.status(500).json({ message: 'Erreur lors de la suppression.', error: error.message });
  }
};