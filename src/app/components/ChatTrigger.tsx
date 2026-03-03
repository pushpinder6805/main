"use client"

import { useEffect } from 'react';

type ChatTriggerProps = {
  variant?: 'primary' | 'link';
};

export default function ChatTrigger({ variant = 'primary' }: ChatTriggerProps) {
  useEffect(() => {
    console.log('ChatTrigger mounted, variant:', variant);
  }, [variant]);

  const openChat = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('ChatTrigger clicked, dispatching openLiveChat event');
    const event = new CustomEvent('openLiveChat');
    window.dispatchEvent(event);
    console.log('Event dispatched');
  };

  if (variant === 'link') {
    return (
      <button
        onClick={openChat}
        className="text-blue-600 font-medium hover:underline inline-flex items-center"
      >
        Start chatting now
      </button>
    );
  }

  return (
    <button
      onClick={openChat}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Start Live Chat
    </button>
  );
}
