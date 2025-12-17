
import React from 'react';
import { XMarkIcon, QuestionMarkCircleIcon } from './Icons';
import { AGENT_DEFINITIONS } from '../constants';


interface HelpModalProps {
    onClose: () => void;
}

const sampleChallenges = [
    "Develop a sustainable solution for urban food waste.",
    "Create a new digital learning tool for remote students.",
    "Design a product that helps elderly people live more independently at home.",
    "Invent a new form of personal transportation for crowded cities.",
];

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center p-1 bg-gray-900 border border-gray-600">
                           <QuestionMarkCircleIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">How to use Xinovates</h2>
                            <p className="text-sm text-gray-400">A guide to the Double Diamond venture creation process.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow bg-black/20 text-gray-300 space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-2">The Double Diamond Process</h3>
                        <p className="text-sm text-gray-400 mb-3">This framework follows the four phases of the Double Diamond design thinking model to ensure we are solving the right problem before building the right solution.</p>
                        <ol className="list-decimal list-inside space-y-2 text-gray-300">
                            <li><strong className="text-white">Define the Challenge:</strong> Enter a problem you want to solve or an area to innovate in.</li>
                            <li><strong className="text-white">Start Innovation:</strong> The system will first run the "Problem Diamond" (Discover & Define) to understand the user and define a core problem statement.</li>
                            <li><strong className="text-white">Solution Development:</strong> Next, the "Solution Diamond" (Develop & Deliver) will brainstorm solutions for the defined problem, select the best one, and build it out into a full venture plan.</li>
                            <li><strong className="text-white">Review the Final Report:</strong> Once all phases are complete, a comprehensive report appears. You can review all generated canvases and download a full PDF report or an investor-ready Pitch Deck.</li>
                        </ol>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-white mb-2">Strategic Directives</h3>
                        <p className="text-sm text-gray-400 mb-3">Guide the overall "mindset" of the AI agents to prioritize specific outcomes:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            <li><strong className="text-white">Balanced Approach:</strong> The default setting. Considers all factors like innovation, market size, and feasibility relatively equally.</li>
                             <li><strong className="text-white">Time to Market:</strong> Prioritizes speed and simplicity. The agents will focus on ideas that can be launched quickly as a Minimum Viable Product (MVP).</li>
                             <li><strong className="text-white">Unique Value Proposition:</strong> Prioritizes innovation and defensibility. The agents will favor more radical ideas and novel technologies to create a strong competitive moat.</li>
                             <li><strong className="text-white">Capital Efficiency:</strong> Prioritizes a lean, bootstrap-friendly approach. The agents will focus on ideas that require minimal upfront investment and can generate revenue early.</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg text-white mb-2">The Agent Team</h3>
                        <p className="text-sm text-gray-400 mb-3">The simulation consists of the following expert agents organized by phase:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {AGENT_DEFINITIONS.map((agent) => (
                                <li key={agent.role}><strong className="text-white">{agent.name}:</strong> {agent.description}</li>
                            ))}
                        </ul>
                    </div>

                     <div>
                        <h3 className="font-semibold text-lg text-white mb-2">Sample Challenges</h3>
                        <p className="text-sm text-gray-400 mb-3">Not sure where to start? Try one of these:</p>
                        <ul className="list-disc list-inside space-y-2 text-gray-300">
                            {sampleChallenges.map((challenge, index) => (
                                <li key={index}>"{challenge}"</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
