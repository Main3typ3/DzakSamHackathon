import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BookOpen, MessageSquare, Trophy, Sparkles, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

// Animated counter hook
const useAnimatedCounter = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration, start]);

  return { count, ref };
};

// Floating particles component
const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-purple-500/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        >
          <div className="w-full h-full animate-float opacity-50" />
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    });
  };

  const features = [
    {
      icon: Sparkles,
      title: 'Adventure Mode',
      description: 'Learn through an interactive story with AI Game Master guidance',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn blockchain concepts through engaging, bite-sized lessons',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: MessageSquare,
      title: 'AI Tutor',
      description: 'Get instant answers from our SpoonOS-powered blockchain expert',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Gain XP, level up, and unlock achievement badges',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const stats = [
    { label: 'Learning Modules', value: 6 },
    { label: 'Interactive Quests', value: 25 },
    { label: 'Badges to Earn', value: 12 },
  ];

  return (
    <div className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <FloatingParticles />
        
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` 
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl transition-transform duration-1000 ease-out"
          style={{ 
            transform: `translate(${-mousePosition.x * 2}px, ${-mousePosition.y * 2}px)` 
          }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Animated badge */}
          <div 
            className={`inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8 transition-all duration-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-purple-300 text-sm">Powered by SpoonOS</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Animated heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span 
              className={`inline-block text-white transition-all duration-700 delay-100 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Master
            </span>{' '}
            <span 
              className={`inline-block gradient-text-animated transition-all duration-700 delay-200 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Blockchain
            </span>
            <br />
            <span 
              className={`inline-block text-white transition-all duration-700 delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              The Fun Way
            </span>
          </h1>

          <p 
            className={`text-xl text-gray-400 mb-10 max-w-2xl mx-auto transition-all duration-700 delay-400 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            ChainQuest Academy transforms blockchain education into an adventure.
            Learn about crypto, wallets, smart contracts, and DeFi through
            interactive lessons and AI-powered guidance.
          </p>

          {/* Animated buttons */}
          <div 
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              to="/adventures"
              className="group btn-primary text-lg px-8 py-4 flex items-center space-x-2 btn-animated shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
            >
              <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
              <span>Start Adventure</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/learn"
              className="group px-8 py-4 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Browse Lessons</span>
            </Link>
            <Link
              to="/chat"
              className="group px-8 py-4 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <MessageSquare className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span>Ask AI Tutor</span>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div 
            className={`mt-16 transition-all duration-700 delay-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <ChevronDown className="w-6 h-6 text-purple-400 mx-auto animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 border-y border-purple-500/10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const { count, ref } = useAnimatedCounter(stat.value);
              return (
                <div 
                  key={index} 
                  ref={ref}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2 tabular-nums">
                    {count}+
                  </div>
                  <div className="text-gray-400 text-sm md:text-base">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">
            Why Learn With <span className="gradient-text-animated">ChainQuest</span>?
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Experience blockchain education like never before with our innovative learning platform
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-500 card-hover animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg`}>
                  <feature.icon className="w-6 h-6 text-white transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 transition-colors duration-300 group-hover:text-purple-300">{feature.title}</h3>
                <p className="text-gray-400 text-sm transition-colors duration-300 group-hover:text-gray-300">{feature.description}</p>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">What You'll Learn</h2>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              'Blockchain fundamentals and how it works',
              'Setting up and securing crypto wallets',
              'Understanding smart contracts',
              'Exploring DeFi protocols and strategies',
              'NFTs and digital ownership',
              'Web3 development concepts',
            ].map((item, index) => (
              <div 
                key={index} 
                className="group flex items-center space-x-3 p-4 bg-slate-800/30 rounded-lg border border-transparent hover:border-purple-500/30 transition-all duration-300 hover:bg-slate-800/50 hover:translate-x-2 cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-2 h-2 bg-purple-500 rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-pink-500" />
                <span className="text-gray-300 transition-colors duration-300 group-hover:text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-10 border border-purple-500/30 overflow-hidden group hover:border-purple-400/50 transition-all duration-500">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Quest?</h2>
              <p className="text-gray-400 mb-8">
                Start earning XP and unlocking badges as you master blockchain technology.
              </p>
              <Link
                to="/learn"
                className="group/btn btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2 btn-animated shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
