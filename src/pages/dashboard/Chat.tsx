// deploy

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Settings,
  History,
  BookOpen,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { runMultiRagQuery } from '../../api/rag';
import type { RagQueryResponse } from '../../interfaces/rag';

const Chat = () => {
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{
    role: 'user' | 'assistant',
    content: string,
    sources?: RagQueryResponse['sources']
  }>>([]);

  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const toggleSources = (index: number) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const userFirstName = user?.name?.split(' ')[0] || 'there';

  const suggestedPrompts = [
    { icon: FileText, title: "Summarize Report", desc: "Get a summary of my latest blood test" },
    { icon: Sparkles, title: "Explain Diagnosis", desc: "What does 'Arteriosclerosis' mean?" },
    { icon: History, title: "Compare Vitals", desc: "Compare my BP trends over last 3 months" },
    { icon: Settings, title: "Diet Plan", desc: "Suggest a diet for high cholesterol" },
  ];

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await runMultiRagQuery({ question: userMessage });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.answer,
        sources: response.sources
      }]);
    } catch (error) {
      console.error('Failed to query documents:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error while processing your request. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-4xl mx-auto pb-0">
      {/* Header - Only show when no messages */}
      {messages.length === 0 && (
        <div className="flex-none mb-12 mt-10 text-left">
          <h1 className="text-6xl font-extrabold text-slate-950 dark:text-white mb-4 tracking-tight">
            Hi there, <span className="text-[#0277BD] dark:text-blue-400">{userFirstName}</span>
          </h1>
          <h2 className="text-5xl font-bold text-slate-800 dark:text-slate-200 mb-6 tracking-tight leading-tight">
            What would you like to know?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mr-auto text-lg font-medium">
            Use one of the most common prompts below or use your own to begin chatting with your medical history.
          </p>
        </div>
      )}

      {/* Suggested Prompts - Only show when no messages */}
      {messages.length === 0 && (
        <div className="flex-none grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              className="p-4 text-left bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-[#0277BD] dark:hover:border-blue-500 hover:shadow-xl dark:hover:shadow-blue-900/10 transition-all group"
              onClick={() => handleSend(prompt.desc)}
            >
              <div className="w-9 h-9 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-[#0277BD] dark:group-hover:text-blue-400 transition-colors">
                <prompt.icon size={18} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{prompt.title}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">{prompt.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-6 px-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg ${msg.role === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-teal-400' : 'bg-slate-800 dark:bg-slate-700'}`}>
              {msg.role === 'assistant' ? <Sparkles size={18} /> : <div className="text-[10px] font-extrabold uppercase">You</div>}
            </div>
            <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${msg.role === 'assistant' ? 'bg-white border border-slate-200 rounded-tl-none' : 'bg-[#0277BD] text-white rounded-tr-none'}`}>
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
              )}

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleSources(idx)}
                    className="flex items-center gap-2 mb-2 text-slate-400 hover:text-slate-600 transition-colors w-full"
                  >
                    <BookOpen size={14} />
                    <span className="text-xs font-medium">Sources ({msg.sources.length})</span>
                    {expandedSources.has(idx) ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                  {expandedSources.has(idx) && (
                    <div className="space-y-2">
                      {msg.sources.map((source, sIdx) => (
                        <div key={sIdx} className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600">
                          <p className="font-medium text-[#0277BD] mb-1 truncate" title={source.source_name}>
                            {source.source_name}
                          </p>
                          <p className="line-clamp-2 text-slate-500 italic">"{source.text_snippet}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
              <Sparkles size={18} />
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-none relative mb-0">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl px-2 pt-2 pb-1 focus-within:ring-2 focus-within:ring-[#0277BD]/20 dark:focus-within:ring-blue-500/10 transition-all overflow-hidden border-b-4 border-b-slate-100 dark:border-b-slate-800/50">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask whatever you want..."
            className="w-full p-4 min-h-[60px] max-h-[150px] resize-none focus:outline-none text-slate-700 dark:text-slate-200 text-sm bg-transparent font-medium"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Paperclip size={14} />
                Attach
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <ImageIcon size={14} />
                Image
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{input.length}/1000</span>
              <button
                className={`p-2.5 rounded-xl transition-all active:scale-95 ${input.trim() && !isLoading ? 'bg-[#0277BD] text-white hover:bg-[#026aa8] shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'}`}
                disabled={!input.trim() || isLoading}
                onClick={() => handleSend(input)}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-slate-400">
            AI can make mistakes. Please verify important medical information with your doctor.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
