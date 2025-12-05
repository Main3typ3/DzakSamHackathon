import { Link } from 'react-router-dom';
import { BookOpen, Wallet, Code, BarChart3, CheckCircle } from 'lucide-react';
import type { Module } from '../api';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  cube: BookOpen,
  wallet: Wallet,
  code: Code,
  chart: BarChart3,
};

interface ModuleCardProps {
  module: Module;
}

export default function ModuleCard({ module }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || BookOpen;
  const progress = module.progress || { completed: 0, total: 0, percentage: 0 };

  return (
    <Link
      to={`/module/${module.id}`}
      className="group block"
    >
      <div className="relative bg-slate-800/50 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 card-glow hover:scale-[1.02]">
        <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 rounded-2xl`} />
        
        <div className="relative">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className="w-7 h-7 text-white" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{module.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{module.description}</p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">{module.lessons.length} lessons</span>
            {progress.percentage > 0 && (
              <div className="flex items-center space-x-2">
                {progress.percentage === 100 ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : null}
                <span className="text-purple-400">{progress.percentage}% complete</span>
              </div>
            )}
          </div>

          <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${module.color} transition-all duration-500`}
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
