import { SignalingMessage } from './types';

export class SignalingClient {
  private ws: WebSocket | null = null;
  private sessionId: string;
  private clientId: string;
  private token?: string;
  private wsUrl: string;
  private messageHandlers: Map<string, Set<(msg: SignalingMessage) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(sessionId: string, clientId: string, wsUrl: string, token?: string) {
    this.sessionId = sessionId;
    this.clientId = clientId;
    this.wsUrl = wsUrl;
    this.token = token;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: SignalingMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Failed to parse signaling message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket closed');
          this.ws = null;
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
        this.connect().catch(console.error);
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  send(message: SignalingMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  on<T extends SignalingMessage['type']>(
    type: T,
    handler: (msg: Extract<SignalingMessage, { type: T }>) => void
  ): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler as (msg: SignalingMessage) => void);
  }

  off<T extends SignalingMessage['type']>(
    type: T,
    handler: (msg: Extract<SignalingMessage, { type: T }>) => void
  ): void {
    this.messageHandlers.get(type)?.delete(handler as (msg: SignalingMessage) => void);
  }

  private handleMessage(message: SignalingMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.messageHandlers.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
