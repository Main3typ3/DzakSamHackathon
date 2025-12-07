interface CodeInputProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeInput({ code, onChange }: CodeInputProps) {
  return (
    <div className="relative">
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder="// Paste your Solidity smart contract code here...
// Example:
// pragma solidity ^0.8.0;
// 
// contract MyContract {
//     // Your contract code
// }"
        className="w-full h-96 bg-slate-900 border border-purple-500/30 rounded-lg px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors resize-none"
        spellCheck={false}
      />
    </div>
  );
}
