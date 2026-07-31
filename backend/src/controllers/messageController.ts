import { Request, Response } from 'express';
import { query } from '../config/db';

// 1. Envoyer un message client (Formulaire de contact)
export const sendMessage = async (req: Request, res: Response) => {
  const { client_name, client_email, subject, message } = req.body;

  if (!client_name || !client_email || !message) {
    return res.status(400).json({ message: 'Champs obligatoires manquants.' });
  }

  try {
    const result = await query(
      `INSERT INTO client_messages (client_name, client_email, subject, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [client_name, client_email, subject || null, message]
    );
    return res.status(201).json({ message: 'Message envoyé avec succès !', data: result.rows[0] });
  } catch (error) {
    console.error('Erreur envoi message :', error);
    return res.status(500).json({ message: "Erreur lors de l'envoi du message." });
  }
};

// 2. Récupérer tous les messages (Espace Admin)
export const getMessages = async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM client_messages ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Erreur récupération messages :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};