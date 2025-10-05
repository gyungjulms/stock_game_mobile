import { io, Socket } from 'socket.io-client';

export type SocketEvents = {
  connect: () => void;
  disconnect: () => void;
  'participant:joined': (payload: any) => void;
  'portfolio:updated': (payload: any) => void;
  'turn:advanced': (payload: any) => void;
  'game:reset_done': (payload: any) => void;
};

let socket: Socket | null = null;

export function getSocket(baseUrl?: string) {
  if (!socket) {
    const url = baseUrl || process.env.EXPO_PUBLIC_SOCKET_URL || 'http://127.0.0.1:8080';
    socket = io(url, { transports: ['websocket'] });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


