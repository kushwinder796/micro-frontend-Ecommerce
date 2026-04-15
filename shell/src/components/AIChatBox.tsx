

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useChatStore,  } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { signalRService } from '../api/signalrService';


const AIChatBox: React.FC = () => {
  const { messages, isOpen, setIsOpen } = useChatStore();
  const { user } = useAuthStore();
  const convId = useChatStore(state => state.activeConversationId);
  const [inputValue, setInputValue] = useState('');
  const [activeProduct, setActiveProduct] = useState<{ id: string; name: string; price: number | string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || 'anonymous-user';

  const userMessages = useMemo(() => {
    
    if (convId) return messages.filter(m=>m.conversationId=== convId);

    return messages.filter(m => m.senderId === currentUserId);
  }, [messages, currentUserId,convId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };




const handleSendMessage = (e: React.FormEvent) => {
  e.preventDefault();
  if (!inputValue.trim()) return;

  signalRService.sendMessage({
    conversationId: useChatStore.getState().activeConversationId || undefined,
    senderId: currentUserId,
    senderName: user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest',
    text: inputValue,
    role: 'User',
    productInfo: activeProduct
      ? { id: activeProduct.id, name: activeProduct.name, price: Number(activeProduct.price) }
      : undefined,
  });

  setInputValue('');
  setActiveProduct(null);
};
  useEffect(() => {
    scrollToBottom();
  }, [userMessages, isOpen]);


useEffect(() => {
  if (convId) {
    signalRService.joinConversation(convId);
  }
}, [convId]);

  useEffect(() => {
    const handleOpenChatProduct = (e: CustomEvent) => {
      setActiveProduct(e.detail);
      setIsOpen(true);
    };
    window.addEventListener('open-chat-product', handleOpenChatProduct as EventListener);
    return () => window.removeEventListener('open-chat-product', handleOpenChatProduct as EventListener);
  }, [setIsOpen]);




  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-80 h-96 bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-700 bg-cyan-600 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-bold text-white uppercase text-xs">Chatting..</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-black"
            >
              ✕
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50">
            {activeProduct && (
              <div className="text-center text-xs text-cyan-400 font-bold mb-2 p-2 bg-cyan-900/20 rounded border border-cyan-500/30">
                You are asking about: {activeProduct.name}
              </div>
            )}
            
            {userMessages.length === 0 ? (
              <div className="text-center text-zinc-500 text-sm mt-4">
                Hello! How can we help you today?
              </div>
            ) : (
              userMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
                    msg.role === 'User'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                  }`}>
                    {msg.role === 'Admin' && <div className="text-xs opacity-50 mb-1">{msg.senderName}</div>}
                    
                    {msg.productInfo && (
                      <div className="mb-2 p-2 bg-zinc-900/50 rounded border border-zinc-700 border-l-2 border-l-emerald-500 text-xs text-left">
                        <div className="font-bold text-emerald-400 mb-1">Inquiring about:</div>
                        <div className="text-white font-medium">{msg.productInfo.name}</div>
                        <div className="text-emerald-400 font-bold mt-1">₹{msg.productInfo.price}</div>
                      </div>
                    )}
                    
                    <div className="text-left">{msg.text}</div>
                    
                    {msg.role === 'User' && (
                      <div className="text-[10px] text-right mt-1 opacity-80 flex justify-end items-center gap-1">
                        {msg.status === 'read' ? (
                          <span className="text-blue-400 font-bold tracking-tighter shrink-0" title="Read">✓✓</span>
                        ) : (
                          <span className="text-zinc-300 font-bold shrink-0" title="Sent">✓</span>
                        )}
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-700 bg-zinc-900 flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button 
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg px-3 py-2"
            >
              →
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-cyan-600 hover:bg-cyan-500 shadow-xl flex items-center justify-center text-2xl"
      >
        💬
      </button>
    </div>
  );
};

export default AIChatBox;