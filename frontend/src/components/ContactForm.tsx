import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type StatusType = 'idle' | 'loading' | 'success' | 'error';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState<StatusType>('idle');
  const [responseMessage, setResponseMessage] = useState<string>('');

  // Numéro WhatsApp de CHAROSOFT pour la redirection client (Format international sans +)
  const myWhatsAppNumber = '24385113388871'; 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage('');

    const apiUrl = import.meta.env.VITE_API_URL || 'https://ton-backend.onrender.com';

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMessage('🎉 Message envoyé ! Un e-mail d\'accusé de réception vous a été transmis.');
      } else {
        setStatus('error');
        setResponseMessage(data.error || 'Une erreur est survenue lors de l\'envoi.');
      }
    } catch (error) {
      console.error('Erreur serveur:', error);
      setStatus('error');
      setResponseMessage('Impossible de joindre le serveur. Réessayez plus tard.');
    }
  };

  // Génération du lien WhatsApp personnalisé pour le client
  const prefilledWhatsappText = encodeURIComponent(
    `Bonjour CHAROSOFT, je viens de soumettre un message sur votre site web.\nNom : ${formData.name}\nSujet : ${formData.subject || 'Prise de contact'}`
  );
  const whatsappUrl = `https://wa.me/${myWhatsAppNumber}?text=${prefilledWhatsappText}`;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Contactez CHAROSOFT</h2>

      {status === 'success' ? (
        <div style={{
          padding: '20px',
          backgroundColor: '#d1e7dd',
          color: '#0f5132',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3>{responseMessage}</h3>
          <p>Vous pouvez également discuter directement avec notre équipe en direct sur WhatsApp :</p>
          
          {/* Bouton pour que le client te contacte directement sur WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '10px',
              padding: '12px 20px',
              backgroundColor: '#25D366',
              color: '#FFF',
              textDecoration: 'none',
              borderRadius: '5px',
              fontWeight: 'bold'
            }}
          >
            💬 Poursuivre sur WhatsApp
          </a>

          <br /><br />
          <button 
            onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '' }); }}
            style={{ background: 'transparent', border: 'none', color: '#0f5132', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Envoyer un autre message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {status === 'error' && (
            <div style={{ padding: '10px', backgroundColor: '#f8d7da', color: '#842029', borderRadius: '4px', marginBottom: '15px' }}>
              ⚠️ {responseMessage}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label>Nom complet *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Adresse e-mail *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Sujet</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Message *</label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={handleChange}
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0070f3',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: status === 'loading' ? 'not-allowed' : 'pointer'
            }}
          >
            {status === 'loading' ? 'Traitement...' : 'Envoyer'}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;