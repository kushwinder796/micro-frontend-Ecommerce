import React, { useState, useRef, useEffect, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { signalRService } from "../api/signalrService";

const AIChatBox: React.FC = () => {
  const { messages, isOpen, setIsOpen } = useChatStore();
  const { user } = useAuthStore();
  const convId = useChatStore((state) => state.activeConversationId);
  const [inputValue, setInputValue] = useState("");
  const [activeProduct, setActiveProduct] = useState<{
    id: string;
    name: string;
    price: number | string;
  } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentUserId = user?.id || "anonymous-user";

  const userMessages = useMemo(() => {
    if (convId) return messages.filter((m) => m.conversationId === convId);

    return messages.filter((m) => m.senderId === currentUserId);
  }, [messages, currentUserId, convId]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const convIdBefore = useChatStore.getState().activeConversationId;


    await signalRService.sendMessage({
      conversationId: convIdBefore || undefined,
      senderId: currentUserId,
      senderName: user?.firstName
        ? `${user.firstName} ${user.lastName}`
        : "Guest",
      text: inputValue,
      role: "User",
      productInfo: activeProduct
        ? {
            id: activeProduct.id,
            name: activeProduct.name,
            price: Number(activeProduct.price),
          }
        : undefined,
    });

    const newConvId = useChatStore.getState().activeConversationId;

    if (newConvId) {
      await signalRService.joinConversation(newConvId);
    }

    setInputValue("");
    setActiveProduct(null);
  };



  const renderReactions = (reactionsJson?: string) => {
    if (!reactionsJson) return null;
    try {
      const reactions: Record<string, string[]> = JSON.parse(reactionsJson);
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(reactions).map(([emoji, userIds]) => (
            <span key={emoji} className="bg-zinc-800 rounded-full px-1.5 py-0.5 text-[9px] border border-zinc-700">
              {emoji} {userIds.length}
            </span>
          ))}
        </div>
      );
    } catch { return null; }
  };

  useEffect(() => {
    scrollToBottom();
  }, [userMessages, isOpen]);

  useEffect(() => {
    signalRService.init();
  }, []);

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
    window.addEventListener(
      "open-chat-product",
      handleOpenChatProduct as EventListener,
    );
    return () =>
      window.removeEventListener(
        "open-chat-product",
        handleOpenChatProduct as EventListener,
      );
  }, [setIsOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-zinc-900 border border-zinc-700 shadow-2xl rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-zinc-700 bg-gradient-to-r from-cyan-600 to-blue-600 flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse border border-emerald-950"></div>
              <span className="font-extrabold text-white uppercase text-[10px] tracking-widest">
                Direct Support
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#0a0a0a] custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-800">
            {activeProduct && (
              <div className="text-center text-[10px] text-cyan-400 font-bold mb-3 p-2 bg-cyan-900/20 rounded-lg border border-cyan-500/20 shadow-inner">
                Inquiry: {activeProduct.name}
              </div>
            )}

            {userMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-2 opacity-50">
                <div className="text-4xl">👋</div>
                <p className="text-xs">Ask us anything!</p>
              </div>
            ) : (
              userMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "User" ? "items-end" : "items-start"} group relative`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm transition-all duration-200 ${
                      msg.role === "User"
                        ? "bg-cyan-600 text-white rounded-tr-none shadow-md"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700/50 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {msg.parentMessageId && (
                      <div className="mb-2 p-1.5 bg-black/20 rounded text-[10px] border-l-2 border-white/20 italic opacity-70">
                         {messages.find(m => m.id === msg.parentMessageId)?.text.substring(0, 30) || "Original message"}...
                      </div>
                    )}

                    {msg.role === "Admin" && (
                      <div className="text-[10px] opacity-50 mb-1 font-bold">
                        {msg.senderName}
                      </div>
                    )}

                    {msg.productInfo && (
                      <div className="mb-2 p-2 bg-zinc-950/40 rounded-lg border border-zinc-700/50 border-l-2 border-l-emerald-500 text-[11px] text-left">
                        <div className="font-bold text-emerald-400 mb-0.5">Product Link:</div>
                        <div className="text-white truncate">{msg.productInfo.name}</div>
                        <div className="text-emerald-400 font-bold mt-0.5">₹{msg.productInfo.price}</div>
                      </div>
                    )}

                    <div className="text-left leading-relaxed">{msg.text}</div>
                    
                    {renderReactions(msg.reactions)}

                    <div className="text-[10px] text-right mt-2 opacity-40 flex justify-end items-center gap-1.5 font-medium">
                      {msg.role === "User" && (
                        <>
                          {msg.status === "sent" && <span title="Sent">✓</span>}
                          {msg.status === "delivered" && <span title="Delivered">✓✓</span>}
                          {msg.status === "read" && <span className="text-blue-400" title="Read">✓✓</span>}
                        </>
                      )}
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-3 bg-zinc-900 border-t border-zinc-800">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-all shadow-lg active:scale-90"
              >
                <span className="transform rotate-[-45deg] translate-x-0.5 translate-y-[-0.5px]">➤</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatBox;
