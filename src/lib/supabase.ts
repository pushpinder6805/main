import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://myjmjcrtgwkkqgwdirec.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15am1qY3J0Z3dra3Fnd2RpcmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjAxMzMsImV4cCI6MjA4ODA5NjEzM30.Di03gi_iO5xJUUQ6PhnS3XV9nu60h0sssUpkq_pWm9w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
