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
    <div className="bg-slate-900 rounded-xl border border-purple-500/20 overflow-hidden">
      <div className="bg-slate-800 border-b border-purple-500/20 px-4 py-2 flex items-center justify-between">
        <span className="text-gray-400 text-sm font-mono">contract.sol</span>
        <span className="text-gray-500 text-xs">{lines.length} lines</span>
      </div>
      
      <div ref={codeRef} className="overflow-x-auto">
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
                className={`flex hover:bg-slate-800/50 transition-colors group ${
                  isSelected ? 'bg-purple-900/30 border-l-2 border-purple-500' : ''
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
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
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
