

import React from 'react';
import { ProblemFrame } from '../types';
import { TargetIcon, CheckCircleIcon, ChartBarIcon, DocumentTextIcon } from './Icons';

interface ProblemFramingPointProps {
    frames: ProblemFrame[];
    onSelectFrame: (frame: ProblemFrame) => void;
}

const RiceRadarChart: React.FC<{ frames: ProblemFrame[] }> = ({ frames }) => {
    const size = 300;
    const center = size / 2;
    const radius = size * 0.4;
    const labels = ["Reach", "Impact", "Confidence", "Feasibility"];
    const angleSlice = (Math.PI * 2) / labels.length;

    const colors = [
        { fill: "rgba(59, 130, 246, 0.2)", stroke: "#3b82f6" }, // Blue
        { fill: "rgba(168, 85, 247, 0.2)", stroke: "#a855f7" }, // Purple
        { fill: "rgba(34, 197, 94, 0.2)", stroke: "#22c55e" }, // Green
    ];

    const getPoint = (value: number, index: number) => {
        const angle = angleSlice * index - Math.PI / 2;
        const r = (value / 10) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Grid */}
                {[2, 4, 6, 8, 10].map((r) => (
                    <circle
                        key={r}
                        cx={center}
                        cy={center}
                        r={(r / 10) * radius}
                        fill="none"
                        stroke="#374151"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                ))}

                {/* Axes */}
                {labels.map((label, i) => {
                    const { x, y } = getPoint(10, i);
                    const labelPoint = getPoint(11.5, i);
                    return (
                        <g key={i}>
                            <line x1={center} y1={center} x2={x} y2={y} stroke="#4b5563" strokeWidth="1" />
                            <text
                                x={labelPoint.x}
                                y={labelPoint.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#9ca3af"
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {label}
                            </text>
                        </g>
                    );
                })}

                {/* Data Polygons */}
                {frames.map((frame, i) => {
                    const scores = [
                        frame.validationScores.reach,
                        frame.validationScores.impact,
                        frame.validationScores.confidence,
                        frame.validationScores.feasibility
                    ];
                    const points = scores.map((s, idx) => {
                        const { x, y } = getPoint(s, idx);
                        return `${x},${y}`;
                    }).join(" ");

                    return (
                        <polygon
                            key={frame.id}
                            points={points}
                            fill={colors[i % colors.length].fill}
                            stroke={colors[i % colors.length].stroke}
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
            
            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-2">
                {frames.map((frame, i) => (
                    <div key={frame.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length].stroke }}></div>
                        <span className="text-xs text-gray-400 font-semibold">{frame.coreProblem}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProblemFramingPoint: React.FC<ProblemFramingPointProps> = ({ frames, onSelectFrame }) => {
    const cardColors = [
        "border-blue-500/30 hover:border-blue-500",
        "border-purple-500/30 hover:border-purple-500",
        "border-green-500/30 hover:border-green-500",
    ];

    return (
        <div className="w-full max-w-7xl mx-auto my-8 animate-fade-in">
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl shadow-2xl border themed-border">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold main-title text-transparent bg-clip-text">Define the Problem Scope</h2>
                    <p className="text-gray-400 mt-3 max-w-3xl mx-auto text-lg">
                        Our research has identified three distinct root causes. Compare their R.I.C.E. scores (Reach, Impact, Confidence, Feasibility) below to choose the most strategic opportunity.
                    </p>
                </div>

                {/* Radar Chart Section */}
                <div className="mb-10 bg-gray-800/40 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                        <ChartBarIcon className="w-5 h-5 text-blue-400" />
                        Opportunity Comparison (R.I.C.E. Model)
                    </h3>
                    <RiceRadarChart frames={frames} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {frames.map((frame, index) => (
                        <div key={frame.id} className={`bg-gray-800/60 p-6 rounded-lg border ${cardColors[index % cardColors.length]} transition-all duration-300 flex flex-col h-full group relative overflow-hidden`}>
                            {/* Strategic Label Badge */}
                            {frame.strategicLabel && (
                                <div className="absolute top-0 right-0 bg-gray-900/80 text-gray-300 text-xs font-bold px-3 py-1 rounded-bl-lg border-b border-l border-gray-700">
                                    {frame.strategicLabel}
                                </div>
                            )}

                            <div className="mb-4 pr-4">
                                <h3 className="font-bold text-xl text-white mb-2 leading-tight">
                                    {frame.coreProblem}
                                </h3>
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                    <TargetIcon className="w-4 h-4" />
                                    {frame.targetSegment}
                                </div>
                            </div>
                            
                            <div className="flex-grow space-y-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Root Cause</p>
                                    <p className="text-sm text-gray-300">{frame.rootCause}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold mb-1">Rationale</p>
                                    <p className="text-sm text-gray-400 italic">"{frame.rationale}"</p>
                                </div>
                                <div className="pt-3 border-t border-gray-700/50">
                                    <p className="text-xs text-blue-400 font-semibold mb-1 flex items-center gap-1">
                                        <DocumentTextIcon className="w-3 h-3" /> Evidence / Data Anchor
                                    </p>
                                    <p className="text-xs text-gray-400 leading-relaxed bg-blue-900/10 p-2 rounded border border-blue-500/20">
                                        {frame.evidence}
                                    </p>
                                </div>
                            </div>

                            {/* Score Summary */}
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-6 bg-gray-900/50 p-3 rounded-lg">
                                <div>Reach: <span className="text-white font-bold">{frame.validationScores.reach}</span></div>
                                <div>Impact: <span className="text-white font-bold">{frame.validationScores.impact}</span></div>
                                <div>Conf.: <span className="text-white font-bold">{frame.validationScores.confidence}</span></div>
                                <div>Feas.: <span className="text-white font-bold">{frame.validationScores.feasibility}</span></div>
                            </div>

                            <button
                                onClick={() => onSelectFrame(frame)}
                                className="w-full mt-auto px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg"
                            >
                                <CheckCircleIcon className="w-5 h-5"/>
                                Select This Scope
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProblemFramingPoint;