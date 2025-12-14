import { useState } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Settings,
  History,
  BookOpen
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
          <h1 className="text-6xl font-bold text-slate-900 mb-4 tracking-tight">
            Hi there, <span className="text-[#0277BD]">{userFirstName}</span>
          </h1>
          <h2 className="text-5xl font-semibold text-slate-700 mb-6 tracking-tight leading-tight">
            What would you like to know?
          </h2>
          <p className="text-slate-500 max-w-lg mr-auto text-lg">
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
              className="p-4 text-left bg-white border border-slate-200 rounded-xl hover:border-[#0277BD] hover:shadow-md transition-all group"
              onClick={() => handleSend(prompt.desc)}
            >
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-600 mb-3 group-hover:bg-blue-50 group-hover:text-[#0277BD] transition-colors">
                <prompt.icon size={18} />
              </div>
              <h3 className="font-semibold text-slate-900 text-sm mb-1">{prompt.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{prompt.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-6 px-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0 ${msg.role === 'assistant' ? 'bg-gradient-to-r from-blue-500 to-teal-400' : 'bg-slate-700'}`}>
              {msg.role === 'assistant' ? <Sparkles size={16} /> : <div className="text-xs font-bold">ME</div>}
            </div>
            <div className={`p-4 rounded-2xl shadow-sm max-w-[80%] ${msg.role === 'assistant' ? 'bg-white border border-slate-200 rounded-tl-none' : 'bg-[#0277BD] text-white rounded-tr-none'}`}>
              <p className={`text-sm ${msg.role === 'assistant' ? 'text-slate-700' : 'text-white'} whitespace-pre-wrap`}>{msg.content}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <BookOpen size={14} />
                    <span className="text-xs font-medium">Sources</span>
                  </div>
                  <div className="space-y-2">
                    {msg.sources.map((source, sIdx) => (
                      <div key={sIdx} className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600">
                        <p className="font-medium text-[#0277BD] mb-1 truncate">
                          {decodeURIComponent(source.source_name.split('/').pop()?.split('?')[0] || 'Document')}
                        </p>
                        <p className="line-clamp-2 text-slate-500 italic">"{source.text_snippet}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-400 flex items-center justify-center text-white flex-shrink-0">
              <Sparkles size={16} />
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-none relative mb-0">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-2 pt-2 pb-1 focus-within:ring-2 focus-within:ring-[#0277BD] focus-within:border-transparent transition-all">
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
            className="w-full p-3 min-h-[60px] max-h-[120px] resize-none focus:outline-none text-slate-700 text-sm bg-transparent"
            disabled={isLoading}
          />

          <div className="flex items-center justify-between px-2 pb-1">
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                <Paperclip size={14} />
                Add Attachment
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
                <ImageIcon size={14} />
                Use Image
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{input.length}/1000</span>
              <button
                className={`p-2 rounded-lg transition-colors ${input.trim() && !isLoading ? 'bg-[#0277BD] text-white hover:bg-[#026aa8]' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                disabled={!input.trim() || isLoading}
                onClick={() => handleSend(input)}
              >
                <Send size={16} />
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
