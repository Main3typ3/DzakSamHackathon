import { useState, useEffect } from 'react';
import { Code, Sparkles, FileCode, Loader2, Zap } from 'lucide-react';
import CodeInput from '../components/CodeInput';
import ExplainableCode from '../components/ExplainableCode';
import ExplanationPanel from '../components/ExplanationPanel';
import AuthRequired from '../components/AuthRequired';
import { explainCode, type CodeSection, type Badge } from '../api';

// Animated number component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}</span>;
};

const EXAMPLE_CONTRACTS = [
  {
    name: 'Simple Storage',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`
  },
  {
    name: 'Token Contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "SimpleToken";
    string public symbol = "SIM";
    uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    constructor(uint256 _initialSupply) {
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
    }
    
    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
        return true;
    }
}`
  },
  {
    name: 'Voting Contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint256 voteCount;
    }
    
    mapping(address => bool) public hasVoted;
    Proposal[] public proposals;
    
    function createProposal(string memory _description) public {
        proposals.push(Proposal({
            description: _description,
            voteCount: 0
        }));
    }
    
    function vote(uint256 _proposalId) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(_proposalId < proposals.length, "Invalid proposal");
        
        hasVoted[msg.sender] = true;
        proposals[_proposalId].voteCount += 1;
    }
}`
  }
];

function CodeExplainerContent() {
  const [code, setCode] = useState('');
  const [sections, setSections] = useState<CodeSection[]>([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<CodeSection | null>(null);
  const [walkthroughMode, setWalkthroughMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newBadges, setNewBadges] = useState<Badge[]>([]);
  const [xpGained, setXpGained] = useState(0);
  const [hasExplained, setHasExplained] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setHasExplained(false);

    try {
      const result = await explainCode(code);
      
      setSections(result.sections);
      setSummary(result.summary);
      setXpGained(result.xp_gained);
      setHasExplained(true);

      if (result.new_badges && result.new_badges.length > 0) {
        setNewBadges(result.new_badges);
        setTimeout(() => setNewBadges([]), 5000);
      }
    } catch (error) {
      console.error('Failed to explain code:', error);
      alert('Failed to explain code. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleLineClick = (section: CodeSection) => {
    setSelectedSection(section);
    setWalkthroughMode(false);
  };

  const handleExampleSelect = (example: typeof EXAMPLE_CONTRACTS[0]) => {
    setCode(example.code);
    setSections([]);
    setSummary('');
    setSelectedSection(null);
    setWalkthroughMode(false);
    setHasExplained(false);
  };

  const startWalkthrough = () => {
    if (sections.length === 0) return;
    setWalkthroughMode(true);
    setCurrentStep(0);
    setSelectedSection(sections[0]);
  };

  const nextStep = () => {
    if (currentStep < sections.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setSelectedSection(sections[newStep]);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setSelectedSection(sections[newStep]);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-500"></div>
      </div>

      {/* XP Popup */}
      {xpGained > 0 && hasExplained && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg shadow-green-500/30">
            <Zap className="w-5 h-5" />
            <span>+<AnimatedNumber value={xpGained} /> XP!</span>
          </div>
        </div>
      )}

      {/* Badge notification */}
      {newBadges.length > 0 && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="p-4 rounded-xl shadow-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-wiggle">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-white/80">Badge Earned!</p>
                <p className="font-bold">{newBadges[0].name}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header with animation */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/30 animate-glow">
              <Code className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Smart Contract Explainer</h1>
              <p className="text-gray-400">Learn by understanding code line-by-line</p>
            </div>
          </div>
        </div>

        {!hasExplained ? (
          <div className="space-y-6">
            {/* Code input section */}
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl border border-purple-500/20 p-6 animate-fade-in-up animation-delay-100 hover:border-purple-500/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-purple-400 animate-pulse-slow" />
                  <span>Paste Your Contract</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <select
                    onChange={(e) => {
                      const example = EXAMPLE_CONTRACTS[parseInt(e.target.value)];
                      if (example) handleExampleSelect(example);
                    }}
                    className="bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500 transition-all duration-300 hover:bg-slate-600"
                    defaultValue=""
                  >
                    <option value="" disabled>Load Example</option>
                    {EXAMPLE_CONTRACTS.map((example, idx) => (
                      <option key={idx} value={idx}>{example.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="code-glow rounded-lg overflow-hidden">
                <CodeInput code={code} onChange={setCode} />
              </div>

              <button
                onClick={handleExplain}
                disabled={!code.trim() || loading}
                className="mt-4 btn-primary w-full py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 group-hover:animate-wiggle" />
                    <span>Explain This Contract</span>
                  </>
                )}
              </button>
            </div>

            {/* How it works section */}
            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 p-6 animate-fade-in-up animation-delay-200">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                <span className="text-2xl">✨</span>
                <span>How It Works</span>
              </h3>
              <ul className="space-y-3 text-gray-300">
                {[
                  'Paste your Solidity code or choose an example contract',
                  'Click "Explain This Contract" to get AI-powered explanations',
                  'Click on any section to see detailed explanations',
                  'Use "Explain All" for a guided walkthrough of the entire contract',
                  'Earn 30 XP for each contract you explain!'
                ].map((text, idx) => (
                  <li 
                    key={idx}
                    className="flex items-start space-x-2 animate-fade-in-up"
                    style={{ animationDelay: `${300 + idx * 100}ms` }}
                  >
                    <span className="w-6 h-6 flex-shrink-0 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">
                      {idx + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Contract overview with animation */}
            {summary && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6 animate-fade-in-up">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400 animate-pulse-slow" />
                  <span>Contract Overview</span>
                </h2>
                <p className="text-gray-300 leading-relaxed">{summary}</p>
                {xpGained > 0 && (
                  <div className="mt-4 inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-semibold animate-bounce-in animation-delay-300">
                    <Zap className="w-4 h-4" />
                    <span>+{xpGained} XP earned!</span>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 animate-fade-in-up animation-delay-100">
                <div className="code-glow rounded-xl overflow-hidden">
                  <ExplainableCode
                    code={code}
                    sections={sections}
                    selectedSection={selectedSection}
                    onSectionClick={handleLineClick}
                    walkthroughMode={walkthroughMode}
                  />
                </div>
                
                {sections.length > 0 && (
                  <div className="mt-4 flex items-center space-x-3 animate-fade-in-up animation-delay-200">
                    <button
                      onClick={startWalkthrough}
                      className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2 group relative overflow-hidden"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                      <Sparkles className="w-5 h-5 group-hover:animate-wiggle" />
                      <span>Explain All</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setSections([]);
                        setSummary('');
                        setHasExplained(false);
                        setSelectedSection(null);
                        setWalkthroughMode(false);
                      }}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all duration-300 hover:scale-105"
                    >
                      Explain Another
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 animate-slide-in-right animation-delay-200">
                <ExplanationPanel
                  section={selectedSection}
                  walkthroughMode={walkthroughMode}
                  currentStep={currentStep}
                  totalSteps={sections.length}
                  onNext={nextStep}
                  onPrev={prevStep}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Export wrapped component with auth requirement
export default function CodeExplainer() {
  return (
    <AuthRequired feature="the Smart Contract Explainer">
      <CodeExplainerContent />
    </AuthRequired>
  );
}
