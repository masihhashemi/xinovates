import React from 'react';
import { Agent, AgentRole } from '../types';
// FIX: Correct component imports from CanvasViews. Some components were not exported from the main file.
import { FinancialModelerCanvas, StoryboardReportCanvas, StrategyCanvas, CustomerPersonaCanvas, EmpathyMapCanvas, ProblemStatementCanvas, ValuePropositionCanvas, LeanCanvas, ResearchCanvas, RiskAnalysisCanvas, TechnicalBlueprintCanvas, GoToMarketCanvas, IdeationCanvas, CritiqueCanvas, SolutionSelectionCanvas, TechnologyScoutCanvas, SolutionScoringCanvas, InvestmentMemoCanvas } from './CanvasViews';
import { XMarkIcon, ChipIcon } from './Icons';

interface AgentDetailModalProps {
    agent: Agent | null;
    onClose: () => void;
}

const AgentDetailModal: React.FC<AgentDetailModalProps> = ({ agent, onClose }) => {
    if (!agent) {
        return null;
    }

    const AvatarComponent = agent.avatar;

    const renderOutput = () => {
        if (!agent.output?.output) {
            return <div className="p-4"><p className="text-gray-500 text-center">No output available yet.</p></div>;
        }

        const data = agent.output.output;

        switch (agent.role) {
            // Discover
            case AgentRole.PROBLEM_RESEARCH:
                return <ResearchCanvas data={data} />;
            case AgentRole.CUSTOMER_PERSONA:
                return <CustomerPersonaCanvas data={data} />;
            case AgentRole.EMPATHY_MAP:
                return <EmpathyMapCanvas data={data} />;
            // Define
            case AgentRole.PROBLEM_SYNTHESIZER:
                return <ProblemStatementCanvas data={data} />;
            // Develop
            case AgentRole.TECHNOLOGY_SCOUT:
                return <TechnologyScoutCanvas data={data} />;
            case AgentRole.SOLUTION_IDEATION:
                return <IdeationCanvas data={data} />;
            case AgentRole.SOLUTION_CRITIQUE:
                return <CritiqueCanvas data={data} />;
            case AgentRole.VENTURE_ANALYST:
                return <SolutionScoringCanvas data={data} />;
            case AgentRole.SOLUTION_SELECTION:
                 return <SolutionSelectionCanvas data={data} />;
            // Deliver
            case AgentRole.VALUE_PROPOSITION:
                return <ValuePropositionCanvas data={data} />;
            case AgentRole.LEAN_CANVAS:
                return <LeanCanvas data={data} />;
            case AgentRole.STORYBOARDING:
                return <StoryboardReportCanvas data={data} />;
            // FIX: Renamed FinancialPlanning to FinancialModeler and FinancialPlanningReportCanvas to FinancialModelerCanvas to reflect the change in the agent's role and fix the reference to a non-existent enum member and component. Added InvestmentMemoCanvas to handle the new agent.
            case AgentRole.FINANCIAL_MODELER:
                return <FinancialModelerCanvas data={data} />;
            case AgentRole.INVESTMENT_MEMO:
                return <InvestmentMemoCanvas data={data} />;
            case AgentRole.STRATEGY:
                return <StrategyCanvas data={data} />;
            case AgentRole.RISK_ANALYSIS:
                return <RiskAnalysisCanvas data={data} />;
            case AgentRole.TECHNICAL_BLUEPRINT:
                return <TechnicalBlueprintCanvas data={data} />;
            case AgentRole.GO_TO_MARKET:
                return <GoToMarketCanvas data={data} />;
            default:
                return <div className="p-4"><pre className="text-xs whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre></div>;
        }
    };

    const tokenUsage = agent.output?.tokenUsage;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full p-1 bg-gray-900 border border-gray-600">
                            <AvatarComponent className="w-full h-full text-gray-300" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">{agent.role}</h2>
                            <p className="text-sm text-gray-400">{agent.description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-2 sm:p-4 overflow-y-auto flex-grow bg-black/20">
                    {renderOutput()}
                </div>
                
                {tokenUsage && (
                    <footer className="p-3 border-t border-gray-700 bg-gray-900/50 text-xs text-gray-400 flex items-center justify-end gap-4">
                        <div className="flex items-center gap-2">
                            <ChipIcon className="w-4 h-4 text-blue-400" />
                            <span>Token Usage:</span>
                        </div>
                         <span title="Input Tokens">In: <strong className="text-gray-300">{tokenUsage.input}</strong></span>
                         <span title="Output Tokens">Out: <strong className="text-gray-300">{tokenUsage.output}</strong></span>
                         <span title="Total Tokens">Total: <strong className="text-gray-200 font-bold">{tokenUsage.total}</strong></span>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default AgentDetailModal;