import { useState } from 'react';
import { Copy, Check, AlertTriangle } from 'lucide-react';

interface ContractCodeBlockProps {
  code: string;
  explanation: string;
  warnings: string[];
}

export default function ContractCodeBlock({ code, explanation, warnings }: ContractCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy code:', err);
        // Fallback: create a text area and copy from it
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (fallbackErr) {
          console.error('Fallback copy failed:', fallbackErr);
        }
        document.body.removeChild(textArea);
      });
  };

  return (
    <div className="space-y-4">
      {/* Code Block */}
      <div className="relative">
        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
            <span className="text-sm text-gray-400 font-mono">Solidity Contract</span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-gray-300 font-mono whitespace-pre">{code}</code>
          </pre>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-sm font-semibold text-purple-400 mb-2">What this contract does:</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{explanation}</p>
      </div>

      {/* Security Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-600/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-yellow-500 mb-2">Security Considerations:</h3>
              <ul className="space-y-1 text-sm text-yellow-200/90">
                {warnings.map((warning, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
