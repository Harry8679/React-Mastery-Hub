import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Code2, Send, Users, Circle, Smile } from 'lucide-react';
import type { ProjectComponentProps } from '../types';

// ==================== TYPES ====================
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  type: 'user' | 'bot' | 'system';
}

interface User {
  id: string;
  name: string;
  status: 'online' | 'offline';
  color: string;
}

// WebSocket Events Type-safe
type WebSocketEvents = {
  open: Record<string, never>;
  message: Message;
  close: Record<string, never>;
};

// ==================== SIMULATEUR WEBSOCKET ====================
// Simule un serveur WebSocket pour la démo
class MockWebSocket {
  private listeners: {
  [K in keyof WebSocketEvents]: Array<(data: WebSocketEvents[K]) => void>;
    } = {
    open: [],
    message: [],
    close: []
  };

  private isConnected = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  
  connect() {
    this.isConnected = true;
    this.emit("open", {});

    const botResponses = [
      "Salut ! Comment ça va ?",
      "C'est intéressant !",
      "Je suis d'accord 👍",
      "Raconte-moi plus !",
      "Super discussion !",
      "😊 J'adore cette conversation",
      "Que penses-tu de React ?",
      "Les WebSockets c'est génial !",
    ];
    
    this.intervalId = setInterval(() => {
      if (this.isConnected && Math.random() > 0.7) {
        const randomResponse =
          botResponses[Math.floor(Math.random() * botResponses.length)];

        const message: Message = {
          id: Date.now().toString(),
          text: randomResponse,
          sender: "Bot",
          timestamp: new Date(),
          type: "bot",
        };

        this.emit("message", message);
      }
    }, 5000);
  }

  send(data: Message) {
    setTimeout(() => {
      this.emit("message", data);
    }, 100);
  }

  on<K extends keyof WebSocketEvents>(
  event: K,
  callback: (data: WebSocketEvents[K]) => void
    ) {
    this.listeners[event].push(callback);
  }

  off<K extends keyof WebSocketEvents>(
  event: K,
  callback: (data: WebSocketEvents[K]) => void
    ) {
    const current = this.listeners[event];
    this.listeners[event] = current.filter(cb => cb !== callback);
  }

  private emit<K extends keyof WebSocketEvents>(
    event: K,
    data: WebSocketEvents[K]
  ) {
    this.listeners[event]?.forEach(cb => cb(data));
  }

  close() {
    this.isConnected = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.emit("close", {});
  }
}


