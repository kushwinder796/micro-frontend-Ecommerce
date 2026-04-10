import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  senderId: string | undefined;
  senderName: string;
  text: string;
  timestamp: string;
  role: 'User' | 'Admin';
  productInfo?: {
    name: string;
    price: number;
    id: string;
  };
  status?: 'sent' | 'read' | 'delivered';
  targetUserId?: string;
  productId?: string;
  conversationId?: string;

}


interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, 'id'>) => void;
  clearMessages: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdminChatOpen: boolean;
  setIsAdminChatOpen: (isOpen: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  markMessagesAsRead: (userId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      isAdminChatOpen: false,
      setIsAdminChatOpen: (isOpen) => set({ isAdminChatOpen: isOpen }),
      activeConversationId: null,
      setActiveConversationId: (id) => set({ activeConversationId: id }),
      addMessage: (message) => set((state) => ({
        messages: [
          ...state.messages,
          {
            ...message,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date().toISOString(),
            status: message.role === 'User' ? 'sent' : undefined,
          },
        ],
      })),
      markMessagesAsRead: (userId) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.senderId === userId && msg.role === 'User'
            ? { ...msg, status: 'read' as const }
            : msg
        )
      })),
      setMessages: (messages) => set({ messages }),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'ecommerce-chat-storage',
    }
  )
);
