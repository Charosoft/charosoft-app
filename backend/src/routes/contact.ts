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

    if (dbError) throw dbError;

    // 2. Alerte ADMIN par WhatsApp (CallMeBot)
    const whatsappText = `🚀 *Nouveau message sur CHAROSOFT !*\n\n👤 *Nom:* ${name}\n📧 *Email:* ${email}\n📌 *Sujet:* ${subject || 'N/A'}\n💬 *Message:* ${message}`;
    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.MY_WHATSAPP_PHONE}&text=${encodeURIComponent(whatsappText)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
    
    // Appel asynchrone (ne bloque pas si le bot WhatsApp est lent)
    axios.get(whatsappUrl).catch(err => console.error('Erreur WhatsApp:', err.message));

    // 3. Alerte ADMIN par Email (Resend)
    await resend.emails.send({
      from: 'CHAROSOFT Portal <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL!,
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

    // 4. Confirmation CLIENT par Email (Pour qu'il ne vous oublie pas !)
    await resend.emails.send({
      from: 'CHAROSOFT Portal <onboarding@resend.dev>',
      to: email,
      subject: `Merci pour votre message à CHAROSOFT !`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Bonjour ${name},</h2>
          <p>Nous avons bien reçu votre message concernant : <strong>${subject || 'Votre demande'}</strong>.</p>
          <p>Notre équipe examine votre demande et vous recontactera dans les plus brefs délais.</p>

          <p>En attendant, vous pouvez explorer notre portfolio et nos projets sur <a href="https://charosoft.vercel.app/">charosoft.vercel.app</a>.</p>
          
          <br/>
          <p>Cordialement,<br/><strong>L'équipe CHAROSOFT</strong></p>
        </div>
      `
    });

    // 5. Réponse au Frontend
    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès et accusé de réception transmis !' 
    });

  } catch (error: any) {
    console.error('Erreur traitement contact:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du message.' });
  }
});

export default router;