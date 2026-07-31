import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Extraction propre de l'URL brute (pour virer les [ ] ou ( ) du markdown)
function cleanUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  let url = rawUrl.trim();
  const match = url.match(/https:\/\/[^\s\)\"\]]+/);
  return match ? match[0] : url;
}

const supabaseUrl = cleanUrl(process.env.SUPABASE_URL);
const supabaseKey = (process.env.SUPABASE_KEY || '').trim();

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ ERREUR CRITIQUE : SUPABASE_URL invalide ! Valeur :', `"${supabaseUrl}"`);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);

console.log('⚡ Client Supabase HTTP prêt à l\'emploi !');