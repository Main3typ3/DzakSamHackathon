import { useEffect, useRef } from 'react';
import { type CodeSection } from '../api';

interface ExplainableCodeProps {
  code: string;
  sections: CodeSection[];
  selectedSection: CodeSection | null;
  onSectionClick: (section: CodeSection) => void;
  walkthroughMode: boolean;
}

export default function ExplainableCode({
  code,
  sections,
  selectedSection,
  onSectionClick,
  walkthroughMode
}: ExplainableCodeProps) {
  const codeRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (walkthroughMode && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSection, walkthroughMode]);

  const lines = code.split('\n');

  const getSectionForLine = (lineNum: number): CodeSection | undefined => {
    return sections.find(
      (section) => lineNum >= section.start_line && lineNum <= section.end_line
    );
  };

  const isLineInSelectedSection = (lineNum: number): boolean => {
    if (!selectedSection) return false;
    return lineNum >= selectedSection.start_line && lineNum <= selectedSection.end_line;
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-purple-500/20 overflow-hidden transition-all duration-300 hover:border-purple-500/30">
      <div className="bg-slate-800 border-b border-purple-500/20 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono">contract.sol</span>
        </div>
        <span className="text-gray-500 text-xs">{lines.length} lines</span>
      </div>
      
      <div ref={codeRef} className="overflow-x-auto max-h-[500px]">
        <div className="font-mono text-sm">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const section = getSectionForLine(lineNum);
            const isSelected = isLineInSelectedSection(lineNum);
            const isFirstLineOfSection = section && lineNum === section.start_line;

            return (
              <div
                key={idx}
                ref={isSelected && isFirstLineOfSection ? selectedRef : null}
                className={`flex hover:bg-slate-800/50 transition-all duration-200 group ${
                  isSelected ? 'bg-purple-900/30 border-l-2 border-purple-500 line-highlight' : ''
                } ${section ? 'cursor-pointer' : ''}`}
                onClick={() => section && onSectionClick(section)}
              >
                <div className="w-12 flex-shrink-0 text-right pr-3 py-1 text-gray-600 select-none border-r border-slate-700">
                  {lineNum}
                </div>
                <div className="flex-1 px-4 py-1 relative">
                  <pre className="text-gray-300 whitespace-pre">
                    {line || ' '}
                  </pre>
                  {section && isFirstLineOfSection && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-125 shadow-lg shadow-purple-500/50" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
