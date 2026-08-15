import { Router } from 'express';
import { Resend } from 'resend';
import axios from 'axios';
import { supabase } from '../db'; // Ton client Supabase sécurisé

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  try {
    // 1. Sauvegarde dans Supabase
    const { error: dbError } = await supabase
      .from('messages')
      .insert([{ name, email, subject, message }]);

    if (dbError) {
      console.error('Erreur Supabase:', dbError);
      throw dbError;
    }

    // 2. Alerte ADMIN par WhatsApp (CallMeBot)
    if (process.env.MY_WHATSAPP_PHONE && process.env.CALLMEBOT_API_KEY) {
      const whatsappText = `🚀 *Nouveau message sur CHAROSOFT !*\n\n👤 *Nom:* ${name}\n📧 *Email:* ${email}\n📌 *Sujet:* ${subject || 'N/A'}\n💬 *Message:* ${message}`;
      const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.MY_WHATSAPP_PHONE}&text=${encodeURIComponent(whatsappText)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
      
      axios.get(whatsappUrl).catch(err => console.error('Erreur WhatsApp CallMeBot:', err.message));
    }

    // 3. Alerte ADMIN par Email (Resend)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'CHAROSOFT Portal <onboarding@resend.dev>',
          to: 'charosoft6@gmail.com', // Doit être ton email de compte Resend
          subject: `📥 Nouveau contact : ${name}`,
          html: `
            <h3>Vous avez reçu un nouveau message !</h3>
            <p><strong>Nom :</strong> ${name}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${subject || 'Sans sujet'}</p>
            <p><strong>Message :</strong></p>
            <blockquote style="background:#f4f4f4; padding:10px; border-left:4px solid #0070f3;">${message}</blockquote>
          `
        });
      } catch (emailErr: any) {
        console.error('Erreur Resend Admin Email:', emailErr.message);
      }
    }

    // 4. Confirmation CLIENT désactivée provisoirement pour éviter le blocage Resend Free
    // (Pour l'activer plus tard, il faudra enregistrer un domaine personnalisé sur Resend)

    // 5. Réponse au Frontend
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès !' 
    });

  } catch (error: any) {
    console.error('Erreur traitement contact:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du message.' });
  }
});

export default router;