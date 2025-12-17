

import React, { useState, useRef } from 'react';
import { XMarkIcon, AcademicCapIcon, BookOpenIcon, ChevronRightIcon, AdjustmentsHorizontalIcon, DownloadIcon } from './Icons';
import { AGENT_DEFINITIONS } from '../constants';
import { Agent, AgentRole } from '../types';
import html2canvas from 'html2canvas';


const DoubleDiamondDiagram = () => (
    <div className="my-6 p-4 bg-gray-900/50 rounded-lg">
        <svg viewBox="0 0 420 120" className="w-full font-sans">
            <defs>
                <linearGradient id="diamondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.1)" />
                    <stop offset="100%" stopColor="rgba(167, 139, 250, 0.3)" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill="#a78bfa" />
                </marker>
            </defs>

            {/* Diamonds */}
            <path d="M10 60 L60 10 L110 60 L60 110 Z" fill="url(#diamondGrad)" stroke="#60a5fa" strokeWidth="1.5" />
            <path d="M150 60 L200 10 L250 60 L200 110 Z" fill="url(#diamondGrad)" stroke="#a78bfa" strokeWidth="1.5" />

            {/* Vertical lines for clarity */}
            <path d="M60 10 L60 110" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="2,2" />
            <path d="M200 10 L200 110" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="2,2" />

            {/* Phase Text - Centered in each half of the diamond */}
            <text x="35" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Discover</text>
            <text x="85" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Define</text>

            <text x="175" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Develop</text>
            <text x="225" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Deliver</text>

            {/* Space Labels under diamonds */}
            <text x="60" y="118" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="500">PROBLEM SPACE</text>
            <text x="200" y="118" textAnchor="middle" fill="#a78bfa" fontSize="10" fontWeight="500">SOLUTION SPACE</text>

            {/* Connecting Arrow */}
            <path d="M115 60 L145 60" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            <path d="M255 60 L285 60" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
            
            {/* Final Output */}
            <rect x="295" y="40" width="120" height="40" rx="8" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="1" />
            <text x="355" y="65" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">Venture Plan</text>
        </svg>
    </div>
);