// ==================== COMPOSANT PRINCIPAL ====================
export default function WebSocketChatProject({ onBack }: ProjectComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [users] = useState<User[]>([
    { id: '1', name: 'Alice', status: 'online', color: 'bg-blue-500' },
    { id: '2', name: 'Bob', status: 'online', color: 'bg-green-500' },
    { id: '3', name: 'Charlie', status: 'offline', color: 'bg-purple-500' },
  ]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<MockWebSocket | null>(null);
//   const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scroll vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Connexion WebSocket
  const handleConnect = () => {
    if (!username.trim()) return;

    // Créer la connexion mock
    wsRef.current = new MockWebSocket();
    
    wsRef.current.on('open', () => {
      setIsConnected(true);
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: `${username} a rejoint le chat`,
        sender: 'System',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    wsRef.current.on('message', (data: Message) => {
      setMessages(prev => [...prev, data]);
    });

    wsRef.current.on('close', () => {
      setIsConnected(false);
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: 'Déconnecté du serveur',
        sender: 'System',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
    });

    wsRef.current.connect();
  };

  // Déconnexion
  const handleDisconnect = () => {
    if (wsRef.current) {
      const systemMessage: Message = {
        id: Date.now().toString(),
        text: `${username} a quitté le chat`,
        sender: 'System',
        timestamp: new Date(),
        type: 'system'
      };
      setMessages(prev => [...prev, systemMessage]);
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  // Envoyer un message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !wsRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: username,
      timestamp: new Date(),
      type: 'user'
    };

    wsRef.current.send(message);
    setInputMessage('');
    
    // Arrêter l'indicateur de frappe
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setTypingUsers([]);
  };

  // Indicateur de frappe
  const handleTyping = () => {
    if (!typingUsers.includes(username)) {
      setTypingUsers(prev => [...prev, username]);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u !== username));
    }, 1000);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ChevronLeft size={20} />
        Retour à l'accueil
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">WebSocket Chat</h1>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {["WebSocket", "Real-time", "Chat"].map((concept) => (
                  <span
                    key={concept}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {!isConnected ? (
            // Login Screen
            <div className="p-12">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Rejoindre le Chat</h2>
                  <p className="text-gray-600">Entre ton nom pour commencer</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleConnect(); }} className="space-y-4">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ton nom..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!username.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Se Connecter
                  </button>
                </form>

                <div className="mt-8 bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
                  <p className="font-semibold mb-2">💡 Comment ça marche :</p>
                  <ul className="list-disc ml-5 space-y-1">
                    <li>WebSocket pour communication temps réel</li>
                    <li>Messages bidirectionnels instantanés</li>
                    <li>Indicateurs de présence en ligne</li>
                    <li>Indicateur de frappe (typing...)</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Chat Interface
            <div className="flex h-[600px]">
              {/* Sidebar - Users List */}
              <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="text-gray-600" size={20} />
                  <h3 className="font-bold text-gray-800">Utilisateurs ({users.length})</h3>
                </div>

                <div className="space-y-2">
                  {/* Current User */}
                  <div className="flex items-center gap-3 p-3 bg-blue-100 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {username[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{username} (Vous)</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Circle size={8} fill="currentColor" />
                        En ligne
                      </div>
                    </div>
                  </div>

                  {/* Other Users */}
                  {users.map(user => (
                    <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className={`w-10 h-10 ${user.color} rounded-full flex items-center justify-center text-white font-bold`}>
                        {user.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{user.name}</div>
                        <div className={`flex items-center gap-1 text-xs ${user.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                          <Circle size={8} fill="currentColor" />
                          {user.status === 'online' ? 'En ligne' : 'Hors ligne'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                >
                  Se Déconnecter
                </button>
              </div>

              {/* Main Chat Area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.type === 'system' ? (
                        <div className="text-center w-full">
                          <div className="inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm">
                            {message.text}
                          </div>
                        </div>
                      ) : (
                        <div className={`max-w-[70%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {message.type === 'bot' && (
                              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                B
                              </div>
                            )}
                            <span className="text-xs text-gray-500 font-semibold">
                              {message.sender}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && typingUsers[0] !== username && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span>quelqu'un écrit...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <button
                      type="button"
                      className="p-3 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Smile className="text-gray-600" size={24} />
                    </button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => {
                        setInputMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Écris ton message..."
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <Send size={20} />
                      Envoyer
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {!isConnected && (
            <div className="p-8 bg-blue-50">
              <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Code2 size={20} className="text-blue-500" />
                Concepts WebSocket:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>
                  • <strong>WebSocket</strong>: Connexion bidirectionnelle persistante
                </li>
                <li>
                  • <strong>Real-time</strong>: Échange de messages instantané
                </li>
                <li>
                  • <strong>Event-driven</strong>: Écoute d'événements (open, message, close, error)
                </li>
                <li>
                  • <strong>Auto-scroll</strong>: Scroll automatique vers les nouveaux messages
                </li>
                <li>
                  • <strong>Typing Indicator</strong>: Indicateur de frappe avec timeout
                </li>
                <li>
                  • <strong>User Presence</strong>: Statuts en ligne/hors ligne
                </li>
              </ul>

              <div className="mt-4 bg-white rounded p-4 space-y-2">
                <p className="text-sm text-gray-600 font-mono">
                  const ws = new WebSocket('ws://localhost:8080');
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  ws.onmessage = (event) =&gt; handleMessage(event.data);
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  ws.send(JSON.stringify(message));
                </p>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
                <p className="font-bold mb-2">💡 Note:</p>
                <p>
                  Cette démo simule un WebSocket. Dans une vraie application, tu aurais besoin d'un serveur WebSocket
                  (Node.js avec ws, Socket.io, etc.) pour gérer les connexions multiples.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}