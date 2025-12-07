import { ChevronLeft, ChevronRight, BookOpen, Code } from 'lucide-react';
import { type CodeSection } from '../api';

interface ExplanationPanelProps {
  section: CodeSection | null;
  walkthroughMode: boolean;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
}

export default function ExplanationPanel({
  section,
  walkthroughMode,
  currentStep,
  totalSteps,
  onNext,
  onPrev
}: ExplanationPanelProps) {
  if (!section) {
    return (
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-fit sticky top-24">
        <div className="flex items-center justify-center flex-col space-y-4 text-center py-12">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center animate-pulse-slow">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">No section selected</p>
            <p className="text-gray-500 text-xs">Click on any section of code to see its explanation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 h-fit sticky top-24 animate-fade-in-up">
      {walkthroughMode && (
        <div className="mb-4 pb-4 border-b border-purple-500/20">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              <span>Walkthrough Mode</span>
            </span>
            <span className="bg-purple-500/20 px-2 py-0.5 rounded text-purple-300 text-xs">{currentStep + 1} of {totalSteps}</span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 flex-1 rounded transition-all duration-500 ${
                  idx === currentStep
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : idx < currentStep
                    ? 'bg-purple-700'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20">
            <Code className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">{section.title}</h3>
            <p className="text-xs text-gray-500">
              Lines {section.start_line}
              {section.end_line !== section.start_line && `-${section.end_line}`}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
            {section.code}
          </pre>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-lg p-4 border border-purple-500/20">
          <h4 className="text-sm font-semibold text-purple-300 mb-2 flex items-center space-x-2">
            <span>💡</span>
            <span>Explanation</span>
          </h4>
          <p className="text-gray-300 text-sm leading-relaxed">{section.explanation}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2 py-1 rounded">{section.type.replace('_', ' ')}</span>
        </div>
      </div>

      {walkthroughMode && (
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-between space-x-3">
          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <button
            onClick={onNext}
            disabled={currentStep === totalSteps - 1}
            className="flex items-center space-x-2 px-4 py-2 btn-primary rounded-lg disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span>Next</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
