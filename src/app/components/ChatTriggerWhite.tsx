"use client"

export default function ChatTriggerWhite() {
  const openChat = () => {
    const event = new CustomEvent('openLiveChat');
    window.dispatchEvent(event);
  };

  return (
    <button
      onClick={openChat}
      className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-md transition-colors inline-flex items-center"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Start Live Chat
    </button>
  );
}
