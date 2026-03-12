"use client"
import Hero from '@/components/ai-analyzer/Hero';
import { useState, useRef, useEffect } from 'react';
import { Loader2, MessageSquare, Send } from 'lucide-react';
import { authFetchClient } from '@/lib/api/authFetchClient';
import Conversation, { metadata } from '@/types/conversation';
import Message from '@/components/ai-analyzer/Message';

interface Suggestion {
  id: string;
  label: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  data?: {[key: string]: any[]};
  metadata?: metadata;
  isError?: boolean;
}

const SUGGESTIONS: Suggestion[] = [
  { id: '1', label: "What is the most selled product in Saudi Arabia?" },
  { id: '2', label: "Create a growth projection chart" },
  { id: '3', label: "Which products are running low on stock (below 20 units)?" },
  { id: '4', label: "Can the same product have different unit prices across purchases?" },
  { id: '5', label: "Predict next week's inventory needs" },
];

const ChatPart = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

      const newMesg: ChatMessage = { role: 'assistant', content: conv.text, data: conv.data, metadata: conv.data_metadata }
      setMessages(prev => [...prev, newMesg]);

      if (conv.error) {
        const errorMesg: ChatMessage = { role: 'assistant', content: conv.error, isError: true }
        setMessages(prev => [...prev, errorMesg]);
      }
      
    } catch (error) {
      console.error(error);
      setError('Sorry. Error occures while generating the response');
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
              <Message key={idx} role={msg.role} content={msg.content} data={msg.data} metadata={msg.metadata} isError={msg.isError}/>
            ))}
            {isLoading && (
              <div className="flex gap-4 items-center text-[#5A5E63] animate-pulse">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            {error && (
              <Message role='assistant' content={error} isError={true}/>
            )}
            <div ref={scrollRef} />
          </div>
        )}
    </>
  )
}

export default ChatPart