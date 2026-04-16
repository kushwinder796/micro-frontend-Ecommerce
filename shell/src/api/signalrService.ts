import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";


interface BackendMessage {
  id?: string;
  senderId: string;
  senderName?: string;
  message?: string;
  conversationId?: string;
  text?: string;
  createdAt?: string;
  senderType: "User" | "Admin" | 0 | 1 | "0" | "1" |"USER" | "ADMIN";
  targetUserId?: string;
  status?: string;
  parentMessageId?: string;
  product?: {
    id: string;
    name: string;
    price: number | string;
  };
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private backendUrl = import.meta.env.VITE_API_URL || "https://localhost:7227";
  private connectionPromise: Promise<void> | null = null;

  /** Initialize SignalR connection */
  public init() {
    if (this.connection) return;

    const token = useAuthStore.getState().token || "";

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.backendUrl}/chathub`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.setupListeners();

    this.setupListeners();

    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      this.connectionPromise = this.connection.start()
        .then(() => console.log("SignalR Connected to ChatHub"))
        .catch((err) => {
           console.error("SignalR Connection Error:", err);
           this.connectionPromise = null;
        });
    }
  }

  private async ensureConnection() {
    if (!this.connection) return false;
    if (this.connection.state === signalR.HubConnectionState.Connected) return true;
    
    if (this.connectionPromise) {
      try {
        await this.connectionPromise;
        return true;
      } catch {
        // failed
      }
    }

    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      this.connectionPromise = this.connection.start();
      try {
        await this.connectionPromise;
        return true;
      } catch (err) {
        this.connectionPromise = null;
        return false;
      }
    }

    return false;
  }



  private setupListeners() {
    if (!this.connection) return;

    this.connection.on("ReceiveMessage", (m: BackendMessage) => {
      const isSystemAdmin =
        m.senderType === "Admin" ||
        m.senderType === "ADMIN" ||
        m.senderType === 1 ||
        m.senderType === "1";
      const message: ChatMessage = {
        id: m.id || Math.random().toString(36).substring(7),
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName || (isSystemAdmin ? "Admin" : "User"),
        text: m.message || m.text || "",
        timestamp: m.createdAt || new Date().toISOString(),
        role: isSystemAdmin ? "Admin" : "User",
        targetUserId: m.targetUserId,
        parentMessageId: m.parentMessageId,
        status: "delivered",
        productInfo: m.product
          ? {
              id: m.product.id,
              name: m.product.name,
              price: Number(m.product.price),
            }
          : undefined,
      };
      
      useChatStore.getState().addMessage(message);
    });

    this.connection.on("NewMessageNotification", (m: BackendMessage) => {
       const message: ChatMessage = {
        id: m.id || Math.random().toString(36).substring(7),
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.senderName || "User",
        text: m.message || m.text || "",
        timestamp: m.createdAt || new Date().toISOString(),
        role: "User",
        targetUserId: m.targetUserId,
        parentMessageId: m.parentMessageId,
        status: "delivered",
      };
      useChatStore.getState().addMessage(message);
    });

    this.connection.on("ReceiveReaction", (data: { messageId: string, conversationId: string, reactions: string }) => {
      useChatStore.getState().updateMessageReactions(data.messageId, data.reactions);
    });

    this.connection.on("User Typing ", (conversationId: string, userName: string) => {
      useChatStore.getState().setTyping({
        conversationId,
        userName,
      });
    });

    // Listen for read receipts
    this.connection.on("MessagesRead", (conversationId: string) => {
      useChatStore.getState().markMessagesAsRead(conversationId);
    });
  }

  private getHeaders() {
    const token = useAuthStore.getState().token;
    if (!token) {
      console.error("No token found in auth store!");
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  public async joinConversation(conversationId: string) {
    if (!await this.ensureConnection()) return;

    try {
      await this.connection!.invoke("JoinConversation", conversationId);
    } catch (err) {
      console.error("Error joining conversation group:", err);
    }
  }

  public async joinAdminGroup() {
    if (!await this.ensureConnection()) return;

    try {
      await this.connection!.invoke("JoinAdminGroup");
    } catch (err) {
      console.error("Error joining admin group:", err);
    }
  }

  public async startConversation(productId?: string | null) {
    try {
      const payload = {
        productId: productId ?? null,
      };

      const response = await axios.post(
        `${this.backendUrl}/api/Conversation/start`,
        payload,
        { headers: this.getHeaders() },
      );

      const conversationId = response.data.conversationId;

      useChatStore.getState().setActiveConversationId(conversationId);
      await this.joinConversation(conversationId);

      return conversationId;
    } catch (err) {
      console.error("Error starting conversation", err);
      return null;
    }
  }

 public async SendTyping(conversationId: string ,userName: string) {
  if (this.connection?.state === signalR.HubConnectionState.Connected){
    try {     
       await this.connection.invoke("Typing", conversationId, userName);
    } catch (err) {
      console.error("Typing error :", err);
    }
  }
 }


  public async sendMessage(
    messagePayload: Omit<ChatMessage, "id" | "timestamp">,
  ) {
    let convId = useChatStore.getState().activeConversationId;
    const role = messagePayload.role;

    if (!convId && role === "User") {
      const productId = messagePayload.productInfo?.id ?? null;
      convId = await this.startConversation(productId);
    }

    if (!convId) {
      console.error(" ConversationId missing. ADMIN cannot send message.");
      return;
    }

    const authState = useAuthStore.getState();

    const userId = authState.user?.userId || authState.user?.id;

    // Optimistic UI update
    const optimisticMessage: ChatMessage = {
      ...messagePayload,
      id: Math.random().toString(36).substring(7),
      conversationId: convId,
      senderId: userId,
      timestamp: new Date().toISOString(),
      status: "sent",
    };
    
    useChatStore.getState().addMessage(optimisticMessage);

    const payload = {
      conversationId: convId,
      messageText: messagePayload.text,
      senderType: role === "Admin" ? 1 : 0,
      senderId: userId,
    };

    try {
      await axios.post(`${this.backendUrl}/api/Conversation/send`, payload, {
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  public async addReaction(messageId: string, emoji: string) {
    try {
      await axios.post(`${this.backendUrl}/api/Conversation/react`, {
        messageId,
        emoji
      }, {
        headers: this.getHeaders(),
      });
    } catch (err) {
      console.error("Error adding reaction:", err);
    }
  }

  public async markAsRead(conversationId: string) {
    useChatStore.getState().markMessagesAsRead(conversationId);
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.invoke("MarkAsRead", conversationId);
      } catch (err) {
        console.error("Error sending read receipt:", err);
      }
    }
  }
}

export const signalRService = new SignalRService();
