import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Card } from './Card';
import { ChatMessage } from '../types';

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'System', text: 'Study group started!', timestamp: new Date() },
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Me',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate auto-reply for demo purposes
    if (messages.length % 3 === 0) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(), 
            sender: 'Bot', 
            text: 'Keep up the good work!', 
            timestamp: new Date()
        }]);
      }, 1000);
    }
  };

  return (
    <Card className="h-full flex flex-col" title="채팅">
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-hide min-h-[300px]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'Me' ? 'items-end' : 'items-start'}`}>
            <div className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
              msg.sender === 'Me' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-600 text-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">
              {msg.sender} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="텍스트 입력..."
          className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button 
          type="submit"
          className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </Card>
  );
};