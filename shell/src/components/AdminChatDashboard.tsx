
import React, { useState, useMemo } from "react";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import { signalRService } from "../api/signalrService";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";

type BackendMessage = {
  id?: string;
  senderId?: string;
  senderName?: string;
  text?: string;
  message?: string;
  createdAt?: string;
  senderType?: number | string;
  targetUserId?: string;
  status?: string;
  parentMessageId?: string;
  reactions?: string;
};

type BackendConversation = {
  conversationId?: string;
  id?: string;
  messages?: BackendMessage[];
  product?: {
    id: string;
    name: string;
    price: string | number;
  };
};

const AdminChatDashboard: React.FC = () => {
  const {
    messages,
    setIsAdminChatOpen,
    activeConversationId,
  } = useChatStore();
  const adminUser = getUser();
  const token = getToken();


  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);


  const conversations = useMemo(() => {
    const groups = new Map<string, ChatMessage[]>();

    messages.forEach((msg) => {
      if (!msg.conversationId) return;

      if (!groups.has(msg.conversationId)) {
        groups.set(msg.conversationId, []);
      }

      groups.get(msg.conversationId)!.push(msg);
    });

    return Array.from(groups.entries()).map(([conversationId, msgs]) => {
      const userMsg = msgs.find((m) => m.role === "User");

      return {
        conversationId,
        userId: userMsg?.senderId || "unknown",
        userName: userMsg?.senderName || "User",
        lastMessage: msgs[msgs.length - 1],
      };
    });
  }, [messages]);

  const convId = useChatStore(state => state.activeConversationId);

   const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}; 





  React.useEffect(() => {
    const fetchAllConversations = async () => {
      try {   
     const response = await axios.get<BackendConversation[]>(
        
          `${import.meta.env.VITE_API_URL || "https://localhost:7227"}/api/Conversation/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const rawConversations = response.data;
        const allMessages: ChatMessage[] = [];

        rawConversations.forEach((conv) => {
          const conversationId = conv.conversationId || conv.id || "";
          const messages = conv.messages || [];

          messages.forEach((m) => {
            const isUser = m.senderType === 0 || m.senderType === "User" || m.senderType === "USER";
            const senderId = m.senderId && m.senderId !== "00000000-0000-0000-0000-000000000000" 
              ? m.senderId 
              : isUser ? "user-" + conversationId : "admin-system";

            allMessages.push({
              id: m.id || Math.random().toString(36).substring(7),
              conversationId: conversationId,
              senderId: senderId,
              senderName: m.senderName || (isUser ? "Customer" : "Support Admin"),
              text: m.text || m.message || "",
              timestamp: m.createdAt || new Date().toISOString(),
              role: isUser ? "User" : "Admin",
              parentMessageId: m.parentMessageId,
              reactions: m.reactions,
              status: (m.status?.toLowerCase() as "sent" | "delivered" | "read") || "sent",
              productInfo: conv.product ? {
                id: conv.product.id,
                name: conv.product.name,
                price: Number(conv.product.price)
              } : undefined
            });
          });
        });

        useChatStore.getState().setMessages(allMessages);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (token) {
      fetchAllConversations();
      signalRService.init();
      signalRService.joinAdminGroup();
    }
  }, [token]);

  React.useEffect(() => {
    if (activeUserId && convId) {
      signalRService.markAsRead(convId);
      signalRService.joinConversation(convId);
    }
  }, [activeUserId, convId]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messages.filter((m) => m.conversationId === activeConversationId);
  }, [messages, activeConversationId]);
  
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!convId || !replyText.trim() || !activeUserId) return;

    const payload: Omit<ChatMessage, "id" | "timestamp"> = {
      conversationId: convId,
      senderId: adminUser?.userId,
      senderName: adminUser?.firstName || "Support Admin",
      text: replyText,
      role: "Admin",
      targetUserId: activeUserId,
      parentMessageId: replyingTo?.id || undefined
    };

    signalRService.sendMessage(payload);
    setReplyText("");
    setReplyingTo(null);
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    signalRService.addReaction(messageId, emoji);
  };

  const renderReactions = (reactionsJson?: string) => {
    if (!reactionsJson) return null;
    try {
      const reactions: Record<string, string[]> = JSON.parse(reactionsJson);
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {Object.entries(reactions).map(([emoji, userIds]) => (
            <span key={emoji} className="bg-zinc-800 rounded-full px-2 py-0.5 text-[10px] border border-zinc-700">
              {emoji} {userIds.length}
            </span>
          ))}
        </div>
      );
    } catch { return null; }
  };
  React.useEffect(() => {
  if (activeConversationId) {
    scrollToBottom();
  }
}, [activeMessages, activeConversationId]);


  return (
    <div className="flex h-[700px] w-[1000px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden relative font-sans text-zinc-100">
      <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Support
          </h2>
          <p className="text-xs text-zinc-500 mt-1">Manage active customer inquiries</p>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
          {conversations.length === 0 ? (
            <div className="p-10 text-center text-zinc-600">
              <div className="text-3xl mb-2">📭</div>
              <p className="text-sm">No active chats</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => {
                  setActiveUserId(conv.userId);
                  useChatStore.getState().setActiveConversationId(conv.conversationId);
                  setTimeout(()=>{
                    scrollToBottom();
                  },100)
                }}
                className={`p-4 border-b border-zinc-900/50 cursor-pointer transition-all duration-200 hover:bg-zinc-900 ${
                  activeConversationId === conv.conversationId
                    ? "bg-zinc-900 border-l-4 border-cyan-500 shadow-inner"
                    : ""
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-sm">{conv.userName}</span>
                  <span className="text-[10px] text-zinc-600">
                    {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {conv.lastMessage.role === 'Admin' ? 'You: ' : ''}{conv.lastMessage.text}
                </p>
                <div ref={messagesEndRef} />
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#0b0b0b]">
        {activeConversationId && activeUserId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  {conversations.find(c => c.conversationId === activeConversationId)?.userName[0] || 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-sm">
                    {conversations.find(c => c.conversationId === activeConversationId)?.userName || "Customer"}
                  </h3>
                  <div className="flex items-center gap-1.5 ">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-zinc-500">Active now</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsAdminChatOpen(false)}
                className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-900">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === "Admin" ? "items-end" : "items-start"} group relative`}
                >
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm transition-all duration-200 group-hover:shadow-lg ${
                    msg.role === "Admin"
                      ? "bg-cyan-600 text-white rounded-tr-none shadow-cyan-900/20"
                      : "bg-zinc-800/80 text-zinc-200 border border-zinc-700/50 rounded-tl-none shadow-black/20"
                  }`}>
                    {/* Reply Context */}
                    {msg.parentMessageId && (
                      <div className="mb-2 p-2 bg-black/20 rounded-lg text-[11px] border-l-2 border-white/30 italic">
                        {messages.find(m => m.id === msg.parentMessageId)?.text.substring(0, 40) || "Original message"}...
                      </div>
                    )}

                    {msg.productInfo && (
                      <div className="mb-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-700/50 border-l-4 border-emerald-500 text-xs shadow-inner">
                        <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Product Inquiry
                        </div>
                        <div className="text-zinc-100 font-medium">{msg.productInfo.name}</div>
                        <div className="text-emerald-400 font-bold mt-1">₹{msg.productInfo.price}</div>
                      </div>
                    )}
                    
                    <div className="text-[10px] opacity-60 mb-1 font-medium">{msg.senderName}</div>
                    <div className="leading-relaxed">{msg.text}</div>
                    
                    {renderReactions(msg.reactions)}
                    
                    <div className="text-[9px] opacity-40 mt-2 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Action Bar (Hover Only) */}
                    <div className={`absolute top-0 ${msg.role === 'Admin' ? '-left-24' : '-right-24'} opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 flex items-center gap-1 bg-zinc-900 shadow-2xl border border-zinc-700 rounded-full px-2 py-1 z-20`}>
                      <button 
                        onClick={() => setReplyingTo(msg)}
                        className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                        title="Reply"
                      >
                        ↩️
                      </button>
                      <button 
                        onClick={() => handleAddReaction(msg.id, "👍")}
                        className="p-1.5 hover:bg-zinc-800 rounded-full text-[12px] transition-transform hover:scale-125"
                      >
                        👍
                      </button>
                      <button 
                        onClick={() => handleAddReaction(msg.id, "❤️")}
                        className="p-1.5 hover:bg-zinc-800 rounded-full text-[12px] transition-transform hover:scale-125"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-950/80 border-t border-zinc-800">
              {replyingTo && (
                <div className="mb-3 px-3 py-2 bg-zinc-900 border-l-4 border-cyan-500 rounded flex justify-between items-center animate-in slide-in-from-bottom-2 duration-200">
                  <div className="text-xs text-zinc-400 truncate pr-4">
                    Replying to <span className="text-zinc-200 font-bold">{replyingTo.senderName}</span>: {replyingTo.text}
                  </div>
                  <button onClick={() => setReplyingTo(null)} className="text-zinc-500 hover:text-white text-xs">✕</button>
                </div>
              )}
              
              <form onSubmit={handleSendReply} className="flex gap-3">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-zinc-600 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 text-white rounded-xl px-6 py-3 font-bold transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 to-transparent">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 flex items-center justify-center text-4xl mb-6 shadow-2xl border border-zinc-800">
              💬
            </div>
            <h3 className="text-lg font-bold text-zinc-500">No conversation selected</h3>
            <p className="text-sm text-zinc-600 max-w-xs text-center mt-2">
              Choose a customer from the left sidebar to view their inquiry and start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