const AiAugmentedDoubleDiamondDiagram: React.FC<{ onExport: (format: 'svg' | 'png') => void }> = ({ onExport }) => (
    <div className="relative font-sans text-xs">
         <svg viewBox="0 0 960 380" className="w-full h-auto bg-gray-800/20 rounded-lg border border-gray-700 p-2">
            <title id="ai-dd-title">AI-Augmented Double Diamond Diagram</title>
            <desc id="ai-dd-desc">A diagram showing how AI expands the discovery and solution development phases of the Double Diamond model.</desc>
             <defs>
                 <marker id="arrowhead-diag" markerWidth="5" markerHeight="3.5" refX="4.5" refY="1.75" orient="auto">
                    <polygon points="0 0, 5 1.75, 0 3.5" fill="currentColor" />
                </marker>
                <linearGradient id="expansionGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                    <stop offset="0%" stopColor="rgba(96, 165, 250, 0.4)" />
                    <stop offset="100%" stopColor="rgba(96, 165, 250, 0.15)" />
                </linearGradient>
                 <filter id="expansionGlow">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Expansion Zones - now with gradient and glow */}
            <g filter="url(#expansionGlow)">
                <path d="M100 200 L 305 40 L 510 200 L 305 360 Z" fill="url(#expansionGradient)" stroke="none" />
                <path d="M510 200 L 715 40 L 920 200 L 715 360 Z" fill="url(#expansionGradient)" stroke="none" />
            </g>

            {/* Vertical Text */}
            <text x="25" y="260" fill="#9ca3af" className="font-semibold" transform="rotate(-90, 25, 200)">AI-Augmented Double Diamond</text>
            
            {/* Top Labels */}
            <text x="305" y="30" textAnchor="middle" className="font-bold text-base text-gray-200">Problem Space</text>
            <text x="715" y="30" textAnchor="middle" className="font-bold text-base text-gray-200">Solution Space</text>

            {/* Arrows */}
            {[...Array(7)].map((_, i) => (
                <g key={`arrow-set-1-${i}`} className="text-gray-500">
                    <path d={`M105 200 L290 ${80 + i * 35}`} fill="none" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead-diag)" />
                    <path d={`M290 ${80 + i * 35} L 495 200`} fill="none" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead-diag)" />
                    <path d={`M515 200 L 690 ${80 + i * 35}`} fill="none" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead-diag)" />
                    <path d={`M690 ${80 + i * 35} L 915 200`} fill="none" stroke="currentColor" strokeWidth="1" markerEnd="url(#arrowhead-diag)" />
                </g>
            ))}

            {/* Main nodes */}
            <circle cx="100" cy="200" r="8" fill="#e5e7eb"/>
            <circle cx="510" cy="200" r="8" fill="#1f2937" stroke="#e5e7eb" strokeWidth="2"/>
            <circle cx="920" cy="200" r="8" fill="#1f2937" stroke="#e5e7eb" strokeWidth="2"/>
            
            {/* Node Columns */}
            {[...Array(11)].map((_, i) => <circle key={`node-col-1-${i}`} cx="290" cy={100 + i * 20} r="5" fill="#facc15" />)}
            {[...Array(11)].map((_, i) => <circle key={`node-col-2-${i}`} cx="315" cy={100 + i * 20} r="5" fill="#60a5fa" />)}
            {[...Array(11)].map((_, i) => <rect key={`node-col-3-${i}`} x="685" y={100 + i * 20 - 5} width="10" height="10" fill="#f87171" />)}
            {[...Array(11)].map((_, i) => <rect key={`node-col-4-${i}`} x="710" y={100 + i * 20 - 5} width="10" height="10" fill="#facc15" />)}

            {/* Stage Labels */}
            <g className="cursor-pointer">
                <title>Define the context and stakeholders; surface initial assumptions.</title>
                <text x="210" y="340" textAnchor="middle" className="fill-gray-300 font-semibold">Problem Articulation</text>
            </g>
            <g className="cursor-pointer">
                <title>Converge on precise needs and success criteria.</title>
                <text x="400" y="340" textAnchor="middle" className="fill-gray-300 font-semibold">Problem Selection</text>
            </g>
             <g className="cursor-pointer">
                <title>Explore solution options and architectures.</title>
                <text x="610" y="340" textAnchor="middle" className="fill-gray-300 font-semibold">Concept Generation</text>
            </g>
             <g className="cursor-pointer">
                <title>Prioritize, test, and iterate toward delivery.</title>
                <text x="810" y="340" textAnchor="middle" className="fill-gray-300 font-semibold">Concept Selection &amp; Development</text>
            </g>
            
            {/* Legend */}
            <g>
                <rect x="580" y="360" width="15" height="15" fill="rgba(96, 165, 250, 0.2)" stroke="#60a5fa" />
                <text x="600" y="372" className="fill-gray-400">Expansion of the double diamond enabled by AI</text>
            </g>
        </svg>
    </div>
);


