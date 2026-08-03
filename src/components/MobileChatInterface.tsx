import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award
} from 'lucide-react';
import { SplashChatMessage } from '../types';
import { TEAM_INFO } from '../data/teamData';

interface MobileChatInterfaceProps {
  fetchDocContent?: () => Promise<string>;
}

export const MobileChatInterface: React.FC<MobileChatInterfaceProps> = ({ fetchDocContent }) => {
  const [inputMessage, setInputMessage] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [messages, setMessages] = useState<SplashChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'splash',
      text: `Splish Splash! Welcome to the Peters Township Swim and Dive Team assistant!
I can help you with the schedule, contact information, directions, and interest. How can I help?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowups: [
        'What is the schedule?',
        'Who can I contact?',
        'Where are directions to the pool?',
        'How do I show interest in joining?',
      ],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMsg: SplashChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      let docContext = '';
      if (fetchDocContent) {
        try {
          docContext = await fetchDocContent();
        } catch (err) {
          console.error('Error fetching doc content in chat interface:', err);
        }
      }

      const response = await fetch('/api/splash/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6),
          docContext: docContext,
        }),
      });

      const data = await response.json();
      const botReply = data.reply || data.fallbackReply || "Splish splash! I'm here to help with Peters Township Swim and Dive Team details!";

      const splashMsg: SplashChatMessage = {
        id: `spl-${Date.now()}`,
        sender: 'splash',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: data.suggestedFollowups || [
          'What are the practice group times?',
          'When are tryouts?',
          'How do volunteer shifts work?',
        ],
      };

      setMessages((prev) => [...prev, splashMsg]);
      speakText(botReply);
    } catch (err) {
      console.error('Failed to communicate with Splash AI:', err);
      const fallbackMsg: SplashChatMessage = {
        id: `spl-err-${Date.now()}`,
        sender: 'splash',
        text: `Splish splash! 🏊‍♂️ No predefined swim team details loaded. Please provide your team details or schedule, and I will be happy to answer your questions!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: ['How do I add my swim team info?', 'What kind of information can I provide?'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'splash',
        text: `Splish Splash! Welcome to the Peters Township Swim and Dive Team assistant!
I can help you with the schedule, contact information, directions, and interest. How can I help?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowups: [
          'What is the schedule?',
          'Who can I contact?',
          'Where are directions to the pool?',
          'How do I show interest in joining?',
        ],
      },
    ]);
  };

  const quickTopics = [
    { label: '📅 Schedule', prompt: 'What is the practice and meet schedule?' },
    { label: '📧 Contact Info', prompt: 'What is the contact information for the team?' },
    { label: '🗺️ Directions', prompt: 'What are the directions to the pool?' },
    { label: '🏊 Join / Interest', prompt: 'How do I express interest in joining the team?' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-0 sm:p-4 lg:p-6 select-none font-sans antialiased">
      {/* Background Subtle Gradient Glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-neutral-950 to-neutral-950" />

      {/* Outer Cell Phone Frame */}
      <div className="relative w-full max-w-[420px] h-[100vh] sm:h-[840px] sm:max-h-[92vh] bg-neutral-900 sm:rounded-[48px] shadow-2xl border-0 sm:border-[8px] sm:border-neutral-800 flex flex-col overflow-hidden ring-1 ring-white/10">
        
        {/* Phone Speaker & Camera Notch (Visible on Tablet/Desktop Frame View) */}
        <div className="hidden sm:flex absolute top-0 left-1/2 -translate-x-1/2 w-36 h-5 bg-black rounded-b-2xl z-40 items-center justify-center gap-2 px-3">
          <div className="w-12 h-1 bg-neutral-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-neutral-900 rounded-full ring-1 ring-neutral-800" />
        </div>

        {/* Mobile Phone Status Bar */}
        <div className="bg-black text-white px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold tracking-tight z-30 select-none border-b border-neutral-900">
          <span className="font-bold text-[11px]">{currentTime || '9:41'}</span>
          <div className="flex items-center gap-2 text-neutral-300">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* App Bar / Header */}
        <div className="bg-neutral-900 text-white px-4 py-3 flex items-center justify-between border-b border-neutral-800 z-20 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md ring-2 ring-red-500/30">
                S
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-black text-base text-white tracking-tight">
                  Splash
                </h1>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-600/30 text-red-400 uppercase tracking-widest border border-red-500/30">
                  Swim & Dive
                </span>
              </div>
              <p className="text-[11px] font-medium text-neutral-400 leading-none mt-1">
                Peters Township Swim and Dive Team
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={speechEnabled ? 'Mute Voice' : 'Enable Voice'}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                speechEnabled
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={handleResetChat}
              title="Reset Chat"
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Knowledge Pills Carousel */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
          {quickTopics.map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(topic.prompt)}
              className="px-2.5 py-1 rounded-xl bg-neutral-800 hover:bg-red-600 hover:text-white text-neutral-300 font-semibold border border-neutral-700/60 whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Chat Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-950 text-neutral-100 scroll-smooth">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start group animate-in fade-in duration-150`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-black shadow-sm mt-0.5 ${
                    isUser
                      ? 'bg-neutral-800 text-white border border-neutral-700'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isUser ? 'ME' : 'S'}
                </div>

                {/* Message Body */}
                <div className={`max-w-[85%] space-y-1.5`}>
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-red-600 text-white rounded-tr-none font-normal'
                        : 'bg-neutral-900 text-neutral-100 rounded-tl-none border border-neutral-800 font-normal'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans antialiased text-sm leading-relaxed tracking-normal break-words">
                      {msg.text}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-white/10 text-[10px] opacity-75">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="hover:opacity-100 transition-opacity p-0.5 cursor-pointer flex items-center gap-1"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Suggested Follow-up Action Chips */}
                  {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowups.map((followup, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSendMessage(followup)}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 font-semibold transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                        >
                          <span>{followup}</span>
                          <ChevronRight className="w-3 h-3 text-red-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2.5 animate-pulse">
              <div className="w-7 h-7 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 font-black text-xs">
                S
              </div>
              <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none text-xs text-neutral-400 font-semibold flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
                <span>Splash is retrieving team details...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Phone Bottom Input Bar */}
        <div className="bg-neutral-900 border-t border-neutral-800 p-3 space-y-2 z-20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-neutral-950 rounded-2xl p-1.5 border border-neutral-800 focus-within:border-red-600/60 transition-colors"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Splash about meets, contact information, and directions..."
              className="flex-1 px-3 py-2 text-sm text-white placeholder:text-neutral-500 bg-transparent outline-none font-normal"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-red-600 text-white p-2 rounded-xl font-bold hover:bg-red-700 disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Home Bar Accent / Footer Tagline */}
          <div className="flex items-center justify-between px-1 text-[9px] font-bold uppercase tracking-widest text-neutral-500">
            <span>Official Team Assistant</span>
            <span className="text-red-500 flex items-center gap-1">
              Go PT Indians! 🔴
            </span>
          </div>

          {/* iOS Home Indicator Bar */}
          <div className="w-28 h-1 bg-neutral-700 rounded-full mx-auto mt-1" />
        </div>

      </div>
    </div>
  );
};
