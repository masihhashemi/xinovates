import React from 'react';
import { ProblemStatementOutput } from '../types';
import { CheckCircleIcon, LightBulbIcon } from './Icons';

interface ChallengeSelectionPointProps {
    suggestedChallenges: ProblemStatementOutput[];
    onSelectChallenge: (challenge: ProblemStatementOutput) => void;
}

const ChallengeSelectionPoint: React.FC<ChallengeSelectionPointProps> = ({
    suggestedChallenges,
    onSelectChallenge,
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border themed-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold main-title text-transparent bg-clip-text">Select a Challenge for Your Solution</h2>
                    <p className="text-gray-400 mt-2 max-w-3xl mx-auto">
                        The Market-Fit Analyst has identified the following potential problems that your solution could address. Choose the one that represents the best market opportunity to build your venture plan around.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {suggestedChallenges.map((challenge, index) => (
                        <div key={index} className="bg-gray-800/60 p-6 rounded-lg border themed-border flex flex-col">
                            <h3 className="font-bold text-lg text-blue-300 mb-2">
                                {challenge.problemStatement}
                            </h3>
                            <p className="text-sm text-gray-400 flex-grow mb-4">
                                {challenge.context}
                            </p>
                            <button
                                onClick={() => onSelectChallenge(challenge)}
                                className="w-full mt-auto px-6 py-3 primary-button text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                            >
                                <CheckCircleIcon className="w-5 h-5"/>
                                Select This Challenge
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChallengeSelectionPoint;