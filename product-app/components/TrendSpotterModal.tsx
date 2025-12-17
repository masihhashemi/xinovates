
import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon, MagnifyingGlassIcon, TargetIcon } from './Icons';
import { TARGET_MARKETS } from '../constants';
import Spinner from './Spinner';

interface TrendSpotterModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMarket: string;
    onSelectChallenge: (challenge: string) => void;
    onGenerate: (market: string) => Promise<string[]>;
}

const TrendSpotterModal: React.FC<TrendSpotterModalProps> = ({ isOpen, onClose, initialMarket, onSelectChallenge, onGenerate }) => {
    const [selectedMarket, setSelectedMarket] = useState(initialMarket);
    const [challenges, setChallenges] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setChallenges(null);
        try {
            const results = await onGenerate(selectedMarket);
            setChallenges(results);
        } catch (err) {
            setError("Failed to identify trends. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col animate-fade-in overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-5 border-b border-gray-700 flex justify-between items-center bg-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-500/20 border border-yellow-500/30">
                           <SparklesIcon className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">Trend Spotter</h2>
                            <p className="text-xs text-gray-400">Discover urgent market opportunities with AI.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </header>

                <div className="p-6 flex-grow bg-black/20 text-gray-300">
                    
                    {/* Selection Area */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Target Market to Analyze</label>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <TargetIcon className="w-5 h-5 text-gray-500" />
                                </div>
                                <select
                                    value={selectedMarket}
                                    onChange={(e) => setSelectedMarket(e.target.value)}
                                    className="w-full pl-10 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none text-gray-200 appearance-none"
                                    disabled={isLoading}
                                >
                                    {TARGET_MARKETS.map(market => (
                                        <option key={market.value} value={market.value}>{market.label}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                onClick={handleGenerate}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isLoading ? <Spinner /> : <MagnifyingGlassIcon className="w-5 h-5" />}
                                {isLoading ? 'Scanning...' : 'Spot Opportunities'}
                            </button>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm text-center mb-4">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-8 space-y-3">
                            <Spinner />
                            <p className="text-sm text-gray-400 animate-pulse">Analyzing market signals and emerging needs in {TARGET_MARKETS.find(m => m.value === selectedMarket)?.label}...</p>
                        </div>
                    )}

                    {/* Results List */}
                    {challenges && !isLoading && (
                        <div className="space-y-3 animate-fade-in-up">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">High-Priority Innovation Challenges</h3>
                            {challenges.map((challenge, index) => (
                                <button
                                    key={index}
                                    onClick={() => onSelectChallenge(challenge)}
                                    className="w-full text-left p-4 bg-gray-700/40 hover:bg-blue-900/20 border border-gray-600 hover:border-blue-500/50 rounded-xl transition-all duration-200 group"
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-xs font-bold text-gray-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm text-gray-200 group-hover:text-white">{challenge}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {!challenges && !isLoading && !error && (
                        <div className="text-center py-12 text-gray-500 text-sm">
                            Select a market and click "Spot Opportunities" to see what the AI discovers.
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TrendSpotterModal;
