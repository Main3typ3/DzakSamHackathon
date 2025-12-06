import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BookOpen, MessageSquare, Trophy, Sparkles } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: 'Adventure Mode',
      description: 'Learn through an interactive story with AI Game Master guidance',
    },
    {
      icon: BookOpen,
      title: 'Interactive Lessons',
      description: 'Learn blockchain concepts through engaging, bite-sized lessons',
    },
    {
      icon: MessageSquare,
      title: 'AI Tutor',
      description: 'Get instant answers from our SpoonOS-powered blockchain expert',
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Gain XP, level up, and unlock achievement badges',
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Powered by SpoonOS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Master</span>{' '}
            <span className="text-gradient">Blockchain</span>
            <br />
            <span className="text-white">The Fun Way</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            ChainQuest Academy transforms blockchain education into an adventure.
            Learn about crypto, wallets, smart contracts, and DeFi through
            interactive lessons and AI-powered guidance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/adventures"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Adventure</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/learn"
              className="px-8 py-4 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all flex items-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>Browse Lessons</span>
            </Link>
            <Link
              to="/chat"
              className="px-8 py-4 border border-purple-500/50 text-purple-300 rounded-lg hover:bg-purple-500/10 transition-all flex items-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Ask AI Tutor</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Why Learn With <span className="text-gradient">ChainQuest</span>?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
              <div key={index} className="flex items-center space-x-3 p-4 bg-slate-800/30 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-2xl p-10 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Begin Your Quest?</h2>
            <p className="text-gray-400 mb-8">
              Start earning XP and unlocking badges as you master blockchain technology.
            </p>
            <Link
              to="/learn"
              className="btn-primary text-lg px-10 py-4 inline-flex items-center space-x-2"
            >
              <span>Start Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
