/*
  # Enable Realtime for Chat Tables

  1. Changes
    - Add chat_conversations table to supabase_realtime publication
    - Add chat_messages table to supabase_realtime publication
  
  2. Purpose
    - Enable real-time subscriptions for live chat functionality
    - Allow clients to receive instant updates when new messages are created
*/

ALTER PUBLICATION supabase_realtime ADD TABLE chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
