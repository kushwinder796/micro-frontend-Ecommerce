import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ChatMessage {
  id: string;
  senderId: string | undefined;
  senderName: string;
  text: string;
  tempId?: string; 
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
  parentMessageId?: string;
  reactions?: string;
}


interface ChatState {
  messages: ChatMessage[];
  addMessage: (message:ChatMessage) => void;
  updateMessageReactions: (messageId: string, reactions: string) => void;
  clearMessages: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdminChatOpen: boolean;
  setIsAdminChatOpen: (isOpen: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  markMessagesAsRead: (conversationId: string) => void;
typingUsers: Record<string, string>;
setTyping: (data: { conversationId: string; userName: string }) => void;
// clearChat:()=>void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
     typingUsers: {},
      setTyping: ({ conversationId, userName }) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: userName,
      },
    })),
    // clearChat:()=>{
    // set({ messages:[],
    //   activeconversationId:null,
    //   isOpen:false,
    // })
    // },
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      isAdminChatOpen: false,
      setIsAdminChatOpen: (isOpen) => set({ isAdminChatOpen: isOpen }),
      activeConversationId: null,
      setActiveConversationId: (id) => set({ activeConversationId: id }),
      addMessage: (message) => set((state) => {
        if (message.id && state.messages.some(m => m.id === message.id)) {
           return state;
        }

        // Prevent optimistic UI duplicates being rendered twice when SignalR echoes the same message back
        const existingOptimistic = state.messages.find(m => 
            m.senderId === message.senderId && 
            m.text === message.text && 
            m.status === 'sent' && 
            Math.abs(new Date(m.timestamp).getTime() - new Date(message.timestamp || new Date()).getTime()) < 15000
        );

        if (existingOptimistic && message.status !== 'sent') {
            return {
                messages: state.messages.map(m => 
                   m.id === existingOptimistic.id ? { ...message, id: message.id, status: 'delivered' } : m
                )
            };
        }

        return {
          messages: [
            ...state.messages,
            {
              ...message,
              id: message.id || Math.random().toString(36).substring(7),
              timestamp: message.timestamp || new Date().toISOString(),
              status: message.status || (message.role === 'User' ? 'sent' : undefined),
            },
          ],
        };
      }),

      updateMessageReactions: (messageId, reactions) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.id === messageId ? { ...msg, reactions } : msg
        )
      })),

      markMessagesAsRead: (conversationId) => set((state) => ({
        messages: state.messages.map(msg =>
          msg.conversationId === conversationId 
            ? { ...msg, status: 'read'}
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
