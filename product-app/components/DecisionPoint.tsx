

import React from 'react';
import { ProblemStatementOutput, CustomerPersonaOutput, SolutionSelectionOutput, AllCritiquesOutput } from '../types';
import { LightBulbIcon, QuestionMarkCircleIcon, ThumbsDownIcon, ThumbsUpIcon, UserCircleIcon, CheckCircleIcon, ArrowPathIcon, SparklesIcon, DevilsAdvocateAvatar } from './Icons';
import Spinner from './Spinner';

interface DecisionPointProps {
    problemStatement: ProblemStatementOutput | null;
    customerPersona: CustomerPersonaOutput | null;
    selectedSolution: SolutionSelectionOutput | null;
    allCritiques: AllCritiquesOutput | null;
    onApprove: () => void;
    onEnhance: () => void;
    onCancelEnhancement: () => void;
    onRestart: () => void;
    isGenerating: boolean;
    isEnhancing: boolean;
    enhancementProgress: string[];
    error: string | null;
}

const InfoCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-gray-800/60 p-4 rounded-lg flex-grow">
        <h4 className="font-semibold text-base mb-3 text-gray-300 flex items-center gap-2">
            {icon} {title}
        </h4>
        <div className="text-sm text-gray-400 space-y-2">{children}</div>
    </div>
);

const DecisionPoint: React.FC<DecisionPointProps> = ({
    problemStatement,
    customerPersona,
    selectedSolution,
    allCritiques,
    onApprove,
    onEnhance,
    onCancelEnhancement,
    onRestart,
    isGenerating,
    isEnhancing,
    enhancementProgress,
    error,
}) => {
    if (!problemStatement || !customerPersona || !selectedSolution || !allCritiques) {
        return null;
    }

    const critique = allCritiques.find(c => c.solutionId === selectedSolution.selectedSolutionId);
    const devilsAdvocateCritique = critique?.devilsAdvocate;

    const disabled = isGenerating || isEnhancing;

    return (
        <div className="w-full max-w-5xl mx-auto my-8 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border themed-border">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold main-title text-transparent bg-clip-text">Refinement & Decision Stage</h2>
                    <p className="text-gray-400 mt-1">Review the selected solution and the Devil's Advocate critique. You can enhance the solution or proceed.</p>
                </div>
                
                <div className="space-y-6">
                    {/* Solution and Critique */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <InfoCard title="Selected Solution" icon={<LightBulbIcon className="w-5 h-5 text-yellow-400" />}>
                            <p className="font-bold text-lg text-yellow-300">{selectedSolution.solutionTitle}</p>
                            <p className="text-xs mt-2 mb-4 italic">{selectedSolution.solutionDescription}</p>
                            <p className="text-xs text-gray-500">Justification: {selectedSolution.justification}</p>
                        </InfoCard>

                        {devilsAdvocateCritique && (
                             <InfoCard title="Devil's Advocate Critique" icon={<DevilsAdvocateAvatar className="w-5 h-5 text-red-400" />}>
                                <div>
                                    <h5 className="font-semibold text-sm text-red-400 flex items-center gap-1 mb-2">Weaknesses</h5>
                                    <ul className="list-disc list-inside text-xs space-y-1">
                                        {devilsAdvocateCritique.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="mt-3">
                                    <h5 className="font-semibold text-sm text-red-400 flex items-center gap-1 mb-2">Tough Questions</h5>
                                    <ul className="list-disc list-inside text-xs space-y-1">
                                        {devilsAdvocateCritique.questions.map((item, i) => <li key={i}>{item}</li>)}
                                    </ul>
                                </div>
                            </InfoCard>
                        )}
                    </div>
                    
                    {/* Enhancement History */}
                    {selectedSolution.history && selectedSolution.history.length > 0 && (
                        <div>
                             <h4 className="text-base font-semibold text-gray-300 mb-2">Enhancement History</h4>
                             <div className="space-y-2 border-l-2 border-gray-700 pl-4">
                                {selectedSolution.history.map((item, index) => (
                                    <div key={index} className="relative pl-4">
                                        <div className="absolute -left-5 top-1 w-2 h-2 rounded-full bg-gray-600"></div>
                                        <p className="text-sm font-semibold text-gray-400">Version {index + 1}: {item.title}</p>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Actions */}
                    <div className="mt-8 pt-6 border-t themed-border text-center">
                         <h3 className="text-xl font-semibold text-white">Choose your next step</h3>
                         <p className="text-gray-400 mt-2 mb-6">Address the critique by enhancing the solution with AI, or approve the current version to generate the full venture plan.</p>
                        <div className="flex flex-wrap justify-center items-center gap-4">
                             <button
                                onClick={onRestart}
                                disabled={disabled}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                <ArrowPathIcon className="w-5 h-5"/>
                                Start Over
                            </button>
                             <button
                                onClick={onEnhance}
                                disabled={disabled}
                                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                {isEnhancing ? <Spinner/> : <SparklesIcon className="w-5 h-5"/>}
                                {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                            </button>
                            {isEnhancing && (
                                <button
                                    onClick={onCancelEnhancement}
                                    className="px-4 py-3 bg-red-800/80 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
                                    aria-label="Cancel enhancement"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                onClick={onApprove}
                                disabled={disabled}
                                className="px-8 py-4 primary-button text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg"
                            >
                                {isGenerating ? <Spinner /> : (
                                    <>
                                        <CheckCircleIcon className="w-6 h-6 mr-2" />
                                        Accept & Generate Plan
                                    </>
                                )}
                            </button>
                        </div>
                        {(isEnhancing && enhancementProgress.length > 0) && (
                            <div className="mt-4 text-left max-w-md mx-auto bg-gray-900 p-3 rounded-lg text-xs text-gray-400">
                                <ul className="list-disc list-inside">
                                    {enhancementProgress.map((msg, i) => <li key={i}>{msg}</li>)}
                                </ul>
                            </div>
                        )}
                        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DecisionPoint;