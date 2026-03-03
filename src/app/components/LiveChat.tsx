"use client"

import { useState, useEffect, useRef } from 'react';
import { supabase, ChatMessage, ChatConversation } from '@/lib/supabase';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isMounted) return;

    console.log('LiveChat: Setting up event listener');

    const handleOpenChat = () => {
      console.log('LiveChat: openLiveChat event received');
      setIsOpen(true);
    };

    window.addEventListener('openLiveChat', handleOpenChat);

    return () => {
      window.removeEventListener('openLiveChat', handleOpenChat);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`chat:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const startConversation = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      alert('Please enter your name and email');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting conversation with:', { userName, userEmail });
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_name: userName,
          user_email: userEmail,
          status: 'active',
        })
        .select()
        .single();

      console.log('Insert result:', { data, error });

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message} (${error.code || 'no code'})`);
      }

      if (!data) {
        throw new Error('No data returned from insert');
      }

      setConversationId(data.id);
      setIsStarted(true);

      const welcomeMessage = {
        conversation_id: data.id,
        message: `Hello ${userName}! How can we help you today?`,
        sender_type: 'support' as const,
        sender_name: 'Support Team',
      };

      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert(welcomeMessage);

      if (msgError) {
        console.error('Message error:', msgError);
        throw new Error(`Failed to send welcome message: ${msgError.message}`);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to start chat: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const message = {
      conversation_id: conversationId,
      message: newMessage,
      sender_type: 'user' as const,
      sender_name: userName,
    };

    try {
      const { error } = await supabase.from('chat_messages').insert(message);

      if (error) throw error;

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={openChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all z-50 flex items-center justify-center"
          aria-label="Open live chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <div>
                <h3 className="font-bold">Live Chat</h3>
                <p className="text-xs text-blue-100">We typically reply in minutes</p>
              </div>
            </div>
            <button
              onClick={closeChat}
              className="text-white hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!isStarted ? (
            <div className="flex-1 p-6 flex flex-col justify-center">
              <h4 className="text-xl font-bold mb-4 text-gray-800">Start a conversation</h4>
              <p className="text-gray-600 mb-6">Please provide your details to begin chatting with our support team.</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="chat-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="chat-name"
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="chat-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    id="chat-email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                    placeholder="john@example.com"
                  />
                </div>

                <button
                  onClick={startConversation}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-md transition-colors"
                >
                  {isLoading ? 'Starting...' : 'Start Chat'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.sender_type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.sender_name}
                      </p>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-60">
                        {new Date(msg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
