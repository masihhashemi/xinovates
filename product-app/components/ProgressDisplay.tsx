
import React from 'react';
import { Agent, ModelMode } from '../types';
import Spinner from './Spinner';
import ProgressBar from './ProgressBar';

interface ProgressDisplayProps {
    activeAgent: Agent | null;
    phase: string;
    completedAgents: number;
    totalAgentsToRun: number;
    modelMode: ModelMode;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ activeAgent, phase, completedAgents, totalAgentsToRun, modelMode }) => {
    if (!activeAgent) {
        return null;
    }

    const Avatar = activeAgent.avatar;

    return (
        <div className="w-full max-w-3xl mx-auto my-6 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-xl shadow-2xl border themed-border">
                <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 flex-shrink-0">
                         <div className="absolute inset-0 rounded-full border-2 border-blue-500/50"></div>
                         <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping"></div>
                        <div className="relative w-16 h-16 rounded-full flex items-center justify-center p-2 bg-gray-900/80">
                            <Avatar className="w-full h-full text-blue-400" />
                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <h3 className="text-xl font-bold text-white">{activeAgent.name} is at work...</h3>
                            <div className="flex items-center gap-2 text-sm text-blue-300 px-3 py-1 bg-blue-500/10 rounded-full">
                                <Spinner />
                                <span>Executing</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{activeAgent.description}</p>
                         <p className="text-xs text-gray-500 mt-2">Current Phase: <span className="font-semibold text-gray-400">{phase}</span></p>
                    </div>
                </div>

                {totalAgentsToRun > 0 && (
                    <div className="mt-4 pt-4 border-t themed-border">
                        <ProgressBar 
                            completed={completedAgents} 
                            total={totalAgentsToRun}
                            activeTaskName={activeAgent.name}
                            modelMode={modelMode}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressDisplay;
