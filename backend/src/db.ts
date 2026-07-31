import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables SUPABASE_URL ou SUPABASE_KEY manquantes dans le .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('⚡ Client Supabase HTTP prêt à l\'emploi !');