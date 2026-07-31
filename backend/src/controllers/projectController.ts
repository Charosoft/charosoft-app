import { Request, Response } from 'express';
import { query } from '../config/db';

// 1. Récupérer tous les projets (Espace Public & Admin)
export const getAllProjects = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM projects ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur récupération projets :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des projets.' });
  }
};

// 2. Récupérer un projet par son slug
export const getProjectBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const result = await query('SELECT * FROM projects WHERE slug = $1', [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Projet introuvable.' });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur récupération projet :', error);
    return res.status(500).json({ message: 'Erreur serveur.' });
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
    const result = await query(
      `INSERT INTO projects 
      (title, slug, description, full_content, thumbnail_url, video_demo_url, technologies, live_url, is_featured) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        title,
        slug,
        description,
        full_content,
        thumbnail_url,
        video_demo_url,
        JSON.stringify(technologies || []),
        live_url,
        is_featured || false,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur création projet :', error);
    res.status(500).json({ message: 'Erreur lors de la création du projet.' });
  }
};

// 4. Supprimer un projet (Espace Admin)
export const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await query('DELETE FROM projects WHERE id = $1', [id]);
    res.status(200).json({ message: 'Projet supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression projet :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression.' });
  }
};