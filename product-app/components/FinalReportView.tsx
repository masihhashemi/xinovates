
import React, { useState } from 'react';
import { CashFlowYear, FinancialScenario } from '../types';

interface CumulativeFcffChartProps {
    data: CashFlowYear[];
    scenarios?: FinancialScenario[];
    isPrintable?: boolean;
}

const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1_000) {
        return `$${(value / 1_000).toFixed(0)}K`;
    }
    return `$${Math.round(value)}`;
};

const CumulativeFcffChart: React.FC<CumulativeFcffChartProps> = ({ data, scenarios = [], isPrintable = false }) => {
    const [visibleScenarios, setVisibleScenarios] = useState({
        base: true,
        best: true,
        worst: true,
    });

    if (!data || data.length === 0) {
        return <p className="text-gray-400">Not enough data to display chart.</p>;
    }

    const processProjection = (projection: CashFlowYear[]) => {
        let cumulativeFcff = 0;
        return projection.map(d => {
            cumulativeFcff += d.fcff;
            return { year: d.year, cumulativeFcff };
        });
    };

    const chartDataBase = processProjection(data);
    const chartDataBest = processProjection(scenarios.find(s => s.scenarioType === 'Best Case')?.cashFlowModel.cashFlows || []);
    const chartDataWorst = processProjection(scenarios.find(s => s.scenarioType === 'Worst Case')?.cashFlowModel.cashFlows || []);

    const width = 500;
    const height = 300;
    const padding = 50;
    
    const allValues = [
        ...chartDataBase.map(d => d.cumulativeFcff),
        ...chartDataBest.map(d => d.cumulativeFcff),
        ...chartDataWorst.map(d => d.cumulativeFcff),
    ];
    
    const yMax = Math.max(...allValues);
    const yMin = Math.min(0, ...allValues);
    const yRange = yMax - yMin;

    const getX = (index: number) => {
        if (chartDataBase.length <= 1) {
            return padding + (width - padding * 2) / 2;
        }
        return padding + (index / (chartDataBase.length - 1)) * (width - padding * 2);
    };

    const getY = (value: number) => {
        if (yRange === 0) {
            return height - padding;
        }
        return height - padding - ((value - yMin) / yRange) * (height - padding * 2);
    };

    const generatePath = (chartData: any[], dataKey: string) => {
        return chartData.map((d, index) => `${getX(index)},${getY(d[dataKey])}`).join(' ');
    };
    
    const yAxisLabelsCount = 5;
    const yAxisLabels = Array.from({ length: yAxisLabelsCount + 1 }, (_, i) => {
        const value = yMin + yRange * (i / yAxisLabelsCount);
        return { value, y: getY(value) };
    });

    const colors = {
        base: '#60a5fa',  // blue-400
        best: '#4ade80', // green-400
        worst: '#f87171',   // red-400
    };

    const yAxisColor = isPrintable ? 'text-gray-400' : 'text-gray-500';
    const xAxisColor = isPrintable ? 'text-gray-600' : 'text-gray-400';
    const legendColor = isPrintable ? 'text-gray-700' : 'text-gray-300';
    
    const toggleVisibility = (scenario: keyof typeof visibleScenarios) => {
        if (!isPrintable) {
            setVisibleScenarios(prev => ({ ...prev, [scenario]: !prev[scenario] }));
        }
    };


    return (
        <div className={`w-full overflow-x-auto p-4 rounded-lg ${isPrintable ? 'bg-white' : 'bg-gray-950/50'}`}>
            <svg viewBox={`0 0 ${width} ${height}`} className="font-sans w-full">
                {/* Y-axis grid lines and labels */}
                {yAxisLabels.map(({ value, y }, i) => (
                    <g key={i} className={yAxisColor}>
                        <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2"/>
                        <text x={padding - 10} y={y + 3} textAnchor="end" fontSize="10" fill="currentColor">{formatCurrency(value)}</text>
                    </g>
                ))}

                {/* X-axis labels */}
                {chartDataBase.map((d, index) => (
                    <g key={d.year} className={xAxisColor}>
                        <text x={getX(index)} y={height - padding + 20} textAnchor="middle" fontSize="10" fill="currentColor">Year {d.year}</text>
                    </g>
                ))}

                {/* Data lines */}
                {visibleScenarios.worst && chartDataWorst.length > 0 && <polyline fill="none" stroke={colors.worst} strokeWidth="2" points={generatePath(chartDataWorst, 'cumulativeFcff')} />}
                {visibleScenarios.best && chartDataBest.length > 0 && <polyline fill="none" stroke={colors.best} strokeWidth="2" points={generatePath(chartDataBest, 'cumulativeFcff')} />}
                {visibleScenarios.base && <polyline fill="none" stroke={colors.base} strokeWidth="3" points={generatePath(chartDataBase, 'cumulativeFcff')} />}
                
                {/* Data points */}
                {visibleScenarios.base && chartDataBase.map((d, index) => (
                    <circle key={`base-${d.year}`} cx={getX(index)} cy={getY(d.cumulativeFcff)} r="3" fill={colors.base} />
                ))}
                 {visibleScenarios.best && chartDataBest.map((d, index) => (
                    <circle key={`best-${d.year}`} cx={getX(index)} cy={getY(d.cumulativeFcff)} r="3" fill={colors.best} />
                ))}
                {visibleScenarios.worst && chartDataWorst.map((d, index) => (
                    <circle key={`worst-${d.year}`} cx={getX(index)} cy={getY(d.cumulativeFcff)} r="3" fill={colors.worst} />
                ))}
            </svg>
            
            <div className={`flex flex-wrap justify-center items-center gap-x-4 gap-y-2 mt-4 text-xs ${legendColor}`}>
                <div onClick={() => toggleVisibility('base')} className={`flex items-center gap-2 cursor-pointer transition-opacity ${!visibleScenarios.base && 'opacity-50'}`}>
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.base }} />
                    <span>Base Case</span>
                </div>
                {chartDataBest.length > 0 && (
                     <div onClick={() => toggleVisibility('best')} className={`flex items-center gap-2 cursor-pointer transition-opacity ${!visibleScenarios.best && 'opacity-50'}`}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.best }} />
                        <span>Best Case</span>
                    </div>
                )}
                 {chartDataWorst.length > 0 && (
                     <div onClick={() => toggleVisibility('worst')} className={`flex items-center gap-2 cursor-pointer transition-opacity ${!visibleScenarios.worst && 'opacity-50'}`}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.worst }} />
                        <span>Worst Case</span>
                    </div>
                )}
                <div className="w-full text-center text-gray-500 mt-1">Cumulative FCFF Shown</div>
            </div>
        </div>
    );
};

export default CumulativeFcffChart;