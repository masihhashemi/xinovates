import React from 'react';
import { SolutionScores, IdeationOutput } from '../types';

interface SpiderChartProps {
    scoresData: SolutionScores[];
    solutions: IdeationOutput['solutions'];
}

const SpiderChart: React.FC<SpiderChartProps> = ({ scoresData, solutions }) => {
    const size = 300;
    const center = size / 2;

    // Check if founder DNA alignment score exists and is non-zero for at least one solution
    const hasFounderDnaScore = scoresData.some(d => d.scores.FounderDnaAlignment && d.scores.FounderDnaAlignment > 0);

    const baseLabels = ["Innovation", "Feasibility", "MarketFit", "Scalability", "CapitalEfficiency"];
    const labels = hasFounderDnaScore ? [...baseLabels, "FounderDnaAlignment"] : baseLabels;
    
    const numLabels = labels.length;
    const angleSlice = (Math.PI * 2) / numLabels;
    const radius = center * 0.75;

    const colors = ['#f87171', '#60a5fa', '#4ade80']; // red, blue, green

    // Function to calculate point coordinates
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
                {/* Grid lines */}
                {[...Array(5)].map((_, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={(radius / 5) * (i + 1)}
                        fill="none"
                        stroke="#4b5563" // gray-700
                        strokeWidth="1"
                    />
                ))}

                {/* Axes and Labels */}
                {labels.map((label, i) => {
                    const point = getPoint(11.5, i); // Position labels outside the max radius
                    const axisEnd = getPoint(10, i);
                    return (
                        <g key={label}>
                            <line x1={center} y1={center} x2={axisEnd.x} y2={axisEnd.y} stroke="#4b5563" strokeWidth="1" />
                            <text
                                x={point.x}
                                y={point.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill="#d1d5db" // gray-300
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {label.replace('Fit', ' Fit').replace('Efficiency', ' Eff.').replace('DnaAlignment', ' DNA')}
                            </text>
                        </g>
                    );
                })}

                {/* Data Polygons */}
                {scoresData.map((data, solutionIndex) => {
                    const points = labels.map((label, i) => {
                        const scoreKey = label as keyof typeof data.scores;
                        const score = data.scores[scoreKey] || 0; // fallback to 0 if undefined
                        const { x, y } = getPoint(score, i);
                        return `${x},${y}`;
                    }).join(' ');

                    return (
                        <polygon
                            key={data.solutionId}
                            points={points}
                            fill={colors[solutionIndex % colors.length]}
                            fillOpacity="0.3"
                            stroke={colors[solutionIndex % colors.length]}
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-xs">
                {solutions.map((solution, index) => (
                    <div key={solution.id} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index % colors.length] }} />
                        <span className="text-gray-300 font-semibold truncate max-w-[100px]" title={solution.title}>
                            {`S${solution.id}: ${solution.title}`}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpiderChart;