
import React, { useState, useMemo, useEffect } from "react";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import { signalRService } from "../api/signalrService";
import axios from "axios";
import { getToken, getUser } from "../utils/auth";
// adjust path

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
    markMessagesAsRead,
    setIsAdminChatOpen,
    activeConversationId,
  } = useChatStore();
  const adminUser = getUser();
  const token = getToken();

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

  React.useEffect(() => {
    const fetchAllConversations = async () => {
      try {
        console.log("Fetching conversations from backend...");

        const response = await axios.get<BackendConversation[]>(
          `${import.meta.env.VITE_API_URL || "https://localhost:7227"}/api/Conversation/all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const rawConversations = response.data;
        console.log("Raw response:", rawConversations);

        const allMessages: ChatMessage[] = [];

        rawConversations.forEach((conv) => {
          const conversationId = conv.conversationId || conv.id || "";
          const messages = conv.messages || [];

          messages.forEach((m) => {
            const senderId =
              m.senderId &&
              m.senderId !== "00000000-0000-0000-0000-000000000000"
                ? m.senderId
                : m.senderType === 0 ||
                    m.senderType === "User" ||
                    m.senderType === "USER"
                  ? "user-" + conversationId
                  : "admin-system";

            const senderName =
              m.senderName &&
              m.senderName.trim() !== "" &&
              m.senderName !== "User"
                ? m.senderName
                : m.senderType === 0 ||
                    m.senderType === "User" ||
                    m.senderType === "USER"
                  ? "Customer " + conversationId.slice(-4)
                  : "Support Admin";

            const messageText = m.text || m.message || "";
            const status = m.status?.toLowerCase() || "sent";

            allMessages.push({
              id: m.id || Math.random().toString(36).substring(7),
              conversationId: conversationId,
              senderId,
              senderName,
              text: messageText,
              timestamp: m.createdAt || new Date().toISOString(),
              role:
                m.senderType === 0 ||
                m.senderType === "User" ||
                m.senderType === "USER"
                  ? "User"
                  : "Admin",
              targetUserId: m.targetUserId,
              status: status as "sent" | "read" | "delivered",

              productInfo: conv.product
                ? {
                    id: conv.product.id,
                    name: conv.product.name,
                    price: Number(conv.product.price),
                  }
                : undefined,
            });
          });
        });

        useChatStore.getState().setMessages(allMessages);
        console.log("Synced:", allMessages.length, "messages");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error("API Error:", {
            status: err.response?.status,
            data: err.response?.data,
          });
        } else {
          console.error("Unexpected Error:", err);
        }
      }
    };

    if (token) {
      fetchAllConversations();
    }
  }, [token]);

  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  React.useEffect(() => {

    const convId = useChatStore.getState().activeConversationId;

    if (activeUserId && convId) {
      signalRService.markAsRead(convId);
    }
  }, [activeUserId, markMessagesAsRead, messages.length]);

  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];

    return messages.filter((m) => m.conversationId === activeConversationId);
  }, [messages, activeConversationId]);
 
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!convId || !replyText.trim() || !activeUserId) return;

    if (!replyText.trim()) return;

    if (!activeUserId) return;

    if (!adminUser?.userId) {
      console.error("User ID missing. Please login again.");
      alert("Session expired. Please login again.");
      return;
    }

    const payload: Omit<ChatMessage, "id" | "timestamp"> = {
      conversationId: convId,
      senderId: adminUser.userId,
      senderName: adminUser.firstName || "Support Admin",
      text: replyText,
      role: "Admin",
      targetUserId: activeUserId,
    };

    signalRService.sendMessage(payload);

    setReplyText("");
  };

  useEffect(() => {

  if (convId) {
    signalRService.joinConversation(convId);
  }
}, [convId]);

  return (
    <div className="flex h-[600px] bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl overflow-hidden relative">
      {/* Close Button */}
      <button
        onClick={() => setIsAdminChatOpen(false)}
        className="absolute top-4 right-4 z-10 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all"
        title="Close Dashboard"
      >
        ✕
      </button>

      {/* Sidebar: Conversation List */}
      <div className="w-1/3 border-r border-zinc-700 flex flex-col">
        <div className="p-4 border-b border-zinc-700 bg-zinc-950">
          <h2 className="text-lg font-bold text-white">Active Inquiries</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-zinc-500 text-sm">
              No active conversations.
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.conversationId}
                onClick={() => {
                  setActiveUserId(conv.userId);
                  useChatStore
                    .getState()
                    .setActiveConversationId(conv.conversationId);
                }}
                className={`p-4 border-b border-zinc-800 cursor-pointer hover:bg-zinc-800 transition-colors ${
                  activeUserId === conv.userId
                    ? "bg-zinc-800 border-l-4 border-l-cyan-500"
                    : ""
                }`}
              >
                <div className="font-bold text-white text-sm">
                  {conv.userName}
                </div>
                <div className="text-xs text-zinc-400 truncate mt-1">
                  {conv.lastMessage.productInfo && (
                    <span className="text-cyan-400 font-semibold mr-1">
                      [Price Check]
                    </span>
                  )}
                  {conv.lastMessage.text.substring(0, 50)}...
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950/50">
        {activeUserId ? (
          <>
            <div className="p-4 border-b border-zinc-700 bg-zinc-950 flex justify-between items-center">
              <h3 className="font-bold text-white">
                Chatting with{" "}
                {conversations.find((c) => c.userId === activeUserId)
                  ?.userName || "User"}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-zinc-500">
                  No messages in this conversation yet.
                </div>
              ) : (
                activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.role === "Admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                        msg.role === "Admin"
                          ? "bg-cyan-600 text-white"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700"
                      }`}
                    >
                      <div className="text-xs opacity-50 mb-1">
                        {msg.senderName}
                      </div>

                      {msg.productInfo && (
                        <div className="mb-2 p-2 bg-zinc-900/50 rounded border border-zinc-700 border-l-2 border-l-emerald-500 text-xs">
                          <div className="font-bold text-emerald-400">
                            Inquiring about:
                          </div>
                          <div className="text-white">
                            {msg.productInfo.name}
                          </div>
                          <div className="text-emerald-400 font-bold">
                            ₹{msg.productInfo.price}
                          </div>
                        </div>
                      )}

                      <div>{msg.text}</div>

                      <div className="text-xs opacity-40 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendReply}
              className="p-4 border-t border-zinc-700 bg-zinc-900 flex gap-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white rounded-lg px-6 py-2 font-bold transition-colors"
              >
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <div className="text-4xl mb-4">💬</div>
            <p>Select a conversation to start replying</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatDashboard;
