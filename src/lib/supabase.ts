import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables', {
      url: supabaseUrl,
      key: supabaseAnonKey ? 'present' : 'missing'
    });
    throw new Error('Supabase configuration is missing');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();

export type ChatConversation = {
  id: string;
  user_name: string;
  user_email: string;
  status: 'active' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  message: string;
  sender_type: 'user' | 'support';
  sender_name: string;
  created_at: string;
};
