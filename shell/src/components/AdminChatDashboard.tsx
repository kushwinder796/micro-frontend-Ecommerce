import React, { useState, useMemo } from "react";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import { useThemeStore } from "../store/useThemeStore";
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
  // Subscribe to theme so component re-renders when theme changes
  useThemeStore((s) => s.mode);


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

  React.useEffect(() => {
  if (activeConversationId) {
    scrollToBottom();
  }
}, [activeMessages, activeConversationId]);


  return (
    <div style={{
      display: "flex", height: 700, width: 1000,
      background: "var(--bg-secondary)",
      border: "1px solid var(--border-color)",
      borderRadius: 20, boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
      overflow: "hidden", fontFamily: "sans-serif",
      color: "var(--text-primary)",
    }}>
      
      {/* ── Sidebar ── */}
      <div style={{
        width: 300, flexShrink: 0,
        borderRight: "1px solid var(--border-color)",
        display: "flex", flexDirection: "column",
        background: "var(--bg-primary)",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-color)" }}>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Admin Support
          </h2>
          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: "4px 0 0" }}>
            Manage active customer inquiries
          </p>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }} className="custom-scrollbar">
          {conversations.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
              <p style={{ fontSize: 13, margin: 0 }}>No active chats</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => {
                  setActiveUserId(conv.userId);
                  useChatStore.getState().setActiveConversationId(conv.conversationId);
                  setTimeout(() => scrollToBottom(), 100);
                }}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid var(--border-color)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: activeConversationId === conv.conversationId
                    ? "var(--bg-secondary)"
                    : "transparent",
                  borderLeft: activeConversationId === conv.conversationId
                    ? "3px solid #06b6d4"
                    : "3px solid transparent",
                }}
                onMouseEnter={(e) => { if (activeConversationId !== conv.conversationId) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-secondary)"; }}
                onMouseLeave={(e) => { if (activeConversationId !== conv.conversationId) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>{conv.userName}</span>
                  <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>
                    {new Date(conv.lastMessage.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {conv.lastMessage.role === "Admin" ? "You: " : ""}{conv.lastMessage.text}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-primary)", minWidth: 0 }}>
        {activeConversationId && activeUserId ? (
          <>
            {/* Header */}
            <div style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "linear-gradient(135deg,#06b6d4,#2563eb)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: 16,
                }}>
                  {conversations.find(c => c.conversationId === activeConversationId)?.userName[0] || "U"}
                </div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
                    {conversations.find(c => c.conversationId === activeConversationId)?.userName || "Customer"}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block", animation: "pulse 2s infinite" }} />
                    <span style={{ fontSize: 10, color: "var(--text-secondary)" }}>Active now</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsAdminChatOpen(false)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 18, padding: 6, borderRadius: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border-color)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }} className="custom-scrollbar">
              {activeMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "Admin" ? "flex-end" : "flex-start" }}
                >
                  <div style={{
                    maxWidth: "75%",
                    borderRadius: msg.role === "Admin" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    padding: "10px 14px", fontSize: 13,
                    background: msg.role === "Admin"
                      ? "linear-gradient(135deg,#0891b2,#2563eb)"
                      : "var(--bg-secondary)",
                    color: msg.role === "Admin" ? "#fff" : "var(--text-primary)",
                    border: msg.role === "Admin" ? "none" : "1px solid var(--border-color)",
                  }}>
                    {msg.parentMessageId && (
                      <div style={{
                        marginBottom: 6, padding: "4px 8px",
                        background: "rgba(0,0,0,0.15)", borderRadius: 6,
                        fontSize: 10, borderLeft: "2px solid rgba(255,255,255,0.3)",
                        fontStyle: "italic", opacity: 0.7,
                      }}>
                        {messages.find(m => m.id === msg.parentMessageId)?.text.substring(0, 40) || "Original message"}...
                      </div>
                    )}
                    {msg.productInfo && (
                      <div style={{
                        marginBottom: 10, padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)", borderRadius: 8,
                        borderLeft: "3px solid #22c55e", fontSize: 11,
                      }}>
                        <div style={{ fontWeight: 700, color: "#4ade80", marginBottom: 2 }}>Product Inquiry</div>
                        <div style={{ color: msg.role === "Admin" ? "#fff" : "var(--text-primary)" }}>{msg.productInfo.name}</div>
                        <div style={{ color: "#4ade80", fontWeight: 700 }}>₹{msg.productInfo.price}</div>
                      </div>
                    )}
                    <div style={{ fontSize: 10, opacity: 0.6, marginBottom: 4, fontWeight: 600 }}>{msg.senderName}</div>
                    <div style={{ lineHeight: 1.5 }}>{msg.text}</div>
                    <div style={{ fontSize: 9, opacity: 0.4, marginTop: 6, textAlign: "right" }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "14px 16px",
              borderTop: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
            }}>
              {replyingTo && (
                <div style={{
                  marginBottom: 10, padding: "6px 12px",
                  background: "var(--bg-primary)",
                  borderLeft: "3px solid #06b6d4", borderRadius: 6,
                  fontSize: 11, display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    Replying to <strong style={{ color: "var(--text-primary)" }}>{replyingTo.senderName}</strong>: {replyingTo.text}
                  </span>
                  <button onClick={() => setReplyingTo(null)} style={{ marginLeft: 8, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </div>
              )}
              <form onSubmit={handleSendReply} style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 12, padding: "10px 14px",
                    fontSize: 13, color: "var(--text-primary)", outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  style={{
                    padding: "10px 20px", borderRadius: 12, border: "none",
                    background: replyText.trim()
                      ? "linear-gradient(135deg,#0891b2,#2563eb)"
                      : "var(--border-color)",
                    color: replyText.trim() ? "#fff" : "var(--text-secondary)",
                    fontWeight: 700, fontSize: 13,
                    cursor: replyText.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 12,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: 20,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32,
            }}>
              💬
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-secondary)", margin: 0 }}>
              No conversation selected
            </h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", maxWidth: 260, textAlign: "center", margin: 0 }}>
              Choose a customer from the left sidebar to start chatting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
