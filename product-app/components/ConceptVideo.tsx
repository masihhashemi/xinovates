import React from 'react';
import { Agent, AgentRole, AgentStatus } from '../types';

const getStatusColor = (status: AgentStatus) => {
    switch (status) {
        case 'working': return '#60a5fa'; // blue-400
        case 'done': return '#4ade80';    // green-400
        case 'error': return '#f87171';   // red-400
        case 'idle': default: return '#6b7280'; // gray-500
    }
};

const getStatusTextColorClass = (status: AgentStatus) => {
    switch (status) {
        case 'working': return 'text-blue-400';
        case 'done': return 'text-green-400';
        case 'error': return 'text-red-400';
        case 'idle': default: return 'text-gray-500';
    }
};

const DiagramAgent: React.FC<{
    agent?: Agent;
    onAgentClick: (agent: Agent) => void;
    position: { top: string; left: string };
    overrideName?: string;
}> = ({ agent, onAgentClick, position, overrideName }) => {
    if (!agent) return null;

    const statusColor = getStatusColor(agent.status);
    const textColorClass = getStatusTextColorClass(agent.status);
    const canClick = agent.status === 'done' && agent.output;
    const Avatar = agent.avatar;

    return (
        <div
            className={`absolute flex flex-col items-center w-28 text-center transition-transform duration-200 ${canClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
            style={{ ...position, transform: 'translate(-50%, -50%)' }}
            onClick={() => canClick && onAgentClick(agent)}
        >
            <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 bg-gray-800"
                style={{ borderColor: statusColor }}
            >
                <Avatar className={`w-6 h-6 ${textColorClass}`}/>
            </div>
            <p className="mt-1 text-xs font-semibold text-gray-300 leading-tight">
                {overrideName || agent.name}
            </p>
        </div>
    );
};

const ComplementaryAgentsBox: React.FC<{
    agents: Agent[];
    onAgentClick: (agent: Agent) => void;
    selectedDeliverables: Set<AgentRole>;
    onDeliverableToggle: (role: AgentRole) => void;
    isRefinementEnabled: boolean;
}> = ({ agents, onAgentClick, selectedDeliverables, onDeliverableToggle, isRefinementEnabled }) => {
    
    const complementaryRoles: AgentRole[] = [
        AgentRole.IP_STRATEGIST, AgentRole.TALENT_STRATEGIST, AgentRole.VALUE_PROPOSITION, AgentRole.LEAN_CANVAS,
        AgentRole.STORYBOARDING, AgentRole.FINANCIAL_MODELER, AgentRole.RISK_ANALYSIS,
        AgentRole.TECHNICAL_BLUEPRINT, AgentRole.GO_TO_MARKET, AgentRole.STRATEGY
    ];

    const complementaryAgents = complementaryRoles.map(role => agents.find(a => a.role === role)).filter(Boolean) as Agent[];

    return (
        <div className="p-4 border themed-border rounded-lg bg-gray-800/60 backdrop-blur-sm">
            <h3 className="text-base font-bold text-gray-200 text-center mb-3">Deliverables</h3>
            <ul className="space-y-1">
                {complementaryAgents.map(agent => {
                    const statusColor = getStatusColor(agent.status);
                    const textColorClass = getStatusTextColorClass(agent.status);
                    const canClick = agent.status === 'done' && agent.output;
                    const Avatar = agent.avatar;
                    const isDevil = agent.role === AgentRole.DEVILS_ADVOCATE;
                    const isChecked = isDevil ? isRefinementEnabled : selectedDeliverables.has(agent.role);

                    return (
                        <li key={agent.role}>
                            <label
                                className={`flex items-center gap-2 text-xs font-semibold p-1.5 rounded-md transition-colors ${
                                    isChecked ? 'bg-blue-500/10' : ''
                                } ${isDevil ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-gray-700/50'}`}
                                title={isDevil ? "Controlled by the 'Enable Devil's Advocate Loop' toggle" : `Click to toggle ${agent.name}`}
                            >
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 themed-focus-ring focus:ring-offset-gray-800"
                                    checked={isChecked}
                                    disabled={isDevil}
                                    onChange={() => !isDevil && onDeliverableToggle(agent.role)}
                                />
                                <div 
                                    className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center ${canClick ? 'cursor-pointer' : ''}`}
                                    style={{ borderColor: statusColor }}
                                    onClick={(e) => {
                                        if (canClick) {
                                            e.preventDefault();
                                            onAgentClick(agent);
                                        }
                                    }}
                                >
                                    <Avatar className={`w-3 h-3 ${textColorClass}`}/>
                                </div>
                                <span className={isChecked ? 'text-white' : 'text-gray-400'}>{agent.name}</span>
                            </label>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};


const ConceptVideo: React.FC<{
    agents: Agent[];
    onAgentClick: (agent: Agent) => void;
    selectedDeliverables: Set<AgentRole>;
    onDeliverableToggle: (role: AgentRole) => void;
    isRefinementEnabled: boolean;
}> = ({ agents, onAgentClick, selectedDeliverables, onDeliverableToggle, isRefinementEnabled }) => {

    const getAgent = (role: AgentRole) => agents.find(a => a.role === role);

    return (
        <div className="relative w-full h-[450px] my-4 p-6 bg-gray-900/50 backdrop-blur-sm border themed-border rounded-xl shadow-lg font-sans">
            {/* SVG Background for shapes and arrows */}
            <svg width="100%" height="100%" className="absolute inset-0 z-0">
                <defs>
                    <linearGradient id="diamond1-grad-dark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                     <linearGradient id="diamond2-grad-dark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#84cc16" />
                    </linearGradient>
                     <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                    </marker>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Diamonds */}
                <path d="M 40 205 L 200 60 L 360 205 L 200 350 Z" fill="none" stroke="url(#diamond1-grad-dark)" strokeWidth="3" filter="url(#glow)"/>
                <path d="M 380 205 L 560 60 L 740 205 L 560 350 Z" fill="none" stroke="url(#diamond2-grad-dark)" strokeWidth="3" filter="url(#glow)"/>

                {/* Dashed line connections */}
                <g stroke="#6b7280" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowhead)">
                    {/* Diamond 1 Flows */}
                    <path d="M 64 205 L 96 205" /> {/* Founder -> Research */}
                    <path d="M 142 195 L 163 154" /> {/* Research -> Empathy */}
                    <path d="M 142 215 L 163 256" /> {/* Research -> Persona */}
                    <path d="M 180 251 L 180 159" /> {/* Persona -> Empathy */}
                    <path d="M 200 145 L 285 185" /> {/* Empathy -> Synthesizer */}
                    <path d="M 200 265 L 285 200" /> {/* Persona -> Synthesizer */}
                    <path d="M 142 205 L 285 195" /> {/* Research -> Synthesizer */}
                    
                    {/* Diamond 1 to 2 */}
                    <path d="M 322 195 L 385 205" /> {/* Synthesizer -> Tech Scout */}

                    {/* The Crucible Flows */}
                    <path d="M 430 205 L 510 115" /> {/* Tech Scout -> Ideation */}
                    <path d="M 528 110 L 528 270" /> {/* Ideation -> Critique */}
                    <path d="M 550 105 L 595 180" /> {/* Ideation -> Analyst */}
                    <path d="M 550 285 L 595 210" /> {/* Critique -> Analyst */}
                    <path d="M 625 190 L 670 115" /> {/* Analyst -> Evolution */}
                    <path d="M 620 195 L 740 190" /> {/* Analyst -> Selection */}
                    <path d="M 780 190 L 800 190" /> {/* Selection -> Deliverables Box */}
                </g>
                
                {/* Crucible Feedback Loop */}
                <path d="M 680 120 C 700 150, 660 190, 630 195" stroke="#a78bfa" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            </svg>

            {/* UI Elements - Labels and Agents */}
            <div className="relative w-full h-full text-gray-300">
                {/* Phase Labels */}
                <p className="absolute font-bold tracking-widest text-lg" style={{ top: '20px', left: '120px', transform: 'translateX(-50%)' }}>DISCOVER</p>
                <p className="absolute font-bold tracking-widest text-lg" style={{ top: '20px', left: '270px', transform: 'translateX(-50%)' }}>DEFINE</p>
                <p className="absolute font-bold tracking-widest text-lg text-yellow-300" style={{ top: '20px', left: '470px', transform: 'translateX(-50%)' }}>THE CRUCIBLE</p>
                <p className="absolute font-bold tracking-widest text-lg" style={{ top: '20px', left: '650px', transform: 'translateX(-50%)' }}>DELIVER</p>


                {/* Pre-Simulation Agent */}
                <DiagramAgent agent={getAgent(AgentRole.FOUNDER_DNA)} onAgentClick={onAgentClick} position={{ top: '205px', left: '40px' }} />

                {/* Agents in Diamond 1 */}
                <DiagramAgent agent={getAgent(AgentRole.PROBLEM_RESEARCH)} onAgentClick={onAgentClick} position={{ top: '205px', left: '120px' }} />
                <DiagramAgent agent={getAgent(AgentRole.EMPATHY_MAP)} onAgentClick={onAgentClick} position={{ top: '135px', left: '180px' }} />
                <DiagramAgent agent={getAgent(AgentRole.CUSTOMER_PERSONA)} onAgentClick={onAgentClick} position={{ top: '275px', left: '180px' }} overrideName="Persona Creator" />
                <DiagramAgent agent={getAgent(AgentRole.PROBLEM_SYNTHESIZER)} onAgentClick={onAgentClick} position={{ top: '190px', left: '300px' }} />
                
                {/* Agents in Diamond 2 (The Crucible) */}
                <DiagramAgent agent={getAgent(AgentRole.TECHNOLOGY_SCOUT)} onAgentClick={onAgentClick} position={{ top: '205px', left: '410px' }} />
                <DiagramAgent agent={getAgent(AgentRole.SOLUTION_IDEATION)} onAgentClick={onAgentClick} position={{ top: '100px', left: '530px' }} />
                <DiagramAgent agent={getAgent(AgentRole.SOLUTION_CRITIQUE)} onAgentClick={onAgentClick} position={{ top: '290px', left: '530px' }} overrideName="Solution Critics" />
                <DiagramAgent agent={getAgent(AgentRole.VENTURE_ANALYST)} onAgentClick={onAgentClick} position={{ top: '195px', left: '600px' }} />
                <DiagramAgent agent={getAgent(AgentRole.SOLUTION_EVOLUTION)} onAgentClick={onAgentClick} position={{ top: '100px', left: '680px' }} />
                <DiagramAgent agent={getAgent(AgentRole.SOLUTION_SELECTION)} onAgentClick={onAgentClick} position={{ top: '190px', left: '760px' }} />
                
                {/* Complementary Agents Box */}
                <div className="absolute top-1/2 left-[88%] w-[20%] -translate-y-1/2 -translate-x-1/2">
                    <ComplementaryAgentsBox 
                        agents={agents} 
                        onAgentClick={onAgentClick}
                        selectedDeliverables={selectedDeliverables}
                        onDeliverableToggle={onDeliverableToggle}
                        isRefinementEnabled={isRefinementEnabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConceptVideo;