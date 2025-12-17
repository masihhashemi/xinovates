

import React from 'react';
import { Agent, AgentRole, AgentStatus, FinancialPlanningOutput, IdeationOutput, RiskAnalysisOutput, StrategyOutput, TechnicalArchitectOutput, ProblemStatementOutput, SolutionSelectionOutput, AllCritiquesOutput } from '../types';
import { ExclamationTriangleIcon } from './Icons';

const getStatusStyles = (status: AgentStatus) => {
    switch (status) {
        case 'working': return { borderColor: 'border-blue-500', textColor: 'text-blue-300' };
        case 'done': return { borderColor: 'border-green-500', textColor: 'text-green-300' };
        case 'error': return { borderColor: 'border-red-500', textColor: 'text-red-300' };
        case 'idle': default: return { borderColor: 'border-gray-600', textColor: 'text-gray-500' };
    }
};

const getStatusDotColor = (status: AgentStatus) => {
    switch (status) {
        case 'working': return 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)] animate-pulse';
        case 'done': return 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]';
        case 'error': return 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]';
        case 'idle': default: return 'bg-gray-600';
    }
};

const getAgentSummary = (agent: Agent): string => {
    if (!agent.output?.output) return 'Task complete';
    const data = agent.output.output;
    const tokens = agent.output.tokenUsage?.total || 0;
    let summary = 'Task complete';

    try {
        switch (agent.role) {
            case AgentRole.PROBLEM_RESEARCH:
                summary = 'Problem space researched';
                break;
            case AgentRole.CUSTOMER_PERSONA:
                summary = 'Persona created';
                break;
            case AgentRole.EMPATHY_MAP:
                summary = 'Empathy map generated';
                break;
            case AgentRole.PROBLEM_SYNTHESIZER:
                summary = `Problem defined`;
                break;
            case AgentRole.SOLUTION_IDEATION:
                summary = `${(data as IdeationOutput).solutions?.length || 0} solutions generated`;
                break;
            case AgentRole.SOLUTION_CRITIQUE:
                 summary = `Solutions critiqued`;
                 break;
            case AgentRole.SOLUTION_SELECTION:
                summary = `Selected: "${(data as SolutionSelectionOutput).solutionTitle}"`;
                break;
            case AgentRole.VALUE_PROPOSITION:
                summary = `Value proposition defined`;
                break;
            case AgentRole.LEAN_CANVAS:
                summary = `Lean canvas created`;
                break;
            case AgentRole.STORYBOARDING:
                summary = `Journey storyboarded`;
                break;
            // FIX: Use FINANCIAL_MODELER instead of the deprecated FINANCIAL_PLANNING.
            case AgentRole.FINANCIAL_MODELER:
                const enterpriseValue = (data as FinancialPlanningOutput).cashFlowModel?.enterpriseValue;
                summary = `EV: ${enterpriseValue ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(enterpriseValue) : 'N/A'}`;
                break;
            case AgentRole.STRATEGY:
                summary = `Unfair Advantage: ${(data as StrategyOutput).unfairAdvantage}`;
                break;
            case AgentRole.RISK_ANALYSIS:
                summary = `${(data as RiskAnalysisOutput).risks?.length || 0} risks identified`;
                break;
            case AgentRole.TECHNICAL_BLUEPRINT:
                summary = `Tech stack defined`;
                break;
            case AgentRole.GO_TO_MARKET:
                summary = `Launch plan created`;
                break;
            case AgentRole.PITCH_DECK:
                summary = `Pitch deck ready`;
                break;
        }
    } catch (e) {
        console.warn(`Error generating summary for ${agent.role}`, e);
    }

    return `${summary} | Tokens: ${tokens}`;
};

interface AgentNodeProps {
    agent: Agent;
    onAgentClick: (agent: Agent) => void;
}

export const AgentNode = React.forwardRef<HTMLDivElement, AgentNodeProps>(({ agent, onAgentClick }, ref) => {
    const { borderColor, textColor } = getStatusStyles(agent.status);
    const dotClass = getStatusDotColor(agent.status);
    const Avatar = agent.avatar;

    const summary = agent.status === 'done' ? getAgentSummary(agent) : agent.status;
    const canClick = agent.status === 'done' && agent.output;

    return (
        <div 
            ref={ref}
            className={`group relative flex flex-col items-center gap-2 transition-transform duration-300 ${canClick ? 'hover:scale-105 cursor-pointer' : ''} w-28 text-center`}
            onClick={() => canClick && onAgentClick(agent)}
        >
            <div className={`w-24 h-24 rounded-full p-2 border-2 ${borderColor} transition-all duration-300 flex items-center justify-center bg-gray-800/50`}>
                <Avatar className={`w-full h-full ${textColor} transition-all duration-300`} />
            </div>
            
            <div className="flex items-center gap-2 justify-center">
                 <div className={`w-2 h-2 rounded-full ${dotClass} transition-all duration-300 flex-shrink-0`}></div>
                 <h3 className={`font-semibold text-sm ${textColor} transition-all duration-300 truncate max-w-full`}>{agent.name}</h3>
            </div>

            {agent.status === 'error' && <ExclamationTriangleIcon className="w-6 h-6 text-red-500 absolute -top-2 -right-2" />}

            {canClick && (
                <div className="absolute bottom-full mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                    {summary}
                    <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                </div>
            )}
        </div>
    );
});