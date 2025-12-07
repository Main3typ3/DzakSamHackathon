import { useState } from 'react';
import { Code, Sparkles, FileCode, Loader2 } from 'lucide-react';
import CodeInput from '../components/CodeInput';
import ExplainableCode from '../components/ExplainableCode';
import ExplanationPanel from '../components/ExplanationPanel';
import { explainCode, type CodeSection, type Badge } from '../api';

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

export default function CodeExplainer() {
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
    <div className="min-h-screen pt-20 pb-8">
      {newBadges.length > 0 && (
        <div className="fixed top-24 right-4 z-50 p-4 rounded-lg shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 animate-float">
          <div className="flex items-center space-x-2 text-white">
            <Sparkles className="w-5 h-5" />
            <span>Badge Earned: {newBadges[0].name}!</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
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
            <div className="bg-slate-800 rounded-xl border border-purple-500/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  <span>Paste Your Contract</span>
                </h2>
                
                <div className="flex items-center space-x-3">
                  <select
                    onChange={(e) => {
                      const example = EXAMPLE_CONTRACTS[parseInt(e.target.value)];
                      if (example) handleExampleSelect(example);
                    }}
                    className="bg-slate-700 border border-purple-500/30 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Load Example</option>
                    {EXAMPLE_CONTRACTS.map((example, idx) => (
                      <option key={idx} value={idx}>{example.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <CodeInput code={code} onChange={setCode} />

              <button
                onClick={handleExplain}
                disabled={!code.trim() || loading}
                className="mt-4 btn-primary w-full py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing Code...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Explain This Contract</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl border border-purple-500/20 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Paste your Solidity code or choose an example contract</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Click "Explain This Contract" to get AI-powered explanations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Click on any section to see detailed explanations</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Use "Explain All" for a guided walkthrough of the entire contract</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-purple-400">•</span>
                  <span>Earn 30 XP for each contract you explain!</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {summary && (
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-6">
                <h2 className="text-xl font-semibold text-white mb-3 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Contract Overview</span>
                </h2>
                <p className="text-gray-300">{summary}</p>
                {xpGained > 0 && (
                  <div className="mt-3 inline-block bg-purple-600/30 text-purple-300 px-3 py-1 rounded-full text-sm">
                    +{xpGained} XP earned!
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ExplainableCode
                  code={code}
                  sections={sections}
                  selectedSection={selectedSection}
                  onSectionClick={handleLineClick}
                  walkthroughMode={walkthroughMode}
                />
                
                {sections.length > 0 && (
                  <div className="mt-4 flex items-center space-x-3">
                    <button
                      onClick={startWalkthrough}
                      className="btn-primary px-6 py-3 rounded-lg flex items-center space-x-2"
                    >
                      <Sparkles className="w-5 h-5" />
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
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Explain Another
                    </button>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
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
