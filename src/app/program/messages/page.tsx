"use client"

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  is_mine: boolean;
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [user, isLoading]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    setLoading(true);
    setConversations([]);
    setLoading(false);
  };

  const loadMessages = async () => {
    if (!selectedConversation) return;
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    alert('Messaging functionality coming soon!');

    setNewMessage('');
    loadMessages();
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h1>
          <Link
            href="/program/login"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No conversations yet
            </div>
          ) : (
            conversations.map((conv) => {
              const otherPerson = { name: conv.name, avatar: conv.avatar };

              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                    selectedConversation?.id === conv.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Image
                      src={otherPerson.avatar || '/images/logo.png'}
                      alt={otherPerson.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{otherPerson.name}</p>
                      <p className="text-xs text-gray-500">Chat session</p>
                    </div>
                  </div>
                  {conv.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedConversation ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedConversation.name}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => {
                const isMyMessage = msg.is_mine;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        isMyMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-800 border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.sender}
                      </p>
                      {msg.content && (
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      )}
                      {false && (
                        <audio controls className="mt-2 w-full">
                          <source src="" />
                        </audio>
                      )}
                      <p className="text-xs mt-1 opacity-60">
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
