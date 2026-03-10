"use client"
import Hero from '@/components/ai-analyzer/Hero';
import { useState, useRef, useEffect } from 'react';
import { Bot, Loader2, MessageSquare, Send, User } from 'lucide-react';
import { DataBlock } from '@/components/ai-analyzer/DataBlock';
import { authFetchClient } from '@/lib/api/authFetchClient';
import Conversation from '@/types/conversation';

interface Suggestion {
  id: string;
  label: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  data?: {[key: string]: any[]};
}

const SUGGESTIONS: Suggestion[] = [
  { id: '1', label: "Analyze last month's sales data" },
  { id: '2', label: "Create a growth projection chart" },
  { id: '3', label: "Summarize the quarterly report" },
  { id: '4', label: "Compare marketing spend vs ROI" },
  { id: '5', label: "Predict next week's inventory needs" },
];

const ChatPart = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    try {
      setIsLoading(true);
      const res = await authFetchClient(`/api/conversations/`, {
        method: 'POST',
        body: JSON.stringify({ prompt: userMsg })
      })

      if (!res.ok) {
        throw new Error('Failed to fetch conversation');
      }
      const conv: Conversation = await res.json()

      setMessages(prev => [...prev, { role: 'assistant', content: conv.text, data: conv.data }]);
      
    } catch (error) {
      console.error(error);
      setError('Failed to fetch conversation');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
    {messages.length === 0 ? (
          <>
            <Hero/>
            <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {SUGGESTIONS.map((sug) => (
                  <button
                    key={sug.id}
                    onClick={() => setInput(sug.label)}
                    className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-sm text-text-secondary hover:border-text-active hover:text-text-active transition-all bg-white shadow-sm shrink-0"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <MessageSquare className="text-text-secondary" size={20} />
                </div>
                <form onSubmit={handleSend}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about your data..."
                    className="w-full pl-12 pr-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-text-active/20 focus:border-text-active transition-all text-text-primary"
                  />
                  <button 
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-text-active text-white rounded-xl hover:bg-text-active/80 transition-colors disabled:opacity-50"
                    disabled={!input.trim()}
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className='p-5'>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#2772CE]/10 flex items-center justify-center shrink-0">
                    <Bot size={18} className="text-[#2772CE]" />
                  </div>
                )}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-1' : 'order-2'}`}>
                  <div className={`p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-gray-100 text-[#1F2324]' 
                      : 'bg-white border border-gray-100 shadow-sm'
                  }`}>
                    <p className="text-[15px] leading-relaxed">{msg.content}</p>
                    {msg.data && <DataBlock data={msg.data} />}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 order-2">
                    <User size={18} className="text-[#5A5E63]" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 items-center text-[#5A5E63] animate-pulse">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        )}
    </>
  )
}

export default ChatPart