const agentDetails: Record<string, { howItWorks: string; outcome: string; }> = {
    [AgentRole.FOUNDER_DNA]: {
        howItWorks: "It takes the founders' self-described backgrounds, work styles, and motivations as input. The AI analyzes this text to identify individual archetypes (e.g., 'Visionary,' 'Builder'), team-level strengths, potential skill gaps, and the most likely collaboration dynamic.",
        outcome: "A 'Founder DNA Profile' that includes a team archetype, a list of strengths and gaps, and individual profiles. This output can optionally be used to steer the ideation process towards concepts that align with the team's natural abilities."
    },
    [AgentRole.PROBLEM_RESEARCH]: {
        howItWorks: "This agent uses Google Search grounding to perform real-time web searches. It synthesizes information from multiple online sources to build a comprehensive report on the market, competitors, technology trends, and ethical considerations related to the problem.",
        outcome: "A detailed research report including a problem summary, market analysis, competitive landscape, and a list of cited web sources."
    },
    [AgentRole.CUSTOMER_PERSONA]: {
        howItWorks: "Using the research report, the agent identifies the primary user group affected by the problem. It then generates a fictional but representative individual, giving them a name, age, occupation, a biographical story, and specific goals and frustrations. It also generates a photorealistic avatar for the persona.",
        outcome: "A detailed Customer Persona card, which serves as a constant reminder of who the solution is being built for."
    },
    [AgentRole.EMPATHY_MAP]: {
        howItWorks: "The agent 'steps into the shoes' of the generated customer persona. It infers what the persona might be saying, thinking, doing, and feeling in relation to the problem space, based on their profile and the initial research. It also summarizes their key pains and potential gains.",
        outcome: "An Empathy Map Canvas, providing a deeper, more emotional understanding of the user's experience."
    },
    [AgentRole.PROBLEM_SYNTHESIZER]: {
        howItWorks: "A convergent thinking step. The agent takes all preceding outputs (research, persona, empathy map) and distills them into their essential components. It identifies the most critical user need and frames it as a 'How Might We...' question, an optimistic and actionable format for brainstorming.",
        outcome: "A focused Problem Statement that includes the 'How Might We...' question, the context, user impact, and key supporting insights. This becomes the precise target for the next phase."
    },
    [AgentRole.TECHNOLOGY_SCOUT]: {
        howItWorks: "This agent acts as a strategic technology intelligence analyst. It uses Google Search to deeply research the solution domain for the defined problem. It identifies relevant existing and emerging technologies, analyzes them for maturity (Technology Readiness Level - TRL) and implementation complexity, and uncovers prior art by searching for relevant patents. It also identifies leading academic experts and research labs in the field to provide avenues for deeper investigation.",
        outcome: "A 'Strategic Technology Intelligence' report. This includes a dashboard of key technologies with their TRL and complexity scores, a list of relevant patents that constitute prior art, and a list of leading experts and research hubs. This report provides critical context and constraints to ground the subsequent solution ideation phase in reality."
    },
    [AgentRole.SOLUTION_IDEATION]: {
        howItWorks: "A divergent thinking step. The agent generates three distinct solutions to the 'How Might We...' problem. It is prompted to think creatively and consider different angles to solve the problem. If Founder DNA is provided, the agent will tailor the ideas to fit the team's strengths.",
        outcome: "A list of three potential solutions, each with a title and a concise description."
    },
    [AgentRole.SOLUTION_CRITIQUE]: {
        howItWorks: "This agent embodies two sub-personas. The 'Devil's Advocate' persona looks for practical flaws and risks. The 'Steve Jobs' persona critiques the solution's ambition and user experience. It applies both critiques to all three generated solutions.",
        outcome: "A set of structured critiques for each solution, detailing weaknesses and raising tough questions from two different viewpoints."
    },
    [AgentRole.SOLUTION_SELECTION]: {
        howItWorks: "The agent weighs the original solutions against their critiques and the initial problem statement. It makes a strategic decision, selecting the single best path forward and providing a clear rationale for its choice, including pros and cons.",
        outcome: "A 'Selected Solution' card that contains the winning idea, its description, and a detailed justification for its selection."
    },
    [AgentRole.DEVILS_ADVOCATE]: {
        howItWorks: "Before committing to deliverables, this agent gives the user a chance to pause. It presents the critical 'Devil's Advocate' feedback for the selected solution. The user can then use this critique to have another AI agent enhance the solution before proceeding.",
        outcome: "A user decision point. The primary outcome is either the approval to proceed or the initiation of a solution enhancement cycle, resulting in a refined solution."
    },
    [AgentRole.IP_STRATEGIST]: {
        howItWorks: "This agent acts as an IP lawyer and strategist. It uses Google Search to perform a prior art search, looking for existing patents, products, and academic papers related to the solution. It assesses this landscape to provide an estimated 'Patentability Score' and a 'Freedom to Operate' signal (Green, Yellow, Red) indicating the risk of infringement.",
        outcome: "An 'IP & Defensibility' report. This includes the patentability score, a summary of key prior art found, the freedom to operate signal, and a high-level recommendation for an IP strategy (e.g., pursue a utility patent, rely on trade secrets, focus on branding)."
    },
    [AgentRole.VALUE_PROPOSITION]: {
        howItWorks: "The agent maps the features of the selected solution ('Products & Services') directly to the user's needs identified in the Empathy Map. It specifies how the solution creates gains ('Gain Creators') and alleviates pains ('Pain Relievers').",
        outcome: "A completed Value Proposition Canvas (VPC), which clarifies the product-market fit."
    },
    [AgentRole.LEAN_CANVAS]: {
        howItWorks: "Using the selected solution and the VPC, this agent fills out the nine blocks of the Lean Canvas. It outlines problems, solutions, key metrics, UVP, unfair advantage, channels, customer segments, cost structure, and revenue streams.",
        outcome: "A completed Lean Canvas, providing a holistic, one-page overview of the business model focused on problem-solution fit."
    },
    [AgentRole.STORYBOARDING]: {
        howItWorks: "The agent writes a five-panel story showing the customer's journey: 1. The initial problem, 2. Discovering the solution, 3. The 'aha!' moment of first use, 4. The positive long-term outcome, and 5. The user advocating for the solution. For each panel, it generates a scene description, narration, and an image prompt used to create a visual.",
        outcome: "A five-panel Storyboard that visually communicates the value of the solution from the user's perspective."
    },
    // FIX: Renamed FinancialPlanning to FinancialModeler to reflect the change in the agent's role and fix the reference to a non-existent enum member.
    [AgentRole.FINANCIAL_MODELER]: {
        howItWorks: "This agent acts as a startup CFO. It analyzes the business model to create a high-level 5-year financial projection, estimates the market size (TAM, SAM, SOM), suggests a pre-money valuation, and brainstorms potential brand names.",
        outcome: "A comprehensive financial plan including projections, a cost breakdown, market sizing, and branding ideas."
    },
    [AgentRole.STRATEGY]: {
        howItWorks: "The agent performs a SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) for the new venture. It synthesizes this with the competitive landscape to articulate the venture's 'Unfair Advantage'—the key differentiator.",
        outcome: "A strategy canvas that clearly defines the venture's competitive positioning and unique strengths."
    },
    [AgentRole.RISK_ANALYSIS]: {
        howItWorks: "The agent scans the entire business plan for potential pitfalls. It identifies market, technical, financial, and operational risks, assesses their likelihood and impact, and proposes concrete steps to mitigate them.",
        outcome: "A Risk Analysis matrix, providing a clear-eyed view of potential challenges and a proactive plan to address them."
    },
    [AgentRole.TECHNICAL_BLUEPRINT]: {
        howItWorks: "The agent acts as a CTO. It recommends a suitable technology stack, designs a system architecture diagram using Mermaid.js syntax, and lays out a phased development roadmap (MVP, V1, V2).",
        outcome: "A Technical Blueprint that provides a clear plan for the engineering team to begin development."
    },
    [AgentRole.GO_TO_MARKET]: {
        howItWorks: "The agent creates a comprehensive marketing plan. This includes defining target channels, crafting key messaging and a slogan, outlining a launch timeline, and even writing sample ad copy and a content calendar.",
        outcome: "A GTM (Go-to-Market) plan that provides an actionable strategy for launching and promoting the new venture."
    },
    [AgentRole.PITCH_DECK]: {
        howItWorks: "The agent synthesizes all the key information from the previous steps into a classic, multi-slide investor pitch deck format, including slides for the problem, solution, market, team, financials, and the ask.",
        outcome: "A structured pitch deck with an executive summary and slide-by-slide content, ready to be presented to investors."
    },
    [AgentRole.ETHICS_ORACLE]: {
        howItWorks: "This agent acts as an independent ethics auditor. It reviews the entire venture plan and scores it across several key dimensions (e.g., Data Privacy, Bias, Sustainability). It provide an explanation for each score and offers actionable recommendations.",
        outcome: "An Ethics & Compliance Audit report that helps ensure responsible innovation."
    }
};

