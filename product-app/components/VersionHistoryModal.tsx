
import React from 'react';
import { XMarkIcon, TagIcon } from './Icons';
import { CHANGELOG, APP_VERSION } from '../constants';

interface VersionHistoryModalProps {
    onClose: () => void;
}

const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center p-1 bg-gray-900 border border-gray-600">
                           <TagIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Version History</h2>
                            <p className="text-sm text-gray-400">Current Version: {APP_VERSION}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow bg-black/20 text-gray-300 space-y-8">
                    {CHANGELOG.map((entry, index) => (
                        <div key={index} className="border-l-4 border-gray-700 pl-4 py-2 hover:border-blue-400 transition-colors duration-300">
                            <h3 className="font-semibold text-lg text-white">Version {entry.version}</h3>
                            <p className="text-xs text-gray-500 mb-3">{entry.date}</p>
                            <ul className="space-y-2 text-sm text-gray-400">
                                {entry.changes.map((change, cIndex) => {
                                    const parts = change.split('**:', 2);
                                    if (parts.length > 1) {
                                        const tag = parts[0].replace(/\*/g, '').trim();
                                        const text = parts[1].trim();
                                        let tagClass = 'bg-gray-600 text-gray-200';
                                        if (tag.toLowerCase().includes('major')) {
                                            tagClass = 'bg-yellow-500/20 text-yellow-300';
                                        } else if (tag.toLowerCase().includes('feature')) {
                                            tagClass = 'bg-blue-500/20 text-blue-300';
                                        } else if (tag.toLowerCase().includes('improvement')) {
                                            tagClass = 'bg-green-500/20 text-green-300';
                                        } else if (tag.toLowerCase().includes('patch')) {
                                             tagClass = 'bg-gray-500/20 text-gray-300';
                                        }
                                        return (
                                            <li key={cIndex} className="flex items-start gap-2">
                                                <span className={`mt-1 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${tagClass}`}>{tag}</span>
                                                <span>{text}</span>
                                            </li>
                                        );
                                    }
                                    return <li key={cIndex} className="ml-4 pl-2 list-disc">{change}</li>;
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VersionHistoryModal;
