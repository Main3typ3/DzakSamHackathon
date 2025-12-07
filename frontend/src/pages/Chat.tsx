import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Trash2, Bot, User, Sparkles, Code2, MessageSquare, Zap } from 'lucide-react';
import { sendChatMessage, clearChatHistory, generateContract, type Badge, type ContractGenerationResponse } from '../api';
import ContractCodeBlock from '../components/ContractCodeBlock';
import { useAuth } from '../context/AuthContext';
import { AuthPrompt } from '../components/AuthRequired';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contract?: ContractGenerationResponse;
  isNew?: boolean;
}

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex items-center space-x-1 px-2">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
);

export default function Chat() {
  const { isAuthenticated } = useAuth();
  const [contractMode, setContractMode] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to ChainQuest Academy! I'm your AI Blockchain Tutor, powered by SpoonOS. I can help you understand blockchain concepts, crypto wallets, smart contracts, DeFi, and more. What would you like to learn about today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-focus input
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      isNew: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (contractMode) {
        // Generate smart contract
        const response = await generateContract(input);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Contract generated successfully!',
          contract: response,
          isNew: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (response.xp_gained) {
          setXpGained(response.xp_gained);
          setTimeout(() => setXpGained(null), 3000);
        }

        if (response.new_badges && response.new_badges.length > 0) {
          setNewBadges(response.new_badges);
          setTimeout(() => setNewBadges([]), 5000);
        }
      } else {
        // Regular chat
        const response = await sendChatMessage(input);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.response,
          isNew: true,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (response.new_badges && response.new_badges.length > 0) {
          setNewBadges(response.new_badges);
          setTimeout(() => setNewBadges([]), 5000);
        }
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please make sure the backend server is running and try again.",
        isNew: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      // Remove isNew flag after animation
      setTimeout(() => {
        setMessages(prev => prev.map(m => ({ ...m, isNew: false })));
      }, 500);
    }
  };

  const handleClear = async () => {
    try {
      await clearChatHistory();
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: contractMode 
            ? "Contract Mode enabled! Describe the smart contract you'd like to create, and I'll generate the Solidity code for you."
            : "Chat cleared! What would you like to learn about blockchain today?",
          isNew: true,
        },
      ]);
    } catch (error) {
      console.error('Failed to clear chat:', error);
    }
  };

  const toggleContractMode = () => {
    setContractMode(!contractMode);
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: !contractMode 
          ? "Contract Mode enabled! Describe the smart contract you'd like to create, and I'll generate the Solidity code for you. Try something like: 'Create an ERC-20 token with 1 million supply'"
          : "Contract Mode disabled. I'm back to answering your blockchain questions!",
        isNew: true,
      },
    ]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = contractMode ? [
    "Create an ERC-20 token with 1 million supply",
    "Build a simple NFT contract",
    "Make a payment splitter for 3 addresses",
    "Create a basic voting contract",
  ] : [
    "What is blockchain?",
    "How do crypto wallets work?",
    "What are smart contracts?",
    "Explain DeFi to me",
  ];

  return (
    <div className="min-h-screen pt-20 pb-4 flex flex-col">
      {/* XP Gained notification */}
      {xpGained && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in-down">
          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full shadow-lg shadow-yellow-500/20">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-yellow-400 font-semibold">+{xpGained} XP</span>
          </div>
        </div>
      )}

      {/* Badge earned notification */}
      {newBadges.length > 0 && (
        <div className="fixed top-24 right-4 z-50 animate-bounce-in">
          <div className="p-4 rounded-xl shadow-2xl bg-gradient-to-r from-purple-500 to-pink-500 border border-white/20">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-float">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm opacity-80">Badge Earned!</div>
                <div className="font-bold">{newBadges[0].name}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 flex flex-col">
        {/* Header */}
        <div 
          className={`flex items-center justify-between py-4 transition-all duration-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {contractMode ? (
                <>
                  <Code2 className="w-6 h-6 text-purple-400" />
                  AI Contract Generator
                </>
              ) : (
                <>
                  <Bot className="w-6 h-6 text-purple-400" />
                  AI Blockchain Tutor
                </>
              )}
            </h1>
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Powered by SpoonOS
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Contract Mode Toggle */}
            <button
              onClick={toggleContractMode}
              className={`group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                contractMode
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
                  : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {contractMode ? (
                <>
                  <Code2 className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                  <span className="text-sm font-medium">Contract Mode</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                  <span className="text-sm font-medium">Chat Mode</span>
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="group flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-all duration-300 px-3 py-2 rounded-lg hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 py-4 scroll-smooth">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
                message.isNew ? 'animate-fade-in-up' : ''
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`flex items-start space-x-3 max-w-[80%] ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    message.role === 'user'
                      ? 'bg-purple-600 hover:scale-110'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/30'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 transition-all duration-300 hover:shadow-lg ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white hover:bg-purple-500'
                      : 'bg-slate-800 text-gray-200 hover:bg-slate-700'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <>
                      <div className="markdown-content prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                      {message.contract && (
                        <div className="mt-4 animate-fade-in">
                          <ContractCodeBlock
                            code={message.contract.contract.code}
                            explanation={message.contract.contract.explanation}
                            warnings={message.contract.contract.warnings}
                          />
                          <div className="mt-3 flex items-center space-x-4 text-sm">
                            <span className="flex items-center gap-1 text-green-400">
                              <Zap className="w-3 h-3" />
                              +{message.contract.xp_gained} XP
                            </span>
                            {message.contract.leveled_up && (
                              <span className="text-yellow-400 animate-pulse">Level {message.contract.new_level}! 🎉</span>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <TypingIndicator />
                </div>
              </div>
            </div>
          )}

          {/* Auth prompt when user tries to send without signing in */}
          {showAuthPrompt && !isAuthenticated && (
            <div className="py-4">
              <AuthPrompt
                variant="chat"
                feature="AI Tutor"
                description="Hey there! 👋 To chat with the AI Tutor, please sign in with your Google account. It only takes a second and unlocks personalized learning!"
                icon={MessageSquare}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick questions */}
        {messages.length === 1 && (
          <div 
            className={`py-4 transition-all duration-700 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {contractMode ? 'Try generating:' : 'Try asking:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="group px-4 py-2 bg-slate-800 text-gray-300 rounded-lg hover:bg-purple-500/20 hover:text-purple-300 hover:border-purple-500/50 border border-transparent transition-all duration-300 text-sm hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform duration-300">
                    {question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div 
          className={`py-4 border-t border-slate-700 transition-all duration-500 delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={contractMode ? "Describe your smart contract..." : "Ask me anything about blockchain..."}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                disabled={loading}
              />
              {input.length > 0 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
                  Press Enter ↵
                </div>
              )}
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="group btn-primary p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <Send className={`w-5 h-5 transition-all duration-300 ${loading ? 'opacity-50' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
