
import React from 'react';
import { ModelMode } from '../types';
import { ESTIMATED_TIME_PER_AGENT_SECONDS } from '../constants';
import { ClockIcon } from './Icons';

interface ProgressBarProps {
    completed: number;
    total: number;
    activeTaskName: string;
    modelMode: ModelMode;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, activeTaskName, modelMode }) => {
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    const remainingTasks = total - completed;
    const timePerTask = ESTIMATED_TIME_PER_AGENT_SECONDS[modelMode];
    const remainingSeconds = remainingTasks * timePerTask;
    
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = Math.floor(remainingSeconds % 60);

    return (
        <div className="w-full">
            <div className="flex justify-between items-baseline mb-1 text-sm">
                <span className="font-semibold text-gray-200">Overall Progress</span>
                <span className="text-gray-400">{completed} / {total} Tasks Completed</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 relative overflow-hidden border border-gray-600">
                <div 
                    className="bg-gradient-to-r from-blue-500 to-green-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-400">Current Task: <span className="font-semibold text-blue-300">{activeTaskName}</span></p>
                {remainingSeconds > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                        <ClockIcon className="w-4 h-4" />
                        <span>Est. time remaining: {minutes > 0 && `${minutes}m `}{seconds}s</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressBar;