const AgentDetailAccordionItem: React.FC<{ agent: Agent, index: number, openIndex: number | null, setOpenIndex: (index: number | null) => void }> = ({ agent, index, openIndex, setOpenIndex }) => {
    const isOpen = openIndex === index;
    const details = agentDetails[agent.role];
    const Avatar = agent.avatar;

    if (!details) return null;

    return (
        <div className="border-b border-gray-700 last:border-b-0">
            <button
                className="w-full flex justify-between items-center text-left p-4 hover:bg-gray-700/50 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                aria-controls={`agent-details-${index}`}
            >
                <div className="flex items-center gap-3">
                    <Avatar className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    <span className="font-semibold text-white">{agent.name}</span>
                </div>
                <ChevronRightIcon className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div id={`agent-details-${index}`} className="px-4 pb-4 bg-gray-900/20 text-sm text-gray-400 animate-fade-in">
                    <div className="pt-4 space-y-3">
                        <div>
                            <h4 className="font-semibold text-gray-200">Mission</h4>
                            <p>{agent.description}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-200">How it Works</h4>
                            <p>{details.howItWorks}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-200">Outcome</h4>
                            <p>{details.outcome}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const ScienceModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const diagramContainerRef = useRef<HTMLDivElement>(null);

    const handleExport = (format: 'svg' | 'png') => {
        if (!diagramContainerRef.current) return;
        const svgElement = diagramContainerRef.current.querySelector('svg');
        if (!svgElement) return;

        if (format === 'svg') {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'ai-augmented-double-diamond.svg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (format === 'png') {
            html2canvas(diagramContainerRef.current, {
                backgroundColor: null, // transparent background
                scale: 3 // higher resolution
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = 'ai-augmented-double-diamond.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    };


    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center p-1 bg-gray-900 border border-gray-600">
                           <AcademicCapIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">The Science Behind Xinovates</h2>
                            <p className="text-sm text-gray-400">Our structured approach to innovation.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8"/>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow bg-black/20 text-gray-300 space-y-6">
                    <div>
                        <p className="text-gray-300">
                            Xinovates is built on a scientifically-validated framework that combines established design thinking principles with advanced AI collaboration. Our goal is to structure the chaotic process of innovation into a repeatable, robust, and transparent system, turning abstract ideas into concrete venture plans.
                        </p>
                    </div>

                    <div className="p-4 bg-gray-900/30 rounded-lg">
                        <h3 className="font-semibold text-lg text-white mb-2">Core Concept 1: Multi-Agent System (MAS)</h3>
                        <p className="text-sm text-gray-400">
                             At its heart, Xinovates simulates a diverse team of experts working on a new venture. Each AI agent has a unique role—from a researcher and strategist to a designer and financial planner. They collaborate, challenge each other, and build upon prior work, mirroring the dynamics of a high-performing human innovation team. This Multi-Agent System approach ensures that ideas are evaluated from multiple perspectives, reducing individual cognitive biases and leading to more robust, well-rounded outcomes.
                        </p>
                    </div>

                    <div className="p-4 bg-gray-900/30 rounded-lg">
                        <h3 className="font-semibold text-lg text-white mb-2">Core Concept 2: The Double Diamond Model</h3>
                        <p className="text-sm text-gray-400 mb-3">
                            We guide our AI agents through the Double Diamond, a renowned design process model from the UK's Design Council. This ensures we don't jump to solutions prematurely. The process has four distinct phases:
                        </p>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                            <li><strong className="text-white">Discover:</strong> The first diamond begins by exploring the problem space widely, gathering insights about the user and the market.</li>
                            <li><strong className="text-white">Define:</strong> The insights are then analyzed and synthesized to frame a clear and actionable problem statement.</li>
                            <li><strong className="text-white">Develop:</strong> The second diamond opens up again to brainstorm and develop multiple potential solutions to the defined problem.</li>
                            <li><strong className="text-white">Deliver:</strong> Finally, the process converges on a single, well-defined solution, which is then built out into a comprehensive venture plan with all necessary business deliverables.</li>
                        </ul>
                        <DoubleDiamondDiagram />
                    </div>
                    
                    <section id="ai-dd" aria-labelledby="ai-dd-title" className="p-4 bg-gray-900/30 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="font-semibold text-lg text-white">
                                Core Concept 3: AI-Augmented Double Diamond
                            </h3>
                             <div className="flex items-center gap-2">
                                <button onClick={() => handleExport('svg')} title="Export as SVG" className="text-gray-400 hover:text-white transition-colors p-1"><DownloadIcon className="w-4 h-4"/> SVG</button>
                                <button onClick={() => handleExport('png')} title="Export as PNG" className="text-gray-400 hover:text-white transition-colors p-1"><DownloadIcon className="w-4 h-4"/> PNG</button>
                            </div>
                        </div>
                        <div ref={diagramContainerRef}>
                            <AiAugmentedDoubleDiamondDiagram onExport={handleExport} />
                        </div>
                        <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                            AI expands both halves of the Double Diamond. In the problem space, it widens discovery (faster landscape scans, richer user insight) and sharpens definition (risk/ethics checks, acceptance criteria). In the solution space, it multiplies ideation (design variants, data/market synthesis) and speeds convergence (unit economics, KPI modeling, validation). Xinovates orchestrates these AI agents while keeping human judgment in the loop, turning wider exploration into faster, better-founded decisions.
                        </p>
                    </section>


                    <div className="p-4 bg-gray-900/30 rounded-lg">
                        <h3 className="font-semibold text-lg text-white mb-2 flex items-center gap-2">
                            <AdjustmentsHorizontalIcon className="w-5 h-5" />
                            Core Concept 4: Agent Adjacency & Tuning
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Each agent's behavior is not fixed. It can be tuned using adjacency parameters that control what information it "sees" from other agents. This allows for different strategic outcomes from the same initial challenge.
                        </p>
                        <div className="space-y-3 text-sm">
                            <div>
                                <h4 className="font-semibold text-gray-200">Look-back Horizon (L)</h4>
                                <p className="text-gray-400">An integer determining how many direct predecessor agents are included in the context. A lower 'L' promotes focus and creativity, while a higher 'L' promotes consistency and grounding.</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-200">Cross-Diamond Reference (C)</h4>
                                <p className="text-gray-400">A boolean (0 or 1) allowing an agent in the Solution Space to reference key artifacts from the Problem Space (e.g., initial research). This helps ground solutions in market reality but can sometimes limit divergent thinking.</p>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <h4 className="font-semibold text-base text-gray-200 mb-2">Default Parameter Examples</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-900/50">
                                        <tr>
                                            <th className="p-2 font-semibold">Agent</th>
                                            <th className="p-2 font-semibold text-center">L</th>
                                            <th className="p-2 font-semibold text-center">C</th>
                                            <th className="p-2 font-semibold">Rationale</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-400">
                                        <tr className="border-t border-gray-700">
                                            <td className="p-2">Problem Synthesizer</td>
                                            <td className="p-2 text-center">3</td>
                                            <td className="p-2 text-center text-gray-500">N/A</td>
                                            <td className="p-2">Consolidates Research, Persona, and Empathy Map.</td>
                                        </tr>
                                        <tr className="border-t border-gray-700">
                                            <td className="p-2">Solution Ideation</td>
                                            <td className="p-2 text-center">1</td>
                                            <td className="p-2 text-center">0</td>
                                            <td className="p-2">Focuses solely on the Problem Statement for maximum creativity.</td>
                                        </tr>
                                        <tr className="border-t border-gray-700">
                                            <td className="p-2">Financial Planner</td>
                                            <td className="p-2 text-center">2</td>
                                            <td className="p-2 text-center">1</td>
                                            <td className="p-2">Uses Lean Canvas & VPC, plus initial Market Research for grounding.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold text-base text-gray-200 mb-2">Tuning for Different Strategies</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="p-3 bg-gray-800/50 rounded-lg">
                                    <h5 className="font-bold text-purple-400">High-Creativity / High-Risk</h5>
                                    <p className="text-xs text-gray-400 mt-1">Set <code className="bg-gray-900 px-1 rounded">Solution Ideation (L=1, C=0)</code>. This generates ideas based only on the core problem, ignoring market constraints found in research. This can lead to breakthrough concepts but may risk poor market fit.</p>
                                </div>
                                 <div className="p-3 bg-gray-800/50 rounded-lg">
                                    <h5 className="font-bold text-blue-400">Grounded & Market-Fit</h5>
                                    <p className="text-xs text-gray-400 mt-1">Set <code className="bg-gray-900 px-1 rounded">Solution Ideation (L=3, C=1)</code>. This forces the agent to consider the persona and empathy map, and cross-reference the initial market research, leading to safer, more incremental ideas that are easier to validate.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 bg-gray-900/30 rounded-lg">
                        <h3 className="font-semibold text-lg text-white mb-3">The Agent Team in Detail</h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Each agent in the Multi-Agent System has a specific function. Click on any agent to learn more about its role in the innovation process.
                        </p>
                        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/20">
                            {AGENT_DEFINITIONS.map((agent, index) => (
                                <AgentDetailAccordionItem 
                                    key={agent.role} 
                                    agent={agent}
                                    index={index}
                                    openIndex={openIndex}
                                    setOpenIndex={setOpenIndex}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                        <h3 className="font-semibold text-lg text-white mb-3 text-center">Further Reading & Academic Foundation</h3>
                         <p className="text-sm text-gray-400 mb-6 text-center max-w-xl mx-auto">
                            This methodology is grounded in academic research on innovation, strategy, and artificial intelligence. For a deeper dive, please see the following resources.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                            <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col justify-between">
                                 <div>
                                    <p className="font-bold text-blue-300">Future of Innovation by the Impact of AI</p>
                                     <p className="text-sm text-gray-400 mt-2">Reza Kalantarinejad & Marc J Ventresca</p>
                                     <p className="text-xs text-gray-500">Saïd Business School, University of Oxford</p>
                                 </div>
                                <p className="text-xs text-gray-500 mt-3">(Academic Paper)</p>
                            </div>
                             <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col justify-between">
                                <div>
                                    <h4 className="font-semibold text-blue-300">Accessible Overview</h4>
                                    <p className="text-sm text-gray-400 mt-2">For a summary of the research and its implications, read the feature on Oxford Answers.</p>
                                </div>
                                <div className="mt-4">
                                    <a 
                                        href="https://www.sbs.ox.ac.uk/oxford-answers/how-ai-transforming-innovation-three-scenarios" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm primary-button text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                                    >
                                        <BookOpenIcon className="w-4 h-4"/>
                                        Read on Oxford Answers
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScienceModal;