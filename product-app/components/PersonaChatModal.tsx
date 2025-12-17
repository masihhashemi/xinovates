import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { CustomerPersonaOutput, ChatMessage } from '../types';
import { XMarkIcon, PaperAirplaneIcon } from './Icons';
import Spinner from './Spinner';

interface PersonaChatModalProps {
    persona: CustomerPersonaOutput | null;
    onClose: () => void;
}

const PersonaChatModal: React.FC<PersonaChatModalProps> = ({ persona, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (persona) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const systemInstruction = `You are playing the role of ${persona.name}, a ${persona.age}-year-old ${persona.occupation}.
Your personality and background:
- Bio: ${persona.bio}
- Your main goals in life are: ${persona.goals.join(', ')}
- Your biggest frustrations are: ${persona.frustrations.join(', ')}
You must answer all questions strictly from the perspective of ${persona.name}. Be friendly, conversational, and embody this persona completely. Keep your answers concise and natural-sounding. Never break character or mention that you are an AI.`;

            chatRef.current = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: { systemInstruction },
            });
            setMessages([]);
            setError(null);
        }
    }, [persona]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatRef.current || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const stream = await chatRef.current.sendMessageStream({ message: input });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', text: '...' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                    return newMessages;
                });
            }
        } catch (err) {
            console.error(err);
            setError("Sorry, I'm having trouble responding right now.");
             setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage.role === 'model') {
                    newMessages.pop();
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!persona) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-xl w-full h-[80vh] max-h-[700px] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-4">
                        {persona.avatarB64 ? (
                            <img src={`data:image/jpeg;base64,${persona.avatarB64}`} alt={persona.name} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                             <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                        )}
                        <div>
                            <h2 className="text-xl font-bold text-white">Interview with {persona.name}</h2>
                            <p className="text-sm text-gray-400">{persona.occupation}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                     {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <img src={`data:image/jpeg;base64,${persona.avatarB64}`} alt={persona.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0"/>
                            )}
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-white ${msg.role === 'user' ? 'bg-blue-600 rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                     {error && <p className="text-red-400 text-xs text-center mb-2">{error}</p>}
                    <form onSubmit={handleSend} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={`Ask ${persona.name} a question...`}
                            disabled={isLoading}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500 disabled:opacity-50"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading || !input.trim()}
                            className="p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
                        >
                            {isLoading ? <Spinner/> : <PaperAirplaneIcon className="w-6 h-6" />}
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default PersonaChatModal;