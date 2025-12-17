import React, { useState } from 'react';
import { IdeationOutput, AllCritiquesOutput, SolutionScoringOutput } from '../types';
import { CheckCircleIcon, ChevronRightIcon, LightBulbIcon, ChartBarIcon, ArrowPathIcon } from './Icons';
import SpiderChart from './SpiderChart';

interface SolutionCardProps {
    solution: IdeationOutput['solutions'][0];
    isRecommended: boolean;
    onSelect: () => void;
}

const SolutionCard: React.FC<SolutionCardProps> = ({ solution, isRecommended, onSelect }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col ${isRecommended ? 'bg-blue-900/30 border-blue-500' : 'bg-gray-800/60 border-gray-700'}`}>
            {isRecommended && (
                 <div className="text-xs font-bold text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full self-start mb-2">
                    AI Recommended
                </div>
            )}
            <h3 className="font-bold text-xl text-yellow-300">{`Solution ${solution.id}: ${solution.title}`}</h3>
            <p className="text-sm text-gray-400 mt-2 flex-grow">
                {isExpanded ? solution.description : solution.summary}
            </p>
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                    {isExpanded ? 'Read Less' : 'Read More'}
                    <ChevronRightIcon className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </button>
                <button
                    onClick={onSelect}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <CheckCircleIcon className="w-5 h-5"/>
                    Select
                </button>
            </div>
        </div>
    );
};

const AdvantageComparisonChart: React.FC<{
    metrics: SolutionScoringOutput['keyAdvantageMetrics'];
    solutions: IdeationOutput['solutions'];
}> = ({ metrics, solutions }) => {
    const colors = ['#f87171', '#60a5fa', '#4ade80']; // red, blue, green

    return (
        <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700">
            <h3 className="font-bold text-lg text-gray-200 mb-4 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-green-400" /> Tangible Advantages</h3>
            <div className="space-y-6">
                {metrics.map((metric, metricIndex) => {
                    const allValues = [metric.baselineValue, ...metric.solutionValues.map(sv => sv.value)];
                    const maxValue = Math.max(...allValues);

                    const calculatePercentage = (value: number) => (maxValue > 0 ? (value / maxValue) * 100 : 0);

                    const getImprovement = (value: number) => {
                        if (metric.baselineValue === 0 && value > 0) return <span className="font-semibold text-green-400">+∞%</span>;
                        if (metric.baselineValue === 0) return null;
                        
                        const change = ((value - metric.baselineValue) / metric.baselineValue) * 100;
                        const prefix = change > 0 ? '+' : '';
                        const color = (metric.isHigherBetter && change > 0) || (!metric.isHigherBetter && change < 0) ? 'text-green-400' : 'text-red-400';
                        return <span className={`font-semibold ${color}`}>{prefix}{change.toFixed(0)}%</span>;
                    };

                    return (
                        <div key={metricIndex}>
                            <p className="text-sm font-semibold text-gray-300">{metric.metricName} <span className="text-xs text-gray-500">({metric.unit}) {!metric.isHigherBetter && '(Lower is better)'}</span></p>
                            <div className="space-y-3 mt-2 text-xs">
                                {/* Baseline */}
                                <div className="flex items-center gap-2">
                                    <span className="w-20 text-right text-gray-400 font-semibold">Baseline</span>
                                    <div className="flex-grow bg-gray-700 rounded-full h-5">
                                        <div className="bg-gray-500 h-5 rounded-full" style={{ width: `${calculatePercentage(metric.baselineValue)}%` }}></div>
                                    </div>
                                    <span className="w-12 text-left font-mono font-bold">{metric.baselineValue}</span>
                                    <span className="w-12 text-left"></span>
                                </div>

                                {/* Solutions */}
                                {metric.solutionValues.sort((a,b) => a.solutionId - b.solutionId).map(sv => {
                                    const solution = solutions.find(s => s.id === sv.solutionId);
                                    if (!solution) return null;
                                    const color = colors[(solution.id - 1) % colors.length];

                                    return (
                                        <div key={sv.solutionId} className="flex items-center gap-2">
                                            <span className="w-20 text-right text-gray-300 font-semibold truncate" title={solution.title}>{`S${solution.id}`}</span>
                                            <div className="flex-grow bg-gray-700 rounded-full h-5 relative">
                                                <div className="h-5 rounded-full" style={{ width: `${calculatePercentage(sv.value)}%`, backgroundColor: color }}></div>
                                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white font-bold leading-none">{sv.value}</span>
                                            </div>
                                            <span className="w-12 text-left font-mono">{getImprovement(sv.value)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


interface IdeaComparisonPointProps {
    allSolutions: IdeationOutput;
    allCritiques: AllCritiquesOutput;
    solutionScores: SolutionScoringOutput;
    onSelectIdea: (solutionId: number) => void;
    onRegenerateIdeas: () => void;
}

const IdeaComparisonPoint: React.FC<IdeaComparisonPointProps> = ({
    allSolutions,
    solutionScores,
    onSelectIdea,
    onRegenerateIdeas
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border themed-border">
                 <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold main-title text-transparent bg-clip-text">AI-Powered Solution Analysis</h2>
                    <p className="text-gray-400 mt-2 max-w-3xl mx-auto">Compare the AI-generated concepts, review the analysis, and select the best path forward for your venture.</p>
                    <button
                        onClick={onRegenerateIdeas}
                        className="mt-4 flex items-center gap-2 px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors mx-auto"
                    >
                        <ArrowPathIcon className="w-5 h-5"/>
                        Regenerate Ideas
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left Column: Solution Cards */}
                    <div className="lg:col-span-3 space-y-6">
                        {allSolutions.solutions.map(solution => (
                            <SolutionCard
                                key={solution.id}
                                solution={solution}
                                isRecommended={solution.id === solutionScores.recommendedSolutionId}
                                onSelect={() => onSelectIdea(solution.id)}
                            />
                        ))}
                    </div>

                    {/* Right Column: Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700">
                             <h3 className="font-bold text-lg text-gray-200 text-center mb-2">Strategic Scoring</h3>
                             <SpiderChart scoresData={solutionScores.scores} solutions={allSolutions.solutions} />
                        </div>
                        {solutionScores.keyAdvantageMetrics && solutionScores.keyAdvantageMetrics.length > 0 && (
                            <AdvantageComparisonChart metrics={solutionScores.keyAdvantageMetrics} solutions={allSolutions.solutions} />
                        )}
                         <div className="p-4 rounded-xl bg-gray-800/60 border border-gray-700">
                             <h3 className="font-bold text-lg text-gray-200 mb-2 flex items-center gap-2"><LightBulbIcon className="w-5 h-5 text-blue-400" /> AI Recommendation</h3>
                             <p className="text-sm text-gray-400 leading-relaxed">{solutionScores.recommendationText}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IdeaComparisonPoint;