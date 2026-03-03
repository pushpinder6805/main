import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseInstance: SupabaseClient | null = null;

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window === 'undefined') {
      return null;
    }
    throw new Error('Supabase configuration missing');
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabase();
    if (!client) {
      return () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') });
    }
    return (client as any)[prop];
  }
});

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
