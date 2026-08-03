import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Volume2, VolumeX, Sparkles, RefreshCw, Bot, User, CheckCircle2, Waves, ArrowRight } from 'lucide-react';
import { SplashChatMessage } from '../types';
import { FREQUENT_QUESTIONS, TEAM_INFO } from '../data/teamData';

interface SplashChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

export const SplashChatModal: React.FC<SplashChatModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [inputMessage, setInputMessage] = useState('');
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
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Speech synthesis helper
  const speakText = (text: string) => {
    if (!speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const cleanText = text.replace(/[*#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.1; // Cheerful tone
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
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
      const response = await fetch('/api/splash/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6), // Send recent context
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
          'View Practice Groups',
          'Check Meet Calendar',
          'Sign Up for Volunteer Shifts',
        ],
      };

      setMessages((prev) => [...prev, splashMsg]);
      speakText(botReply);
    } catch (err) {
      console.error('Failed to communicate with Splash AI:', err);
      const fallbackMsg: SplashChatMessage = {
        id: `spl-err-${Date.now()}`,
        sender: 'splash',
        text: `Splish splash! 🏊‍♂️ Tryouts are August 22 & 24 at 5:30 PM (PTHS Pool). Practice groups range from Mini Indians to Senior Competitive. Feel free to explore our website tabs or contact Coach Sarah at ${TEAM_INFO.contacts.headCoach}!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-[85vh] max-h-[700px] rounded-3xl shadow-2xl flex flex-col border border-neutral-200 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-black text-white p-5 flex items-center justify-between shadow-md border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                S
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-2xl leading-none text-white flex items-center gap-1.5">
                  Splash!
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white uppercase tracking-wider">
                  Team Assistant
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-400 italic mt-0.5">
                Peters Township Swim and Dive Team Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSpeechEnabled(!speechEnabled);
                if (speechEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              title={speechEnabled ? 'Mute Splash Voice' : 'Enable Splash Voice'}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                speechEnabled ? 'bg-red-600 text-white' : 'text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {speechEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Knowledge Base Shortcuts Bar */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
          <span className="text-neutral-500 font-bold text-[10px] uppercase tracking-widest">Suggested:</span>
          {[
            { label: '📅 TRYOUT DATES', prompt: 'When and where are tryouts?' },
            { label: '⏱️ PRACTICE TIMES', prompt: 'What is the practice schedule for each group?' },
            { label: '🤝 VOLUNTEER SHIFTS', prompt: 'How does the parent volunteer requirement work?' },
            { label: '🩱 SUIT FIT NIGHT', prompt: 'When is suit fit night and what is the team suit?' },
          ].map((topic, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(topic.prompt)}
              className="text-[10px] font-bold bg-white text-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-300 uppercase hover:bg-red-600 hover:text-white hover:border-red-600 transition-all cursor-pointer shadow-2xs"
            >
              {topic.label}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 bg-neutral-50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-xs font-black shadow-md ${
                    isUser
                      ? 'bg-neutral-900 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {isUser ? 'ME' : 'S'}
                </div>

                {/* Message Content */}
                <div className={`max-w-[84%] space-y-2`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl shadow-xs ${
                      isUser
                        ? 'bg-neutral-900 text-white rounded-tr-none font-normal'
                        : 'bg-white text-neutral-900 rounded-tl-none border-l-4 border-red-600 border-y border-r border-neutral-200/80 font-normal'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans antialiased text-sm sm:text-[15px] leading-relaxed sm:leading-6 tracking-normal">
                      {msg.text}
                    </div>

                    <div
                      className={`text-[10px] mt-2.5 flex items-center justify-end font-semibold ${
                        isUser ? 'text-neutral-400' : 'text-neutral-400'
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* Suggested Followups */}
                  {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedFollowups.map((followup, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => {
                            if (followup.includes('Practice Groups')) onNavigateTab('groups');
                            else if (followup.includes('Meet Calendar')) onNavigateTab('meets');
                            else if (followup.includes('Volunteer')) onNavigateTab('volunteers');
                            else handleSendMessage(followup);
                          }}
                          className="text-[11px] px-3 py-1 rounded-full bg-white hover:bg-red-600 hover:text-white text-neutral-900 border border-neutral-300 font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                        >
                          <span>{followup}</span>
                          <ArrowRight className="w-3 h-3 text-red-500 hover:text-white" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 font-black">
                S
              </div>
              <div className="bg-white border-l-4 border-red-600 border border-neutral-200 p-4 rounded-3xl rounded-tl-none text-xs text-neutral-800 font-semibold flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                <span>Splash is retrieving Peters Township team details...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 bg-neutral-100 border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="bg-white rounded-2xl p-1.5 flex items-center shadow-inner border border-neutral-300"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask Splash about meets, contact information, and directions..."
              className="flex-1 px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none font-normal"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm hover:bg-red-700 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <span>Ask Splash</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-2 px-1">
            <span>Grounded in Official Team Rules</span>
            <span className="text-red-600">Go PT Indians! 🔴⚪🔴</span>
          </div>
        </div>
      </div>
    </div>
  );
};
