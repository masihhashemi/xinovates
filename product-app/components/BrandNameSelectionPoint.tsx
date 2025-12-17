import React, { useState } from 'react';
import { CheckCircleIcon } from './Icons';

interface BrandNameSelectionPointProps {
    suggestedNames: string[];
    onSelect: (name: string) => void;
}

const BrandNameSelectionPoint: React.FC<BrandNameSelectionPointProps> = ({ suggestedNames, onSelect }) => {
    const [customName, setCustomName] = useState('');

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customName.trim()) {
            onSelect(customName.trim());
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-8 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border themed-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold main-title text-transparent bg-clip-text">Name Your Venture</h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                        Based on your solution, here are a few brand names suggested by our AI. Choose one, or enter your own.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {suggestedNames.slice(0, 3).map((name, index) => ( // Show top 3 suggestions
                        <button
                            key={index}
                            onClick={() => onSelect(name)}
                            className="p-4 bg-gray-800/60 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700/80 transition-all duration-300 transform hover:-translate-y-1 text-white font-semibold text-lg"
                        >
                            {name}
                        </button>
                    ))}
                </div>

                <div className="border-t themed-border pt-6">
                    <h3 className="text-center text-lg font-semibold text-gray-300 mb-4">Or, enter your own brand name:</h3>
                    <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
                        <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="e.g., InnovateX"
                            className="flex-grow w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={!customName.trim()}
                            className="w-full sm:w-auto px-6 py-3 primary-button text-white font-bold rounded-lg disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                        >
                            <CheckCircleIcon className="w-5 h-5"/>
                            Use this Name
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default BrandNameSelectionPoint;