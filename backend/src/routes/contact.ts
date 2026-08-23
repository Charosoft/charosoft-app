import { Router } from 'express';
import { Resend } from 'resend';
import axios from 'axios';
import { supabase } from '../db';

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  try {
    // 1. Insertion dans la table Supabase utilisée par le Dashboard
    const { error: dbError } = await supabase
      .from('client_messages')
      .insert([
        { 
          client_name: name, 
          client_email: email, 
          subject: subject || '', 
          message 
        }
      ]);

    if (dbError) {
      console.error('❌ Erreur Supabase:', dbError.message);
      throw dbError;
    }

    // 2. Notification WhatsApp via CallMeBot
    const rawPhone = process.env.MY_WHATSAPP_PHONE || '';
    const cleanPhone = rawPhone.replace('+', '').trim();
    const apiKey = process.env.CALLMEBOT_API_KEY;

    if (cleanPhone && apiKey) {
      const whatsappText = `🚀 *Nouveau message CHAROSOFT !*\n\n👤 *Nom:* ${name}\n📧 *Email:* ${email}\n📌 *Sujet:* ${subject || 'N/A'}\n💬 *Message:* ${message}`;
      const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${cleanPhone}&text=${encodeURIComponent(whatsappText)}&apikey=${apiKey}`;
      
      axios.get(whatsappUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } })
        .then(() => console.log('✅ Notification WhatsApp transmise à CallMeBot'))
        .catch(err => console.error('❌ Erreur CallMeBot WhatsApp:', err.response?.data || err.message));
    }

    // 3. Notification Email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const emailResult = await resend.emails.send({
          from: 'CHAROSOFT <onboarding@resend.dev>',
          to: ['charosoft6@gmail.com'],
          subject: `📥 Nouveau message de : ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc;">
              <h2 style="color: #2563eb;">Nouveau message reçu depuis le site web</h2>
              <p><strong>Nom :</strong> ${name}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Sujet :</strong> ${subject || 'Sans sujet'}</p>
              <p><strong>Message :</strong></p>
              <blockquote style="background: #ffffff; padding: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
                ${message}
              </blockquote>
            </div>
          `
        });
        console.log('✅ Notification email transmise à Resend:', emailResult);
      } catch (emailErr: any) {
        console.error('❌ Erreur Resend:', emailErr);
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès !' 
    });

  } catch (error: any) {
    console.error('❌ Erreur traitement contact:', error);
    return res.status(500).json({ error: 'Une erreur est survenue lors de l\'envoi du message.' });
  }
});

export default router;