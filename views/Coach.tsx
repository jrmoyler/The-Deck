import React, { useState, useRef, useEffect } from 'react';
import { getCoachResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const Coach: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'I am your tactical fitness coach. Ask me about form, strategy, or injury prevention.', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const responseText = await getCoachResponse(input);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: Date.now() }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-deck-dark pb-20">
        <header className="p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-xl font-black text-white">AI COACH</h1>
            <p className="text-xs text-deck-purple font-mono">GEMINI-2.5-FLASH // LIVE</p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-zinc-800 text-white rounded-br-none' 
                        : 'bg-deck-purple/10 border border-deck-purple/20 text-deck-purple rounded-bl-none'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="bg-deck-purple/10 border border-deck-purple/20 p-4 rounded-2xl rounded-bl-none">
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-deck-purple rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-deck-purple rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-deck-purple rounded-full animate-bounce delay-200"></div>
                        </div>
                    </div>
                </div>
            )}
            <div ref={bottomRef}></div>
        </div>

        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask about your form..."
                    className="flex-1 bg-zinc-800 text-white border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-deck-purple outline-none"
                />
                <button 
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-deck-purple text-white p-3 rounded-xl disabled:opacity-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
  );
};

export default Coach;
