import * as signalR from "@microsoft/signalr";
import axios from "axios";
import { useChatStore, type ChatMessage } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

interface BackendMessage {
  id?: string;
  senderId: string;
  senderName?: string;
  message?: string;
  conversationId?: string,
  text?: string;
  createdAt?: string;
  senderType: "User" | "Admin" | 0 | 1;
  targetUserId?: string;
  status?: string;
  product?: {
    id: string;
    name: string;
    price: number | string;
  };
}

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private backendUrl = import.meta.env.VITE_API_URL || "https://localhost:7227";

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

    this.connection
      .start()
      .then(() => console.log("SignalR Connected to ChatHub"))
      .catch((err) => console.error("SignalR Connection Error:", err));
  }

  private setupListeners() {
    if (!this.connection) return;

    this.connection.on("ReceiveMessage", (m: BackendMessage) => {
      const isSystemAdmin = m.senderType === "Admin" || m.senderType === 1;
      const message: ChatMessage = {
        id: m.id || Math.random().toString(36).substring(7),
       conversationId: m.conversationId,
        senderId: m.senderId,
        senderName:
          m.senderName ||
          (isSystemAdmin ?   "Admin" : "User"),
        text: m.message || m.text || "",
        timestamp: m.createdAt || new Date().toISOString(),
        role: isSystemAdmin ? "Admin" : "User",
        targetUserId: m.targetUserId,
        status:
          (m.status?.toLowerCase() as "sent" | "read" | "delivered") || "sent",
        productInfo: m.product
  ? {
      id: m.product.id,
      name: m.product.name,
      price: Number(m.product.price), 
    }
  : undefined
      };
      useChatStore.getState().addMessage(message);
    });

    // Listen for read receipts
    this.connection.on("MessagesRead", (userId: string) => {
      useChatStore.getState().markMessagesAsRead(userId);
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
    if (!this.connection) return;

    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      await this.connection.start();
    }

    try {
      await this.connection.invoke("JoinConversation", conversationId);
    } catch (err) {
      console.error("Error joining conversation group:", err);
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
      { headers: this.getHeaders() }
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


public async sendMessage(
  messagePayload: Omit<ChatMessage, "id" | "timestamp">
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

const userId = authState.user?.userId;

const payload = {
  conversationId: convId,
  messageText: messagePayload.text,
  senderType: role === "Admin" ? 1 : 0,
  senderId: userId,
};

try {
  await axios.post(
    `${this.backendUrl}/api/Conversation/send`,
    payload,
    { headers: this.getHeaders() }
  );

  useChatStore.getState().addMessage({
    ...messagePayload,
    conversationId: convId,
    senderId: userId, 
    timestamp: new Date().toISOString(),
    status: "sent",
  });

} catch (err) {
  console.error("Error sending message:", err);
}
}

  public async markAsRead(userId: string) {
    useChatStore.getState().markMessagesAsRead(userId);
  }
}

export const signalRService = new SignalRService();
