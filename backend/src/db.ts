import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charge le .env local uniquement s'il existe
dotenv.config();

// Récupération des variables en nettoyant les espaces inutiles
const supabaseUrl = (process.env.SUPABASE_URL || '').trim();
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

// Vérification avec affichage clair dans les logs Render si une variable manque
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ ERREUR CRITIQUE : SUPABASE_URL est absente ou invalide ! Valeur reçue :', `"${supabaseUrl}"`);
}

if (!supabaseKey) {
  console.error('❌ ERREUR CRITIQUE : SUPABASE_KEY est absente !');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder'
);

console.log('⚡ Client Supabase HTTP prêt à l\'emploi !');