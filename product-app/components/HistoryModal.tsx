
import React from 'react';
import { SavedRun } from '../types';
import { XMarkIcon, ArchiveBoxIcon, TrashIcon } from './Icons';

interface HistoryModalProps {
    runs: SavedRun[];
    onLoad: (runId: string) => void;
    onDelete: (runId: string) => void;
    onClose: () => void;
}

// FIX: Changed to a named export to resolve module resolution issue.
export const HistoryModal: React.FC<HistoryModalProps> = ({ runs, onLoad, onDelete, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center p-1 bg-gray-900 border border-gray-600">
                           <ArchiveBoxIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">My Saved Runs</h2>
                            <p className="text-sm text-gray-400">Review your past innovation sessions.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-2 sm:p-4 overflow-y-auto flex-grow bg-black/20 text-gray-300">
                    {runs.length === 0 ? (
                         <div className="text-center py-12">
                            <p className="text-gray-400">You have no saved runs yet.</p>
                            <p className="text-sm text-gray-500 mt-2">Complete a simulation and click "Save Run" to see it here.</p>
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {runs.map(run => (
                                <li key={run.id} className="bg-gray-700/50 p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-grow">
                                        <p className="font-semibold text-white truncate" title={run.title || run.challenge}>{run.title || run.challenge}</p>
                                        <p className="text-xs text-gray-400 mt-1">Saved: {new Date(run.savedAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex-shrink-0 flex items-center gap-2">
                                        <button onClick={() => onLoad(run.id)} className="px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                                            Load
                                        </button>
                                        <button onClick={() => onDelete(run.id)} className="p-2 text-red-400 hover:text-red-300 transition-colors" title="Delete run">
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};
