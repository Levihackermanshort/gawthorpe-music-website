'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquareText, X, Send, Bot, User, Sparkles } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Achelon, your G.T.M.C.E assistant. How can I help you today? It's a Gawthorpe Ting!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(1) // exclude initial greeting for history mapping easily if wanted, but passing it all is fine
        })
      });

      const data = await response.json();
      
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.text }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: "Connection error. Please try again later." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 shadow-xl border border-red-500/50 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
          <MessageSquareText className="w-6 h-6 relative z-10" />
        </button>
      )}

      {isOpen && (
        <div className="bg-[#0b0b0b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-[360px] h-[500px] max-h-[80vh] flex flex-col font-sans overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-red-600 p-4 shrink-0 flex items-center justify-between relative shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-red-600" />
                </div>
                <div className="absolute -top-1 -right-1 text-orange-400">
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-white leading-tight">Achelon</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <span className="text-[10px] text-white/80 font-medium uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white/80 hover:text-white p-1 rounded-full transition-colors hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth min-h-0 bg-black/90">
            <div className="text-center mb-6">
               <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/10 pb-1">ACHELON</span>
            </div>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={"flex max-w-[85%] " + (msg.role === 'user' ? "ml-auto justify-end" : "justify-start")}
              >
                <div
                  className={
                    "p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap " +
                    (msg.role === 'user'
                      ? "bg-red-600 text-white rounded-br-none"
                      : "bg-[#1a1a1a] text-zinc-200 border border-white/5 rounded-tl-none")
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start max-w-[85%]">
                <div className="p-4 rounded-2xl bg-[#1a1a1a] border border-white/5 rounded-tl-none text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-black/95 border-t border-white/10 shrink-0">
             <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Achelon anything..."
                className="w-full bg-[#111] border border-white/10 rounded-xl pr-12 pl-4 py-3 placeholder-zinc-500 text-sm text-white focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all font-sans"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:text-red-400 disabled:opacity-50 disabled:hover:text-red-500 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
