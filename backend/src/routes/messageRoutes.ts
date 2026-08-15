import { Router, Request, Response } from 'express';
import { supabase } from '../db';

const router = Router();

// 1. GET /api/messages : Liste des messages reçus
router.get('/', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('client_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.json(data);
  } catch (error) {
    console.error('Erreur lecture messages :', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

// 2. POST /api/messages : Envoi d'un message client
router.post('/', async (req: Request, res: Response) => {
  try {
    const { client_name, client_email, subject, message } = req.body;

    const { data, error } = await supabase
      .from('client_messages')
      .insert([
        {
          client_name,
          client_email,
          subject: subject || '',
          message,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('✉️ Nouveau message client reçu de :', data.client_email);
    return res.status(201).json(data);
  } catch (error) {
    console.error('Erreur envoi message :', error);
    return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
  }
});

// 3. DELETE /api/messages/:id : Supprimer un message
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('client_messages')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur suppression message :', error);
    return res.status(500).json({ error: 'Erreur lors de la suppression' });
  }
});

export default router;