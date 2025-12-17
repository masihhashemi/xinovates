


import React, { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import { 
    Agent, AllCritiquesOutput, LeanCanvasOutput, ValuePropositionCanvasOutput, StoryboardOutput, 
    FinancialPlanningOutput, RiskAnalysisOutput, TechnicalArchitectOutput, GoToMarketOutput, 
    ResearchOutput, GroundingSource, CustomerPersonaOutput, EmpathyMapCanvasOutput, StrategyOutput, 
    ProblemStatementOutput, IdeationOutput, SolutionSelectionOutput, RedTeamOutput, EthicsOracleOutput, 
    FounderDnaOutput, FounderInput, UsageMetrics, SuccessScoreOutput, SWOTAnalysis, CompetitorDetail,
    EthicalConsiderationDetail,
    IpStrategyOutput,
    TechnologyResearchOutput,
    TalentStrategyOutput,
    TeamCapabilityScore,
    IdealCoFounderProfile,
    SuggestedFounderProfile,
    CompetitorAnalysis,
    CompetitorPositioning,
    AdvantageRadarScore,
    VentureAnalystOutput,
    SolutionScoringOutput,
    FounderAnalysisProfile,
    InvestmentMemoOutput
} from '../types';
import { 
    FilmIcon,
    KeyIcon, TagIcon, TrendingUpIcon, LightBulbIcon, UserCircleIcon, BeakerIcon, ChartPieIcon, 
    ShieldCheckIcon, RocketLaunchIcon, BookOpenIcon, UsersIcon, CheckCircleIcon, ExclamationTriangleIcon, 
    LinkIcon, ThumbsDownIcon, ThumbsUpIcon, FlagIcon, GiftIcon, HeartIcon, BoltIcon, ChartBarIcon, 
    CubeTransparentIcon, ExclamationCircleIcon, FaceSmileIcon, IdentificationIcon, TargetIcon, 
    ScaleIcon, StarIcon, CloudIcon, ChipIcon, CheckIcon, 
    SparklesIcon, PuzzlePieceIcon, PaperAirplaneIcon, ChatBubbleLeftRightIcon, ArrowPathIcon, DocumentTextIcon,
    TableCellsIcon,
    AcademicCapIcon,
    MagnifyingGlassIcon,
    ChevronRightIcon
} from './Icons';
import CumulativeFcffChart from './FinalReportView';
import Spinner from './Spinner';

// --- Reusable UI Components for Canvases ---

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode; isPrintable?: boolean, className?: string }> = ({ title, children, icon, isPrintable = false, className = '' }) => (
    <div className={`printable-section ${className}`}>
        <h3 className={`font-bold mb-4 flex items-center gap-3 ${isPrintable ? 'text-2xl text-gray-800' : 'text-xl text-white'}`}>
            {icon}
            {title}
        </h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const Pill: React.FC<{ children: React.ReactNode; className?: string, isPrintable?: boolean }> = ({ children, className, isPrintable = false }) => (
    <span className={`inline-block rounded-full px-3 py-1 font-semibold ${isPrintable ? 'text-xs' : 'text-sm'} ${className}`}>
        {children}
    </span>
);

const Card: React.FC<{children: React.ReactNode, isPrintable?: boolean, className?: string}> = ({ children, isPrintable=false, className="" }) => (
    <div className={`${isPrintable ? 'bg-gray-50 border border-gray-200' : 'bg-gray-900/50 themed-border-light'} p-4 rounded-lg ${className}`}>
        {children}
    </div>
);

const parseCurrencyToNumber = (value: string): number => {
    if (!value || typeof value !== 'string') return 0;
    const num = parseFloat(value.replace(/[^0-9.-]+/g,""));
    if (isNaN(num)) return 0;
    
    const upperValue = value.toUpperCase();
    if (upperValue.includes('TRILLION')) return num * 1_000_000_000_000;
    if (upperValue.includes('BILLION') || upperValue.includes('B')) return num * 1_000_000_000;
    if (upperValue.includes('MILLION') || upperValue.includes('M')) return num * 1_000_000;
    if (upperValue.includes('THOUSAND') || upperValue.includes('K')) return num * 1_000;

    return num;
};

const formatCurrencySimple = (value: number, decimals = 0): string => {
    if (isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

export const ResearchCanvas: React.FC<{ data: ResearchOutput }> = ({ data }) => (
    <Card>
        <Section title="Research Summary" icon={<BookOpenIcon className="w-6 h-6" />}>
            <p className="text-sm text-gray-400">{data.problemSummary}</p>
        </Section>
    </Card>
);

export const IdeationCanvas: React.FC<{ data: IdeationOutput }> = ({ data }) => (
    <Card>
        <Section title="Brainstormed Solutions" icon={<LightBulbIcon className="w-6 h-6" />}>
            <div className="space-y-4">
                {data.solutions.map(s => (
                    <div key={s.id} className="p-3 bg-gray-900/50 rounded-lg">
                        <h4 className="font-semibold text-gray-200">{s.title}</h4>
                        <p className="text-sm text-gray-400">{s.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    </Card>
);

export const CritiqueCanvas: React.FC<{ data: AllCritiquesOutput }> = ({ data }) => (
    <Card>
        <Section title="Solution Critiques" icon={<ShieldCheckIcon className="w-6 h-6" />}>
            <div className="space-y-4">
                {data.map(c => (
                    <div key={c.solutionId} className="p-3 bg-gray-900/50 rounded-lg">
                        <h4 className="font-semibold text-gray-200">Critique for Solution #{c.solutionId}</h4>
                        <div className="mt-2">
                            <h5 className="font-semibold text-red-400 text-sm">Devil's Advocate</h5>
                            <ul className="list-disc list-inside text-xs text-gray-400">
                                {c.devilsAdvocate.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        </div>
                        <div className="mt-2">
                            <h5 className="font-semibold text-blue-400 text-sm">Steve Jobs</h5>
                            <ul className="list-disc list-inside text-xs text-gray-400">
                                {c.steveJobs.questions.map((q, i) => <li key={i}>{q}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    </Card>
);

// --- Component Implementations ---

export const InnovationVennDiagram: React.FC<{ data: SuccessScoreOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    const pillarData = data.pillarScores;
    const desirability = pillarData.find(p => p.pillar === 'Desirability')?.score || 0;
    const feasibility = pillarData.find(p => p.pillar === 'Feasibility')?.score || 0;
    const viability = pillarData.find(p => p.pillar === 'Viability')?.score || 0;
    const integrity = pillarData.find(p => p.pillar === 'Impact Integrity')?.score || 0;

    const PillarCircle: React.FC<{ cx: number, cy: number, score: number, color: string, name: string }> = ({ cx, cy, score, color, name }) => (
        <g>
            <circle cx={cx} cy={cy} r="60" fill={color} opacity={0.1} />
            <circle cx={cx} cy={cy} r={60 * (score / 100)} fill={color} opacity={0.6} stroke={color} strokeWidth="2" />
            <text x={cx} y={cy - 5} textAnchor="middle" fill={isPrintable ? '#1f2937' : 'white'} fontSize="14" fontWeight="bold">{name}</text>
            <text x={cx} y={cy + 15} textAnchor="middle" fill={isPrintable ? '#1f2937' : 'white'} fontSize="16" fontWeight="bold">{score}</text>
        </g>
    );

    return (
        <Section title="Innovation Viability Framework" icon={<SparklesIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="flex justify-center items-center">
                <svg viewBox="0 0 400 250" className="w-full max-w-lg font-sans">
                    <PillarCircle cx={120} cy={80} score={desirability} color="#f472b6" name="Desirability" />
                    <PillarCircle cx={280} cy={80} score={feasibility} color="#60a5fa" name="Feasibility" />
                    <PillarCircle cx={120} cy={170} score={viability} color="#4ade80" name="Viability" />
                    <PillarCircle cx={280} cy={170} score={integrity} color="#facc15" name="Integrity" />
                    
                    <text x="200" y="125" textAnchor="middle" fill={isPrintable ? '#1f2937' : 'white'} fontSize="24" fontWeight="bold">
                        {data.scoreLevel}
                    </text>
                </svg>
            </div>
        </Section>
    );
};

const MiniStoryboard: React.FC<{ data: StoryboardOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    return (
        <Card isPrintable={isPrintable} className="mb-6">
            <h4 className={`font-bold mb-4 flex items-center gap-2 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>
                <FilmIcon className="w-5 h-5 text-purple-400" />
                Solution at a Glance
            </h4>
            <div className="flex flex-col sm:flex-row gap-4 overflow-x-auto pb-2 items-stretch">
                {data.panels.map((panel, index) => (
                    <React.Fragment key={panel.panel}>
                        <div className="flex-1 min-w-[140px] flex flex-col items-center text-center">
                            <div className={`w-full aspect-video rounded-md overflow-hidden mb-2 ${isPrintable ? 'bg-gray-200' : 'bg-gray-800'} shadow-sm`}>
                                {panel.imageB64 ? (
                                    <img src={`data:image/jpeg;base64,${panel.imageB64}`} alt={panel.scene} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        <FilmIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                )}
                            </div>
                            <p className={`text-xs font-semibold leading-tight ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>
                                {panel.scene}
                            </p>
                        </div>
                        {index < data.panels.length - 1 && (
                            <div className="hidden sm:flex items-center justify-center text-gray-500">
                                <ChevronRightIcon className="w-5 h-5 opacity-50" />
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </Card>
    );
};

export const InfographicOverviewCanvas: React.FC<{
    financialPlan: FinancialPlanningOutput | null;
    leanCanvas: LeanCanvasOutput | null;
    problemStatement: ProblemStatementOutput | null;
    selectedSolution: SolutionSelectionOutput | null;
    customerPersona: CustomerPersonaOutput | null;
    strategy: StrategyOutput | null;
    research: ResearchOutput | null;
    technicalBlueprint: TechnicalArchitectOutput | null;
    successScore: SuccessScoreOutput | null;
    storyboard?: StoryboardOutput | null;
}> = ({ financialPlan, leanCanvas, problemStatement, selectedSolution, customerPersona, strategy, successScore, storyboard }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            {financialPlan && <ElevatorPitchView data={financialPlan} />}
            
            {storyboard && <MiniStoryboard data={storyboard} />}

            {successScore && (
                 <Card>
                    <InnovationVennDiagram data={successScore} />
                 </Card>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {problemStatement && customerPersona && (
                    <Card>
                        <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><TargetIcon className="w-5 h-5 text-red-400"/> The Problem & Persona</h4>
                        <p className="text-sm font-semibold text-blue-300 mb-2">{problemStatement.problemStatement}</p>
                        <p className="text-sm text-gray-400">Focused on <strong className="text-white">{customerPersona.name}</strong>, a {customerPersona.age}-year-old {customerPersona.occupation}.</p>
                    </Card>
                 )}
                 {selectedSolution && (
                     <Card>
                         <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><LightBulbIcon className="w-5 h-5 text-yellow-400"/> The Solution</h4>
                         <p className="text-sm font-semibold text-yellow-300 mb-2">{selectedSolution.solutionTitle}</p>
                         <p className="text-sm text-gray-400">{selectedSolution.solutionDescription}</p>
                     </Card>
                 )}
                 {leanCanvas && (
                     <Card>
                         <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><KeyIcon className="w-5 h-5 text-purple-400"/> Unique Value Proposition</h4>
                         <p className="text-sm text-gray-300">{leanCanvas.uniqueValueProposition[0]}</p>
                     </Card>
                 )}
                 {financialPlan && (
                     <Card>
                         <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><ChartBarIcon className="w-5 h-5 text-green-400"/> Market & Financials</h4>
                         <p className="text-sm text-gray-400">Targeting a <strong className="text-white">{financialPlan.marketSize.serviceableObtainableMarket}</strong> market, with a projected Year 5 revenue of <strong className="text-white">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(financialPlan.cashFlowModel.cashFlows[4]?.revenue)}</strong>.</p>
                     </Card>
                 )}
                 {strategy && (
                     <Card>
                         <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><BoltIcon className="w-5 h-5 text-teal-400"/> Unfair Advantage</h4>
                         <p className="text-sm text-gray-300">{strategy.unfairAdvantage}</p>
                     </Card>
                 )}
                 {successScore && (
                     <Card>
                         <h4 className="font-bold text-lg text-gray-200 mb-3 flex items-center gap-2"><StarIcon className="w-5 h-5 text-yellow-400"/> Success Score</h4>
                         <div className="flex items-baseline gap-2">
                             <span className="text-3xl font-bold text-white">{successScore.overallScore}</span>
                             <span className="text-gray-400">/ 1000</span>
                             <Pill className={`text-white ${successScore.scoreLevel === 'Excellent' || successScore.scoreLevel === 'High' ? 'bg-green-600/50' : 'bg-yellow-600/50'}`}>{successScore.scoreLevel}</Pill>
                         </div>
                     </Card>
                 )}
            </div>
        </div>
    );
};

export const ElevatorPitchView: React.FC<{data: FinancialPlanningOutput, isPrintable?: boolean}> = ({ data, isPrintable=false }) => (
    <div className={`relative rounded-xl overflow-hidden p-8 flex items-center justify-center text-center ${isPrintable ? 'h-[200px]' : 'min-h-[250px]'}`}>
        {data.elevatorPitchImageB64 && (
            <img src={`data:image/jpeg;base64,${data.elevatorPitchImageB64}`} alt="Elevator Pitch Background" className="absolute inset-0 w-full h-full object-cover"/>
        )}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-2xl">
            <h3 className={`font-bold ${isPrintable ? 'text-2xl' : 'text-3xl'} text-white`}>{data.selectedBrandName}</h3>
            <p className={`mt-3 ${isPrintable ? 'text-base' : 'text-lg'} text-gray-200`}>{data.elevatorPitch}</p>
        </div>
    </div>
);

export const FounderDnaCanvas: React.FC<{ analysis: FounderDnaOutput; founders: FounderInput[] | null, isPrintable?: boolean }> = ({ analysis, founders, isPrintable = false }) => {
    return (
        <div className="space-y-6">
            <Card isPrintable={isPrintable}>
                <h4 className={`font-bold mb-2 ${isPrintable ? 'text-base text-gray-800' : 'text-lg text-gray-200'}`}>Team Archetype: {analysis.teamArchetype}</h4>
                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-gray-400'}`}>{analysis.collaborationStyle}</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card isPrintable={isPrintable}>
                    <h4 className={`font-bold mb-3 ${isPrintable ? 'text-base text-gray-800' : 'text-lg text-green-400'}`}>Team Strengths</h4>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-gray-300'}`}>
                        {analysis.teamStrengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card>
                <Card isPrintable={isPrintable}>
                     <h4 className={`font-bold mb-3 ${isPrintable ? 'text-base text-gray-800' : 'text-lg text-yellow-400'}`}>Potential Gaps</h4>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-gray-300'}`}>
                        {analysis.potentialGaps.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </Card>
            </div>
            <div>
                 <h4 className={`font-bold mb-4 ${isPrintable ? 'text-xl text-gray-800' : 'text-xl text-white'}`}>Founder Profiles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.founderProfiles.map((profile, i) => {
                        const founderInput = founders?.find(f => f.name === profile.name);
                        return (
                            <Card key={i} isPrintable={isPrintable}>
                                <div className="flex items-center gap-4 mb-3">
                                    {founderInput?.photoB64 && (
                                        <img src={founderInput.photoB64} alt={profile.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0"/>
                                    )}
                                    <div>
                                        <h5 className={`font-bold ${isPrintable ? 'text-lg text-gray-800' : 'text-xl text-white'}`}>{profile.name}</h5>
                                        <p className={`${isPrintable ? 'text-sm text-blue-600' : 'text-base text-blue-400 font-semibold'}`}>{profile.founderType}</p>
                                    </div>
                                </div>
                                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-gray-400'}`}>{profile.strengthsAndStyle}</p>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const CandidateCard: React.FC<{ candidate: SuggestedFounderProfile }> = ({ candidate }) => (
    <div className="p-3 bg-gray-900/50 rounded-lg">
        <div className="flex justify-between items-start gap-2">
            <div>
                <p className="font-semibold text-gray-200 text-sm">{candidate.name}</p>
                <p className="text-xs text-gray-400">{candidate.currentRole} at {candidate.company}</p>
            </div>
            <a href={candidate.profileUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-1.5 text-gray-400 hover:text-white transition-colors" title="View Public Profile">
                <LinkIcon className="w-4 h-4" />
            </a>
        </div>
        <p className="text-xs text-gray-500 italic mt-2">Justification: {candidate.justification}</p>
    </div>
);

export const IdealCoFounderCanvas: React.FC<{ 
    data: TalentStrategyOutput, 
    isPrintable?: boolean,
    onSuggestCandidates?: (profile: IdealCoFounderProfile) => void;
    isScouting?: string | null;
    scoutError?: Record<string, string | null>;
}> = ({ data, isPrintable = false, onSuggestCandidates = (_profile) => {}, isScouting = null, scoutError = {} }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Ideal Co-Founder Profiles" icon={<UsersIcon className="w-6 h-6" />} isPrintable={isPrintable}>
            <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.summary}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {data.idealCoFounders.map((profile, i) => {
                    const isLoading = isScouting === profile.roleTitle;
                    const error = scoutError[profile.roleTitle];

                    return (
                        <Card key={i} isPrintable={isPrintable}>
                            <h4 className={`font-bold ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>{profile.roleTitle}</h4>
                            <p className={`font-semibold ${isPrintable ? 'text-sm text-purple-600' : 'text-sm text-purple-400'}`}>{profile.archetype}</p>
                            <div className="mt-4 space-y-3">
                                <div>
                                    <h5 className={`font-semibold ${isPrintable ? 'text-sm text-gray-700' : 'text-sm text-gray-300'}`}>Key Responsibilities</h5>
                                    <ul className={`list-disc list-inside text-xs ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {profile.keyResponsibilities.map((r, j) => <li key={j}>{r}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className={`font-semibold ${isPrintable ? 'text-sm text-gray-700' : 'text-sm text-gray-300'}`}>Skills & Experience</h5>
                                    <ul className={`list-disc list-inside text-xs ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {profile.requiredSkillsAndExperience.map((s, j) => <li key={j}>{s}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className={`font-semibold ${isPrintable ? 'text-sm text-gray-700' : 'text-sm text-gray-300'}`}>Complementary Traits</h5>
                                    <ul className={`list-disc list-inside text-xs ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {profile.complementaryTraits.map((t, j) => <li key={j}>{t}</li>)}
                                    </ul>
                                </div>
                            </div>
                            
                             {!isPrintable && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                    {isLoading && <div className="flex items-center gap-2 text-sm text-gray-400"><Spinner/> <span>Scouting candidates...</span></div>}
                                    {error && <p className="text-sm text-red-400">{error}</p>}

                                    {profile.suggestedCandidates && profile.suggestedCandidates.length > 0 && (
                                        <div className="space-y-3">
                                            <h5 className="font-semibold text-sm text-gray-300">Suggested Candidate Examples</h5>
                                            {profile.suggestedCandidates.map((candidate, idx) => (
                                                <CandidateCard key={idx} candidate={candidate} />
                                            ))}
                                            <p className="text-xs text-gray-500 pt-2">
                                                *These suggestions are AI-generated based on publicly available data for inspirational and research purposes only. This is not a recruitment endorsement.
                                            </p>
                                        </div>
                                    )}

                                    {!isLoading && !error && !profile.suggestedCandidates && (
                                        <button 
                                            onClick={() => onSuggestCandidates(profile)}
                                            className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            <MagnifyingGlassIcon className="w-4 h-4" />
                                            Suggest Potential Candidates
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>
        </Section>
    </Card>
);

const TeamSpiderChart: React.FC<{
    currentTeam: TeamCapabilityScore[];
    idealTeam: TeamCapabilityScore[];
    isPrintable?: boolean;
}> = ({ currentTeam, idealTeam, isPrintable = false }) => {
    const size = 320;
    const center = size / 2;
    const labels = currentTeam.map(s => s.dimension);
    const numLabels = labels.length;
    const angleSlice = (Math.PI * 2) / numLabels;
    const radius = center * 0.75;

    const getPoint = (value: number, index: number) => {
        const angle = angleSlice * index - Math.PI / 2;
        const r = (value / 10) * radius; // score is 1-10
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        };
    };

    const currentTeamPoints = currentTeam.map((score, i) => {
        const { x, y } = getPoint(score.score, i);
        return `${x},${y}`;
    }).join(' ');

    const idealTeamPoints = idealTeam.map((score, i) => {
        const { x, y } = getPoint(score.score, i);
        return `${x},${y}`;
    }).join(' ');

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
                        stroke={isPrintable ? '#e5e7eb' : '#4b5563'}
                        strokeWidth="1"
                    />
                ))}

                {/* Axes and Labels */}
                {labels.map((label, i) => {
                    const point = getPoint(11.5, i);
                    const axisEnd = getPoint(10, i);
                    return (
                        <g key={label}>
                            <line x1={center} y1={center} x2={axisEnd.x} y2={axisEnd.y} stroke={isPrintable ? '#e5e7eb' : '#4b5563'} strokeWidth="1" />
                            <text
                                x={point.x}
                                y={point.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={isPrintable ? '#374151' : '#d1d5db'}
                                fontSize="10"
                                fontWeight="bold"
                            >
                                {label.replace(' & ', '&').replace(' ', '\n')}
                            </text>
                        </g>
                    );
                })}

                {/* Data Polygons */}
                <polygon
                    points={currentTeamPoints}
                    fill="rgba(250, 173, 20, 0.3)" // orange
                    stroke="#fb923c"
                    strokeWidth="2"
                />
                 <polygon
                    points={idealTeamPoints}
                    fill="rgba(74, 222, 128, 0.3)" // green
                    stroke="#4ade80"
                    strokeWidth="2"
                />
            </svg>
            
            <div className="flex justify-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#fb923c]" />
                    <span className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>Current Team</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                    <span className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>Ideal Team</span>
                </div>
            </div>
        </div>
    );
};

export const TeamCompositionCanvas: React.FC<{ data: TalentStrategyOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    const { currentTeam, idealTeam } = data.teamCapabilityAnalysis;
    return (
        <Card isPrintable={isPrintable}>
            <Section title="Team Capability Analysis" icon={<ChartBarIcon className="w-6 h-6" />} isPrintable={isPrintable}>
                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    This analysis compares the current founding team's capabilities against the ideal team composition required to successfully execute the venture. The scores (1-10) highlight areas of strength and gaps to be filled.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <TeamSpiderChart currentTeam={currentTeam} idealTeam={idealTeam} isPrintable={isPrintable} />
                    <div className="space-y-3">
                        {currentTeam.map((item, index) => (
                            <div key={item.dimension}>
                                <h5 className={`font-semibold ${isPrintable ? 'text-sm text-gray-700' : 'text-sm text-gray-300'}`}>{item.dimension}</h5>
                                <p className={`text-xs ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                    <span className="font-bold text-[#fb923c]">Current: {item.score}/10</span> vs. <span className="font-bold text-[#4ade80]">Ideal: {idealTeam[index].score}/10</span>
                                </p>
                                <p className={`text-xs ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>{item.justification}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </Card>
    );
};

export const VentureAnalystCanvas: React.FC<{ data: VentureAnalystOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Venture Analysis" icon={<ScaleIcon className="w-6 h-6" />} isPrintable={isPrintable}>
            <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.debateSummary}</p>
            <div className="mt-4">
                <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Solution Rankings</h4>
                <div className="space-y-3">
                    {data.rankedSolutions.map((solution) => (
                        <div key={solution.id} className={`p-3 rounded-lg ${solution.rank === 1 ? (isPrintable ? 'bg-green-100 border border-green-200' : 'bg-green-900/20 border border-green-500/30') : (isPrintable ? 'bg-gray-100' : 'bg-gray-900/50')}`}>
                            <h5 className={`font-bold ${isPrintable ? 'text-gray-800' : 'text-white'}`}>#{solution.rank}: {solution.title}</h5>
                            <p className={`text-xs mt-1 ${isPrintable ? 'text-gray-600' : 'text-gray-500'}`}>Justification: {solution.justification}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    </Card>
);

export const ProblemStatementCanvas: React.FC<{ data: ProblemStatementOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Problem Statement" icon={<TargetIcon className="w-6 h-6" />} isPrintable={isPrintable}>
            <blockquote className={`${isPrintable ? 'border-l-4 border-blue-300 p-4 bg-blue-50' : 'border-l-4 border-blue-500 p-4 bg-gray-900/50'} my-4`}>
                <p className={`font-semibold ${isPrintable ? 'text-xl text-blue-800' : 'text-2xl text-blue-300'}`}>
                    "{data.problemStatement}"
                </p>
            </blockquote>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                    <h5 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Context</h5>
                    <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.context}</p>
                </div>
                <div>
                    <h5 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>User Impact</h5>
                    <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.userImpact}</p>
                </div>
            </div>
            <div className="mt-4">
                <h5 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Key Insights</h5>
                <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    {data.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
                </ul>
            </div>
        </Section>
    </Card>
);

export const CustomerPersonaCanvas: React.FC<{ data: CustomerPersonaOutput, isPrintable?: boolean, onInterview?: () => void }> = ({ data, isPrintable = false, onInterview }) => (
    <Card isPrintable={isPrintable}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 text-center">
                {data.avatarB64 ? (
                    <img src={`data:image/jpeg;base64,${data.avatarB64}`} alt={data.name} className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto flex items-center justify-center">
                        <UserCircleIcon className="w-20 h-20 text-gray-500"/>
                    </div>
                )}
                <h4 className={`mt-4 font-bold ${isPrintable ? 'text-xl text-gray-800' : 'text-xl text-white'}`}>{data.name}, {data.age}</h4>
                <p className={`${isPrintable ? 'text-base text-gray-600' : 'text-base text-gray-400'}`}>{data.occupation}</p>
                 {!isPrintable && onInterview && (
                    <button onClick={onInterview} className="mt-4 flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        <ChatBubbleLeftRightIcon className="w-5 h-5"/>
                        Interview
                    </button>
                )}
            </div>
            <div className="flex-grow space-y-4">
                <p className={`italic ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>"{data.bio}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 className={`font-semibold mb-2 ${isPrintable ? 'text-green-700' : 'text-green-400'}`}>Goals</h5>
                        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                            {data.goals.map((g, i) => <li key={i}>{g}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h5 className={`font-semibold mb-2 ${isPrintable ? 'text-red-700' : 'text-red-400'}`}>Frustrations</h5>
                        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                            {data.frustrations.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </Card>
);

const EmpathyMapBlock: React.FC<{ title: string; items: string[]; isPrintable?: boolean, className?: string }> = ({ title, items, isPrintable=false, className="" }) => (
    <div className={`p-4 rounded-lg h-full ${className}`}>
        <h4 className={`font-bold mb-2 ${isPrintable ? 'text-base text-gray-700' : 'text-base text-gray-300'}`}>{title}</h4>
        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);

export const EmpathyMapCanvas: React.FC<{ data: EmpathyMapCanvasOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
     <Card isPrintable={isPrintable}>
        <Section title="Empathy Map" icon={<FaceSmileIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-700/50">
                <EmpathyMapBlock title="Says" items={data.says} isPrintable={isPrintable} className={isPrintable ? 'bg-gray-50' : 'bg-gray-800'}/>
                <EmpathyMapBlock title="Thinks" items={data.thinks} isPrintable={isPrintable} className={isPrintable ? 'bg-gray-50' : 'bg-gray-800'}/>
                <EmpathyMapBlock title="Does" items={data.does} isPrintable={isPrintable} className={isPrintable ? 'bg-gray-50' : 'bg-gray-800'}/>
                <EmpathyMapBlock title="Feels" items={data.feels} isPrintable={isPrintable} className={isPrintable ? 'bg-gray-50' : 'bg-gray-800'}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <Card isPrintable={isPrintable}>
                    <h4 className={`font-bold mb-2 ${isPrintable ? 'text-red-700' : 'text-red-400'}`}>Pains</h4>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                        {data.pains.map((p, i) => <li key={i}>{p}</li>)}
                    </ul>
                </Card>
                 <Card isPrintable={isPrintable}>
                     <h4 className={`font-bold mb-2 ${isPrintable ? 'text-green-700' : 'text-green-400'}`}>Gains</h4>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                        {data.gains.map((g, i) => <li key={i}>{g}</li>)}
                    </ul>
                </Card>
            </div>
        </Section>
    </Card>
);

export const SolutionSelectionCanvas: React.FC<{ data: SolutionSelectionOutput, allSolutions?: IdeationOutput | null, allCritiques?: AllCritiquesOutput | null, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Selected Solution" icon={<CheckCircleIcon className="w-6 h-6" />} isPrintable={isPrintable}>
             <blockquote className={`${isPrintable ? 'border-l-4 border-yellow-300 p-4 bg-yellow-50' : 'border-l-4 border-yellow-500 p-4 bg-gray-900/50'} my-4`}>
                <h4 className={`font-bold ${isPrintable ? 'text-xl text-yellow-800' : 'text-xl text-yellow-300'}`}>{data.solutionTitle}</h4>
                <p className={`mt-2 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.solutionDescription}</p>
            </blockquote>
             <p className={`mt-4 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}><strong className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>Justification:</strong> {data.justification}</p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                 <div>
                     <h5 className={`font-semibold mb-2 flex items-center gap-2 ${isPrintable ? 'text-green-700' : 'text-green-400'}`}><ThumbsUpIcon className="w-5 h-5"/> Pros</h5>
                     <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                         {data.pros.map((p, i) => <li key={i}>{p}</li>)}
                     </ul>
                 </div>
                 <div>
                     <h5 className={`font-semibold mb-2 flex items-center gap-2 ${isPrintable ? 'text-red-700' : 'text-red-400'}`}><ThumbsDownIcon className="w-5 h-5"/> Cons</h5>
                     <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                         {data.cons.map((c, i) => <li key={i}>{c}</li>)}
                     </ul>
                 </div>
            </div>
            {data.history && data.history.length > 0 && (
                <div className="mt-6">
                    <h5 className={`font-semibold mb-3 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Refinement History</h5>
                     <div className="border-l-2 border-gray-700 pl-4 space-y-4">
                        {data.history.map((item, index) => (
                            <div key={index} className="relative pl-4">
                                <div className="absolute -left-5 top-1.5 w-2.5 h-2.5 rounded-full bg-gray-600"></div>
                                <p className="text-sm font-semibold text-gray-400">V{index + 1}: {item.title}</p>
                                <p className="text-xs text-gray-500 italic mt-1">{item.description}</p>
                                <p className="text-xs text-gray-500 mt-1"><strong>Reasoning:</strong> {item.justification}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Section>
    </Card>
);

export const TechnologyScoutCanvas: React.FC<{ data: TechnologyResearchOutput, isPrintable?: boolean, onNavigate?: (index: number) => void }> = ({ data, isPrintable=false, onNavigate }) => {
    const getTrlPill = (trl: number) => {
        const color = trl >= 7 ? 'green' : trl >= 4 ? 'yellow' : 'red';
        const styles = {
            green: isPrintable ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300',
            yellow: isPrintable ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300',
            red: isPrintable ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300',
        };
        return <Pill isPrintable={isPrintable} className={styles[color]}>TRL: {trl}</Pill>;
    };

    const getComplexityPill = (complexity: 'Low' | 'Medium' | 'High') => {
        const styles = {
            Low: isPrintable ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300',
            Medium: isPrintable ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300',
            High: isPrintable ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300',
        };
        return <Pill isPrintable={isPrintable} className={styles[complexity]}>{complexity} Complexity</Pill>;
    };
    
    return (
        <Card isPrintable={isPrintable}>
            <Section title="Technology Scout Report" icon={<AcademicCapIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.summary}</p>

                <div className="mt-6">
                    <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Key Technologies</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {data.keyTechnologies.map((tech, i) => (
                            <Card key={i} isPrintable={isPrintable}>
                                <div className="flex justify-between items-start">
                                    <h5 className={`font-bold ${isPrintable ? 'text-base text-gray-800' : 'text-base text-white'}`}>{tech.name}</h5>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {getTrlPill(tech.trl)}
                                        {getComplexityPill(tech.implementationComplexity)}
                                    </div>
                                </div>
                                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-2`}>{tech.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {data.priorArt && data.priorArt.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Prior Art & Patent Landscape</h4>
                        <div className="space-y-3">
                            {data.priorArt.map((patent, i) => (
                                <Card key={i} isPrintable={isPrintable}>
                                    <a href={patent.link} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{patent.title}</a>
                                    <p className={`text-xs font-mono mt-1 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>{patent.patentId}</p>
                                    <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-2`}>{patent.summary}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
                 {data.leadingExperts && data.leadingExperts.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Leading Experts & Research Hubs</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.leadingExperts.map((expert, i) => (
                                <Card key={i} isPrintable={isPrintable}>
                                     <a href={expert.link} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{expert.name}</a>
                                     <p className={`text-sm mt-1 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{expert.affiliation}</p>
                                     <p className={`text-xs mt-1 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>Specialization: {expert.specialization}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

            </Section>
        </Card>
    );
};

const VPCBlock: React.FC<{ title: string; items: string[]; icon: React.ReactNode; isPrintable?: boolean; }> = ({ title, items, icon, isPrintable=false }) => (
    <div className={`p-4 ${isPrintable ? '' : ''}`}>
        <h4 className={`font-bold mb-2 flex items-center gap-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>{icon} {title}</h4>
        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

export const ValuePropositionCanvas: React.FC<{ data: ValuePropositionCanvasOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
     <Card isPrintable={isPrintable}>
        <Section title="Value Proposition Canvas" icon={<GiftIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
             <div className="flex flex-col md:flex-row items-stretch gap-4">
                 {/* Value Map */}
                 <div className={`flex-1 rounded-lg ${isPrintable ? 'bg-blue-50 border border-blue-200' : 'bg-gray-900/70'}`}>
                     <div className="p-4 border-b border-gray-700/50">
                        <h3 className={`font-bold text-center ${isPrintable ? 'text-lg text-blue-800' : 'text-lg text-blue-300'}`}>Value Map</h3>
                     </div>
                     <div className="p-4 space-y-4">
                         <VPCBlock title="Gain Creators" items={data.valueMap.gainCreators} icon={<SparklesIcon className="w-5 h-5 text-green-400" />} isPrintable={isPrintable}/>
                         <VPCBlock title="Pain Relievers" items={data.valueMap.painRelievers} icon={<ShieldCheckIcon className="w-5 h-5 text-yellow-400" />} isPrintable={isPrintable}/>
                         <VPCBlock title="Products & Services" items={data.valueMap.productsAndServices} icon={<CubeTransparentIcon className="w-5 h-5 text-gray-400" />} isPrintable={isPrintable}/>
                     </div>
                 </div>

                {/* Arrow */}
                 <div className="hidden md:flex items-center justify-center text-4xl font-thin text-gray-500">&rarr;</div>
                 <div className="flex md:hidden items-center justify-center text-4xl font-thin text-gray-500">&darr;</div>


                 {/* Customer Profile */}
                  <div className={`flex-1 rounded-lg ${isPrintable ? 'bg-orange-50 border border-orange-200' : 'bg-gray-900/70'}`}>
                     <div className="p-4 border-b border-gray-700/50">
                        <h3 className={`font-bold text-center ${isPrintable ? 'text-lg text-orange-800' : 'text-lg text-orange-300'}`}>Customer Profile</h3>
                     </div>
                     <div className="p-4 space-y-4">
                        <VPCBlock title="Gains" items={data.customer.gains} icon={<StarIcon className="w-5 h-5 text-green-400" />} isPrintable={isPrintable} />
                        <VPCBlock title="Pains" items={data.customer.pains} icon={<ExclamationCircleIcon className="w-5 h-5 text-red-400" />} isPrintable={isPrintable}/>
                        <VPCBlock title="Customer Jobs" items={data.customer.customerJobs} icon={<UserCircleIcon className="w-5 h-5 text-gray-400" />} isPrintable={isPrintable}/>
                     </div>
                 </div>
             </div>
        </Section>
    </Card>
);

const LeanCanvasBlock: React.FC<{ title: string; items: string[]; isPrintable?: boolean, className?: string }> = ({ title, items, isPrintable=false, className="" }) => (
    <div className={`${isPrintable ? 'bg-gray-50 border border-gray-200 p-3' : 'bg-gray-900/50 p-4'} rounded-lg h-full ${className}`}>
        <h4 className={`font-bold mb-2 ${isPrintable ? 'text-gray-700 text-sm' : 'text-gray-300'}`}>{title}</h4>
        <ul className={`space-y-1 ${isPrintable ? 'text-xs text-gray-600' : 'text-sm text-gray-400'}`}>
            {items.map((item, index) => <li key={index} className="break-words">- {item}</li>)}
        </ul>
    </div>
);

export const LeanCanvas: React.FC<{ data: LeanCanvasOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Lean Canvas" icon={<PuzzlePieceIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <LeanCanvasBlock title="Problem" items={data.problem} isPrintable={isPrintable} className="lg:col-span-1" />
                <LeanCanvasBlock title="Solution" items={data.solution} isPrintable={isPrintable} className="lg:col-span-1" />
                <LeanCanvasBlock title="Key Metrics" items={data.keyMetrics} isPrintable={isPrintable} className="lg:col-span-1" />
                <LeanCanvasBlock title="Unique Value Proposition" items={data.uniqueValueProposition} isPrintable={isPrintable} className="lg:col-span-2 row-span-2" />
                <LeanCanvasBlock title="Unfair Advantage" items={data.unfairAdvantage} isPrintable={isPrintable} className="lg:col-span-1" />
                <LeanCanvasBlock title="Channels" items={data.channels} isPrintable={isPrintable} className="lg:col-span-1" />
                <LeanCanvasBlock title="Customer Segments" items={data.customerSegments} isPrintable={isPrintable} className="lg:col-span-1" />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mt-4">
                <LeanCanvasBlock title="Cost Structure" items={data.costStructure} isPrintable={isPrintable} className="lg:col-span-2" />
                <LeanCanvasBlock title="Revenue Streams" items={data.revenueStreams} isPrintable={isPrintable} className="lg:col-span-3" />
            </div>
        </Section>
    </Card>
);

export const StoryboardReportCanvas: React.FC<{ data: StoryboardOutput, isPrintable?: boolean, onGenerateVideo?: () => void, onCancelVideoGeneration?: () => void, isGeneratingVideo?: boolean, videoGenerationProgress?: string[], generatedVideoUrl?: string | null, videoGenerationError?: string | null }> = ({ data, isPrintable = false, onGenerateVideo, onCancelVideoGeneration, isGeneratingVideo, videoGenerationProgress, generatedVideoUrl, videoGenerationError }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Customer Journey Storyboard" icon={<FilmIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <h4 className={`text-center font-bold mb-4 ${isPrintable ? 'text-2xl text-gray-800' : 'text-2xl text-white'}`}>{data.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {data.panels.map(panel => (
                    <div key={panel.panel} className={`rounded-lg overflow-hidden ${isPrintable ? 'border border-gray-200 bg-white' : 'bg-gray-900/50'}`}>
                        <div className="aspect-video bg-gray-700">
                            {panel.imageB64 && <img src={`data:image/jpeg;base64,${panel.imageB64}`} alt={panel.scene} className="w-full h-full object-cover"/>}
                        </div>
                        <div className="p-3">
                            <h5 className={`font-bold ${isPrintable ? 'text-sm text-gray-800' : 'text-sm text-white'}`}>{panel.panel}. {panel.scene}</h5>
                            <p className={`mt-1 ${isPrintable ? 'text-xs text-gray-600' : 'text-xs text-gray-400'}`}>{panel.narration}</p>
                        </div>
                    </div>
                ))}
            </div>
            {!isPrintable && onGenerateVideo && (
                 <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
                    <h4 className="font-semibold text-white">Generate Concept Video</h4>
                    <p className="text-sm text-gray-400 mt-1 mb-4">Bring this storyboard to life as a short animated video. Note: Video generation can take several minutes.</p>
                    
                    {generatedVideoUrl && (
                        <div className="mb-4">
                            <video src={generatedVideoUrl} controls className="w-full max-w-md mx-auto rounded-lg shadow-lg"></video>
                        </div>
                    )}

                     <div className="flex items-center gap-4">
                        <button onClick={onGenerateVideo} disabled={isGeneratingVideo} className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                            {isGeneratingVideo ? <Spinner/> : <SparklesIcon className="w-5 h-5"/>}
                            {generatedVideoUrl ? 'Regenerate Video' : 'Generate Video'}
                        </button>
                        {isGeneratingVideo && (
                             <button onClick={onCancelVideoGeneration} className="px-4 py-2 text-sm bg-red-800/80 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">
                                Cancel
                            </button>
                        )}
                    </div>

                    {(isGeneratingVideo && videoGenerationProgress.length > 0) && (
                        <div className="mt-4 text-xs text-gray-400 bg-gray-900 p-3 rounded-md">
                            <p className="font-semibold text-gray-300">Progress:</p>
                            <ul className="list-disc list-inside mt-1">
                                {videoGenerationProgress.map((msg, i) => <li key={i}>{msg}</li>)}
                            </ul>
                        </div>
                    )}
                    {videoGenerationError && <p className="mt-3 text-sm text-red-400">{videoGenerationError}</p>}
                </div>
            )}
        </Section>
    </Card>
);

const CostPieChart: React.FC<{ breakdown: { category: string; estimatedAnnualCost: string; }[], isPrintable?: boolean }> = ({ breakdown, isPrintable = false }) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];
    
    const data = breakdown.map(item => ({
        category: item.category,
        value: parseCurrencyToNumber(item.estimatedAnnualCost)
    }));
    
    const total = data.reduce((acc, item) => acc + item.value, 0);

    if (total === 0) {
        return <div className={`text-center text-sm ${isPrintable ? 'text-gray-500' : 'text-gray-400'}`}>No cost data to display.</div>;
    }

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    let cumulativePercent = 0;
    const slices = data.map((item, index) => {
        const percent = item.value / total;
        const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
        cumulativePercent += percent;
        const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        return {
            path: `M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} L 0 0`,
            color: colors[index % colors.length],
            category: item.category,
            percentage: (percent * 100).toFixed(1),
            value: item.value
        };
    });

    return (
        <div className={`p-4 rounded-lg ${isPrintable ? 'bg-gray-50' : 'bg-gray-900/50'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="flex justify-center">
                    <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)' }} className="w-40 h-40">
                        {slices.map((slice, i) => (
                            <path key={i} d={slice.path} fill={slice.color} />
                        ))}
                    </svg>
                </div>
                <div className="text-xs space-y-2">
                    {slices.map((slice, i) => (
                        <div key={i} className={`flex items-center justify-between py-1 ${isPrintable ? 'border-b border-gray-200' : 'border-b border-gray-700/50'} last:border-b-0`}>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }}></span>
                                <span className={`${isPrintable ? 'text-gray-700' : 'text-gray-300'} truncate`} title={slice.category}>{slice.category}</span>
                            </div>
                            <div className="text-right flex-shrink-0 ml-2">
                                <span className={`font-semibold ${isPrintable ? 'text-gray-800' : 'text-white'}`}>{slice.percentage}%</span>
                                <span className={`font-mono ml-2 ${isPrintable ? 'text-gray-600' : 'text-gray-500'}`}>{formatCurrencySimple(slice.value, 0)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MarketSizeDiagram: React.FC<{ marketSize: FinancialPlanningOutput['marketSize'], isPrintable?: boolean }> = ({ marketSize, isPrintable = false }) => {
    const textPrimaryColor = isPrintable ? '#1f2937' : '#ffffff';
    const textSecondaryColor = isPrintable ? '#4b5563' : '#d1d5db';
    
    // Text colors inspired by the user's image for good contrast
    const pamTextFill = isPrintable ? '#dc2626' : '#f87171'; // Red on light blue/lavender
    const tamTextFill = isPrintable ? '#ffffff' : '#ffffff'; // White on red
    const samTextFill = isPrintable ? '#dc2626' : '#f87171'; // Red on light beige
    const somTextFill = isPrintable ? '#4b5563' : '#4b5563'; // Dark gray/brown on orange

    // Circle fills inspired by the user's image
    const pamFill = isPrintable ? '#dbeafe' : '#a5b4fc40'; // light blueish lavender
    const tamFill = isPrintable ? '#fecaca' : '#ef444490'; // red
    const samFill = isPrintable ? '#ffedd5' : '#fed7aa90'; // light beige/cream
    const somFill = isPrintable ? '#fed7aa' : '#f9731680'; // orange

    return (
        <div className={`relative w-full max-w-sm mx-auto ${isPrintable ? '' : 'p-2'}`}>
            <svg viewBox="0 0 400 400" className="w-full h-auto font-sans">
                {/* Circles */}
                <circle cx="200" cy="200" r="195" fill={pamFill} />
                <circle cx="200" cy="200" r="150" fill={tamFill} />
                <circle cx="200" cy="200" r="105" fill={samFill} />
                <circle cx="200" cy="200" r="60" fill={somFill} />

                {/* Text for each segment */}
                {/* PAM */}
                <text x="200" y="45" textAnchor="middle" fill={pamTextFill} className="font-bold text-2xl uppercase tracking-wider">PAM</text>
                <text x="200" y="70" textAnchor="middle" fill={textSecondaryColor} className="text-sm">Potential Addressable Market</text>
                <text x="200" y="90" textAnchor="middle" fill={textPrimaryColor} className="font-bold text-lg">{marketSize.potentialAddressableMarket.split(' ')[0]}</text>

                {/* TAM */}
                <text x="200" y="125" textAnchor="middle" fill={tamTextFill} className="font-bold text-2xl uppercase tracking-wider">TAM</text>
                <text x="200" y="150" textAnchor="middle" fill={tamTextFill} className="text-sm">
                    <tspan x="200" dy="0">Total Addressable Market, or</tspan>
                    <tspan x="200" dy="14">Total Available Market</tspan>
                </text>
                <text x="200" y="182" textAnchor="middle" fill={tamTextFill} className="font-bold text-lg">{marketSize.totalAddressableMarket.split(' ')[0]}</text>

                {/* SAM */}
                <text x="200" y="230" textAnchor="middle" fill={samTextFill} className="font-bold text-2xl uppercase tracking-wider">SAM</text>
                <text x="200" y="255" textAnchor="middle" fill={textSecondaryColor} className="text-sm">Serviceable Available Market</text>
                <text x="200" y="275" textAnchor="middle" fill={textPrimaryColor} className="font-bold text-lg">{marketSize.serviceableAvailableMarket.split(' ')[0]}</text>

                {/* SOM */}
                <text x="200" y="320" textAnchor="middle" fill={somTextFill} className="font-bold text-xl uppercase tracking-wider">SOM</text>
                <text x="200" y="340" textAnchor="middle" fill={textSecondaryColor} className="text-xs">
                    <tspan x="200" dy="0">Serviceable & Obtainable</tspan>
                    <tspan x="200" dy="12">Market, or Share of Market</tspan>
                </text>
                <text x="200" y="368" textAnchor="middle" fill={somTextFill} className="font-bold text-base">{marketSize.serviceableObtainableMarket.split(' ')[0]}</text>
            </svg>
            <p className={`text-xs italic text-center mt-2 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>
                Methodology: {marketSize.calculationReference}
            </p>
        </div>
    );
};


export const FinancialModelerCanvas: React.FC<{ 
    data: FinancialPlanningOutput, 
    isPrintable?: boolean,
    isModelingScenarios?: boolean,
    scenarioError?: string | null,
    handleRunScenarioModeling?: () => void,
    onOpenCashFlowModel?: () => void
}> = ({ data, isPrintable = false, isModelingScenarios, scenarioError, handleRunScenarioModeling, onOpenCashFlowModel }) => (
    <div className="space-y-6">
        <Card isPrintable={isPrintable}>
            <Section title="Financial Projections" icon={<ChartBarIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    This 5-year forecast models the venture's potential financial trajectory based on the business model and market assumptions. All figures are in USD.
                </p>
                <div className="my-4">
                     <CumulativeFcffChart data={data.cashFlowModel.cashFlows} scenarios={data.scenarios} isPrintable={isPrintable} />
                </div>
                {!isPrintable && (
                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                        <button onClick={onOpenCashFlowModel} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                            <TableCellsIcon className="w-5 h-5" />
                            Open Interactive Model
                        </button>
                        {handleRunScenarioModeling && (
                            <button onClick={handleRunScenarioModeling} disabled={isModelingScenarios} className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                                {isModelingScenarios ? <Spinner/> : <SparklesIcon className="w-5 h-5"/>}
                                Model Scenarios
                            </button>
                        )}
                        {scenarioError && <p className="text-sm text-red-400">{scenarioError}</p>}
                    </div>
                )}

                 <div className="overflow-x-auto mt-6">
                    <table className={`w-full text-left ${isPrintable ? 'text-xs' : 'text-sm'}`}>
                        <thead className={isPrintable ? 'bg-gray-100' : 'bg-gray-900/50'}>
                            <tr>
                                <th className="p-2 font-semibold">Year</th>
                                <th className="p-2 font-semibold text-right">Revenue</th>
                                <th className="p-2 font-semibold text-right">Gross Profit</th>
                                <th className="p-2 font-semibold text-right">EBITDA</th>
                                <th className="p-2 font-semibold text-right">FCFF</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.cashFlowModel.cashFlows.map((yearData, i) => (
                                <tr key={i} className={`border-t ${isPrintable ? 'border-gray-200' : 'border-gray-700/50'}`}>
                                    <td className="p-2 font-semibold">{yearData.year}</td>
                                    <td className="p-2 text-right font-mono">{formatCurrencySimple(yearData.revenue)}</td>
                                    <td className="p-2 text-right font-mono">{formatCurrencySimple(yearData.grossProfit)}</td>
                                    <td className="p-2 text-right font-mono">{formatCurrencySimple(yearData.ebitda)}</td>
                                    <td className="p-2 text-right font-mono">{formatCurrencySimple(yearData.fcff)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card isPrintable={isPrintable}>
                <Section title="Cost Structure" icon={<CubeTransparentIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                    <CostPieChart breakdown={data.costBreakdown} isPrintable={isPrintable} />
                </Section>
            </Card>
            <Card isPrintable={isPrintable}>
                <Section title="Market Size" icon={<TargetIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                    <MarketSizeDiagram marketSize={data.marketSize} isPrintable={isPrintable} />
                </Section>
            </Card>
        </div>
    </div>
);

export const MarketAnalysisCanvas: React.FC<{ researchData: ResearchOutput | null, financialData: FinancialPlanningOutput | null, isPrintable?: boolean, onNavigate?: (index: number) => void }> = ({ researchData, financialData, isPrintable=false, onNavigate }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Market Analysis" icon={<ChartPieIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            {researchData?.marketAnalysis?.summary && <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'} mb-4`}>{researchData.marketAnalysis.summary}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(researchData?.marketAnalysis || financialData?.marketSize) ? (
                    <div className="space-y-3">
                         <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Market Sizing</h4>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-baseline"><span className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>Potential Addressable Market:</span> <strong className={isPrintable ? 'text-gray-800' : 'text-white'}>{financialData?.marketSize.potentialAddressableMarket || researchData?.marketAnalysis?.marketSize || 'N/A'}</strong></div>
                            <div className="flex justify-between items-baseline"><span className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>Total Addressable Market (TAM):</span> <strong className={isPrintable ? 'text-gray-800' : 'text-white'}>{financialData?.marketSize.totalAddressableMarket || researchData?.marketAnalysis?.marketSize || 'N/A'}</strong></div>
                            <div className="flex justify-between items-baseline"><span className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>Serviceable Available Market (SAM):</span> <strong className={isPrintable ? 'text-gray-800' : 'text-white'}>{financialData?.marketSize.serviceableAvailableMarket || 'N/A'}</strong></div>
                            <div className="flex justify-between items-baseline"><span className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>Serviceable Obtainable Market (SOM):</span> <strong className={isPrintable ? 'text-gray-800' : 'text-white'}>{financialData?.marketSize.serviceableObtainableMarket || 'N/A'}</strong></div>
                            {researchData?.marketAnalysis?.growthRate && <div className="flex justify-between items-baseline"><span className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>Est. Growth Rate (CAGR):</span> <strong className={isPrintable ? 'text-gray-800' : 'text-white'}>{researchData.marketAnalysis.growthRate}</strong></div>}
                         </div>
                    </div>
                ) : <p>No market sizing data available.</p>}
                
                {researchData?.trendsAndOpportunities && (
                    <div className="space-y-3">
                        <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Trends & Opportunities</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm">
                            {researchData.trendsAndOpportunities.map((item, i) => (
                                <li key={i} className={isPrintable ? 'text-gray-600' : 'text-gray-400'}>
                                    <strong className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>{item.trend}:</strong> {item.opportunity}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Section>
    </Card>
);

export const StrategyCanvas: React.FC<{ data: StrategyOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <div className="space-y-6">
        <Card isPrintable={isPrintable}>
            <Section title="Unfair Advantage" icon={<BoltIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <blockquote className={`${isPrintable ? 'border-l-4 border-teal-300 p-4 bg-teal-50' : 'border-l-4 border-teal-500 p-4 bg-gray-900/50'} my-4`}>
                    <p className={`font-semibold ${isPrintable ? 'text-lg text-teal-800' : 'text-lg text-teal-300'}`}>{data.unfairAdvantage}</p>
                </blockquote>
            </Section>
        </Card>
        <Card isPrintable={isPrintable}>
            <Section title="SWOT Analysis" icon={<CubeTransparentIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SWOTBlock title="Strengths" items={data.swotAnalysis.strengths} isPrintable={isPrintable} className={isPrintable ? 'bg-green-50' : 'bg-green-900/20'} />
                    <SWOTBlock title="Weaknesses" items={data.swotAnalysis.weaknesses} isPrintable={isPrintable} className={isPrintable ? 'bg-red-50' : 'bg-red-900/20'} />
                    <SWOTBlock title="Opportunities" items={data.swotAnalysis.opportunities} isPrintable={isPrintable} className={isPrintable ? 'bg-blue-50' : 'bg-blue-900/20'} />
                    <SWOTBlock title="Threats" items={data.swotAnalysis.threats} isPrintable={isPrintable} className={isPrintable ? 'bg-yellow-50' : 'bg-yellow-900/20'} />
                </div>
            </Section>
        </Card>
        
        {data.competitors.length > 0 && (
            <Card isPrintable={isPrintable}>
                <Section title="Competitive Analysis" icon={<UsersIcon className="w-6 h-6" />} isPrintable={isPrintable}>
                    <div className="space-y-4">
                    {data.competitors.map((c, i) => (
                        <CompetitorCard key={i} competitor={c} isPrintable={isPrintable} />
                    ))}
                    </div>
                </Section>
            </Card>
        )}
    </div>
);

const SWOTBlock: React.FC<{ title: string, items: string[], className?: string, isPrintable?: boolean }> = ({ title, items, className, isPrintable=false }) => (
    <div className={`p-4 rounded-lg ${className}`}>
        <h4 className={`font-bold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>{title}</h4>
        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
            {items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
    </div>
);

const CompetitorCard: React.FC<{ competitor: CompetitorAnalysis, isPrintable: boolean }> = ({ competitor, isPrintable }) => (
    <Card isPrintable={isPrintable}>
        <h4 className={`font-bold ${isPrintable ? 'text-base text-gray-800' : 'text-base text-white'}`}>{competitor.name}</h4>
        <p className={`text-xs mt-1 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>Product: {competitor.keyProduct} | Model: {competitor.businessModel}</p>
        <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-2`}>{competitor.description}</p>
        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
            <div>
                <h5 className="font-semibold text-green-400">Strengths</h5>
                <ul className="list-disc list-inside">
                    {competitor.strengths.map((s,i) => <li key={i}>{s}</li>)}
                </ul>
            </div>
            <div>
                 <h5 className="font-semibold text-red-400">Weaknesses</h5>
                 <ul className="list-disc list-inside">
                    {competitor.weaknesses.map((w,i) => <li key={i}>{w}</li>)}
                </ul>
            </div>
        </div>
        <p className={`${isPrintable ? 'text-sm text-blue-700' : 'text-sm text-blue-400'} font-semibold mt-3`}>Opportunity: {competitor.differentiationOpportunity}</p>
    </Card>
);

export const CompetitiveLandscapeCanvas: React.FC<{ data: ResearchOutput, isPrintable?: boolean, onNavigate?: (index: number) => void }> = ({ data, isPrintable = false, onNavigate }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Competitive Landscape" icon={<UsersIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="space-y-4">
                {data.competitiveLandscape.map((c, i) => (
                    <Card key={i} isPrintable={isPrintable}>
                        <h4 className={`font-bold ${isPrintable ? 'text-base text-gray-800' : 'text-base text-white'}`}>{c.name}</h4>
                        <p className={`text-xs mt-1 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>
                            {c.foundedYear && `Founded: ${c.foundedYear}`} {c.funding && `| Funding: ${c.funding}`}
                        </p>
                        <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-2`}>{c.description}</p>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                            <div>
                                <h5 className="font-semibold text-green-400">Strengths</h5>
                                <ul className="list-disc list-inside">
                                    {c.strengths.map((s,i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-red-400">Weaknesses</h5>
                                <ul className="list-disc list-inside">
                                    {c.weaknesses.map((w,i) => <li key={i}>{w}</li>)}
                                </ul>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </Section>
    </Card>
);

export const GoToMarketCanvas: React.FC<{ data: GoToMarketOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    
    useEffect(() => {
        if (!isPrintable && data.expansionRoadmapMermaidCode) {
            mermaid.initialize({ startOnLoad: true, theme: 'dark', securityLevel: 'loose' });
            mermaid.contentLoaded();
        }
    }, [isPrintable, data.expansionRoadmapMermaidCode]);

    return (
        <div className="space-y-6">
            <Card isPrintable={isPrintable}>
                <Section title="Launch Strategy" icon={<RocketLaunchIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                     <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.launchStrategySummary}</p>
                </Section>
            </Card>
             <Card isPrintable={isPrintable}>
                <Section title="Customer Journey Map" icon={<PaperAirplaneIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                        {data.customerJourneyMap.map((stage, index) => (
                            <div key={index} className="flex-1">
                                <h4 className="font-bold text-center text-blue-400">{stage.stageName}</h4>
                                <div className="mt-2 p-3 bg-gray-900/50 rounded-lg h-full">
                                    <h5 className="font-semibold text-sm text-gray-300">Touchpoints</h5>
                                    <ul className="list-disc list-inside text-xs text-gray-400">
                                        {stage.touchpoints.map((t, i) => <li key={i}>{t}</li>)}
                                    </ul>
                                    <h5 className="font-semibold text-sm text-gray-300 mt-3">Experience</h5>
                                     <p className="text-xs text-gray-400">{stage.customerExperience}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Section>
            </Card>
            {!isPrintable && data.expansionRoadmapMermaidCode && (
                 <Card>
                    <Section title="Market Expansion Roadmap" icon={<FlagIcon className="w-6 h-6"/>}>
                        <div className="mermaid text-center" data-mermaid={data.expansionRoadmapMermaidCode}>
                            {data.expansionRoadmapMermaidCode}
                        </div>
                    </Section>
                </Card>
            )}
        </div>
    );
};

export const RiskAnalysisCanvas: React.FC<{ data: RiskAnalysisOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    const getPillStyle = (level: 'Low' | 'Medium' | 'High') => {
        const styles = {
            Low: isPrintable ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300',
            Medium: isPrintable ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300',
            High: isPrintable ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300',
        };
        return styles[level];
    };
    return (
        <Card isPrintable={isPrintable}>
            <Section title="Risk Analysis" icon={<ShieldCheckIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                 <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.riskSummary}</p>
                 <div className="overflow-x-auto mt-4">
                     <table className={`w-full text-left ${isPrintable ? 'text-sm' : 'text-base'}`}>
                         <thead className={isPrintable ? 'bg-gray-100' : 'bg-gray-900/50'}>
                             <tr>
                                 <th className="p-2 font-semibold">Risk</th>
                                 <th className="p-2 font-semibold">Category</th>
                                 <th className="p-2 font-semibold">Likelihood</th>
                                 <th className="p-2 font-semibold">Impact</th>
                                 <th className="p-2 font-semibold">Mitigation Strategy</th>
                             </tr>
                         </thead>
                         <tbody>
                            {data.risks.map((risk, i) => (
                                <tr key={i} className={`border-t ${isPrintable ? 'border-gray-200' : 'border-gray-700/50'}`}>
                                    <td className="p-2 font-semibold">{risk.risk}</td>
                                    <td className="p-2">{risk.category}</td>
                                    <td className="p-2"><Pill isPrintable={isPrintable} className={getPillStyle(risk.likelihood)}>{risk.likelihood}</Pill></td>
                                    <td className="p-2"><Pill isPrintable={isPrintable} className={getPillStyle(risk.impact)}>{risk.impact}</Pill></td>
                                    <td className={`p-2 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{risk.mitigation}</td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                 </div>
            </Section>
        </Card>
    );
};

export const TechnicalBlueprintCanvas: React.FC<{ data: TechnicalArchitectOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => {
    
    useEffect(() => {
        if (!isPrintable && data.productRoadmapMermaidCode) {
            mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
            setTimeout(() => {
                try {
                    const container = document.getElementById('product-roadmap-mermaid');
                    if (container && !container.hasAttribute('data-processed')) {
                        mermaid.render('productRoadmapSvg', data.productRoadmapMermaidCode, (svgCode) => {
                            container.innerHTML = svgCode;
                            container.setAttribute('data-processed', 'true');
                        });
                    }
                } catch (e) {
                    console.error('Mermaid rendering failed for product roadmap', e);
                }
            }, 100);
        }
    }, [isPrintable, data.productRoadmapMermaidCode]);
    
    return (
        <Card isPrintable={isPrintable}>
            <Section title="Operational & Technical Blueprint" icon={<PuzzlePieceIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'} mb-6`}>{data.architectureOverview}</p>
                
                <div className="space-y-8">
                    {data.mvpDefinition && (
                         <div className={`p-6 rounded-lg ${isPrintable ? 'bg-blue-50 border border-blue-200' : 'bg-blue-900/30 border border-blue-500/50'}`}>
                            <h4 className={`font-semibold mb-3 text-lg flex items-center gap-2 ${isPrintable ? 'text-blue-800' : 'text-blue-300'}`}>
                                <RocketLaunchIcon className="w-5 h-5"/>
                                Minimum Viable Product (MVP) Definition
                            </h4>
                            <p className={`${isPrintable ? 'text-gray-700' : 'text-gray-300'} text-sm mb-4`}>{data.mvpDefinition.summary}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className={`font-semibold text-base mb-2 ${isPrintable ? 'text-gray-800' : 'text-white'}`}>Core Features</h5>
                                    <ul className={`list-disc list-inside space-y-1 text-sm ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {data.mvpDefinition.coreFeatures.map((feature, i) => <li key={i}>{feature}</li>)}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className={`font-semibold text-base mb-2 ${isPrintable ? 'text-gray-800' : 'text-white'}`}>Success Metrics</h5>
                                    <ul className={`list-disc list-inside space-y-1 text-sm ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {data.mvpDefinition.successMetrics.map((metric, i) => <li key={i}>{metric}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className={`font-semibold mb-3 text-lg ${isPrintable ? 'text-gray-800' : 'text-white'}`}>Product Roadmap</h4>
                         {!isPrintable && data.productRoadmapMermaidCode && (
                            <div className="my-4 p-4 bg-gray-900 rounded-lg text-center">
                                <div id="product-roadmap-mermaid" className="mermaid"></div>
                            </div>
                        )}
                         <div className="space-y-4">
                            {data.productRoadmap.map((phase, i) => (
                                <div key={i} className={`p-4 rounded-lg ${isPrintable ? 'bg-gray-100 border border-gray-200' : 'bg-gray-900/50'}`}>
                                    <h5 className={`font-semibold text-base ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{phase.phase}</h5>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h6 className={`font-semibold text-sm ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Strategic Goals</h6>
                                            <ul className={`list-disc list-inside text-xs mt-1 space-y-1 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {phase.strategicGoals.map((g, j) => <li key={j}>{g}</li>)}
                                            </ul>
                                        </div>
                                        <div>
                                            <h6 className={`font-semibold text-sm ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Key Features</h6>
                                            <ul className={`list-disc list-inside text-xs mt-1 space-y-1 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {phase.features.map((f, j) => <li key={j}>{f}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className={`font-semibold mb-2 text-lg ${isPrintable ? 'text-gray-800' : 'text-white'}`}>Technology Stack</h4>
                            {data.techStack.map((item, i) => (
                                <div key={i} className={`text-sm py-2 border-b ${isPrintable ? 'border-gray-200' : 'border-gray-700/50'} last:border-b-0`}>
                                    <strong className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>{item.layer}:</strong> {item.technology}
                                    <p className="text-xs text-gray-500 italic pl-2">- {item.reason}</p>
                                </div>
                            ))}
                        </div>
                        <div>
                            <h4 className={`font-semibold mb-2 text-lg ${isPrintable ? 'text-gray-800' : 'text-white'}`}>AI Core Specification</h4>
                            <p className={`${isPrintable ? 'text-sm font-semibold text-gray-700' : 'text-sm font-semibold text-gray-300'}`}>{data.aiCoreSpecification.approach}</p>
                            <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.aiCoreSpecification.reasoning}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-3 text-lg ${isPrintable ? 'text-gray-800' : 'text-white'}`}>Validation Strategy</h4>
                         <div className="space-y-3">
                            {data.validationStrategy.map((item, i) => (
                                <div key={i} className={`p-3 rounded-lg ${isPrintable ? 'bg-gray-100' : 'bg-gray-900/50'}`}>
                                    <h5 className={`font-semibold text-sm ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>{item.phase}: {item.objective}</h5>
                                    <p className={`text-xs mt-1 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>Methodology: {item.methodology}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
        </Card>
    );
};

export const RedTeamCanvas: React.FC<{ data: RedTeamOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Red Team Analysis" icon={<BoltIcon className="w-6 h-6 text-red-400"/>} isPrintable={isPrintable}>
            <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                Simulating a well-funded competitor, '{data.competitorProfile.name}', to stress-test your venture's strategy.
            </p>
            <blockquote className={`${isPrintable ? 'border-l-4 border-red-300 p-4 bg-red-50' : 'border-l-4 border-red-500 p-4 bg-gray-900/50'} my-4`}>
                <h4 className={`font-bold ${isPrintable ? 'text-lg text-red-800' : 'text-lg text-red-300'}`}>Counter-Strategy Summary</h4>
                <p className={`mt-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>{data.counterStrategySummary}</p>
            </blockquote>
            <div className="mt-6">
                <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Key Vulnerabilities Exploited</h4>
                <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    {data.keyVulnerabilitiesExploited.map((v, i) => <li key={i}>{v}</li>)}
                </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card isPrintable={isPrintable}>
                    <h5 className="font-semibold text-red-400">Product Flank</h5>
                    <p className="text-sm">{data.productFlank.strategy}</p>
                </Card>
                <Card isPrintable={isPrintable}>
                    <h5 className="font-semibold text-red-400">Marketing Blitz</h5>
                    <p className="text-sm">{data.marketingBlitz.strategy}</p>
                </Card>
                <Card isPrintable={isPrintable}>
                    <h5 className="font-semibold text-red-400">Pricing Pressure</h5>
                    <p className="text-sm">{data.pricingPressure.strategy}</p>
                </Card>
            </div>
        </Section>
    </Card>
);

const ScorePill: React.FC<{ score: 'Green' | 'Yellow' | 'Red', isPrintable: boolean }> = ({ score, isPrintable }) => {
    const styles = {
        Green: isPrintable ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300',
        Yellow: isPrintable ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300',
        Red: isPrintable ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300',
    };
    return <Pill isPrintable={isPrintable} className={styles[score]}>{score}</Pill>;
};

const EthicalConsiderationsBlock: React.FC<{ considerations: EthicalConsiderationDetail[], isPrintable: boolean, onNavigate?: (index: number) => void }> = ({ considerations, isPrintable=false, onNavigate }) => (
    <div className="space-y-4">
        {considerations.map((item, i) => (
            <Card key={i} isPrintable={isPrintable}>
                <h4 className={`font-bold ${isPrintable ? 'text-base text-gray-800' : 'text-base text-white'}`}>{item.aspect}</h4>
                <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-1`}>{item.details}</p>
                <p className={`${isPrintable ? 'text-sm font-semibold text-green-700' : 'text-sm font-semibold text-green-400'} mt-2`}>Mitigation: {item.mitigation}</p>
            </Card>
        ))}
    </div>
);

const ReferencesBlock: React.FC<{ sources: GroundingSource[], isPrintable?: boolean, onNavigate?: (index: number) => void }> = ({ sources, isPrintable = false, onNavigate }) => (
    <ul className="space-y-3">
        {sources.map((source, index) => (
            <li key={index} id={`reference-${index}`} className={`p-3 rounded-lg ${isPrintable ? 'bg-gray-100' : 'bg-gray-900/50'}`}>
                <a href={source.uri} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>
                    [{index + 1}] {source.title}
                </a>
                <p className={`text-xs truncate mt-1 ${isPrintable ? 'text-gray-500' : 'text-gray-500'}`}>{source.uri}</p>
            </li>
        ))}
    </ul>
);

export const SolutionScoringCanvas: React.FC<{ data: SolutionScoringOutput, allSolutions?: IdeationOutput | null, isPrintable?: boolean }> = ({ data, allSolutions, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Solution Scoring Analysis" icon={<ScaleIcon className="w-6 h-6" />} isPrintable={isPrintable}>
            <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>{data.recommendationText}</p>
        </Section>
    </Card>
);

export const IpStrategyCanvas: React.FC<{ data: IpStrategyOutput, isPrintable?: boolean, onNavigate?: (index: number) => void }> = ({ data, isPrintable=false, onNavigate }) => {
    const getFtoPill = (signal: 'Green' | 'Yellow' | 'Red') => {
        const styles = {
            Green: isPrintable ? 'bg-green-100 text-green-800' : 'bg-green-500/20 text-green-300',
            Yellow: isPrintable ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500/20 text-yellow-300',
            Red: isPrintable ? 'bg-red-100 text-red-800' : 'bg-red-500/20 text-red-300',
        };
        return <Pill isPrintable={isPrintable} className={styles[signal]}>{signal} Signal</Pill>;
    };

    return (
        <Card isPrintable={isPrintable}>
            <Section title="IP & Defensibility Strategy" icon={<ScaleIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card isPrintable={isPrintable}>
                        <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Patentability Score</h4>
                        <p className={`text-4xl font-bold ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{data.patentabilityScore} / 10</p>
                        <p className={`text-sm mt-2 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.patentabilityReasoning}</p>
                    </Card>
                    <Card isPrintable={isPrintable}>
                        <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Freedom to Operate (FTO)</h4>
                        <div className="mb-2">{getFtoPill(data.freedomToOperateSignal)}</div>
                        <p className={`text-sm ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.freedomToOperateReasoning}</p>
                    </Card>
                </div>
                <div className="mt-6">
                    <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>IP Strategy Recommendation</h4>
                    <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.ipStrategyRecommendation}</p>
                </div>
                {data.priorArtSummary && data.priorArtSummary.length > 0 && (
                    <div className="mt-6">
                        <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Prior Art Summary</h4>
                        <div className="space-y-3">
                            {data.priorArtSummary.map((item, i) => (
                                <Card key={i} isPrintable={isPrintable}>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{item.title}</a>
                                    <p className={`${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'} mt-1`}>{item.summary}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </Section>
        </Card>
    );
};

export const FounderAnalysisProfileCanvas: React.FC<{ profile: FounderAnalysisProfile, isPrintable?: boolean }> = ({ profile, isPrintable = false }) => {
    const CapabilityScoreBar: React.FC<{ label: string, score: number }> = ({ label, score }) => (
        <div>
            <div className="flex justify-between items-baseline text-sm">
                <span className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>{label}</span>
                <span className={`font-bold ${isPrintable ? 'text-blue-700' : 'text-blue-400'}`}>{Math.round(score * 100)}%</span>
            </div>
            <div className={`w-full ${isPrintable ? 'bg-gray-200' : 'bg-gray-700'} rounded-full h-2.5 mt-1`}>
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${score * 100}%` }}></div>
            </div>
        </div>
    );

    return (
        <Card isPrintable={isPrintable}>
            <Section title={`Founder Analysis: ${profile.founder_name}`} icon={<IdentificationIcon className="w-6 h-6" />} isPrintable={isPrintable}>
                 <blockquote className={`${isPrintable ? 'border-l-4 border-purple-200 p-4 bg-purple-50' : 'border-l-4 border-purple-500/50 p-4 bg-gray-900/50'} my-4`}>
                    <h4 className={`font-bold ${isPrintable ? 'text-lg text-purple-800' : 'text-lg text-purple-300'}`}>{profile.headline}</h4>
                    <p className={`mt-2 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{profile.summary}</p>
                </blockquote>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card isPrintable={isPrintable}>
                        <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Key Capabilities</h4>
                        <div className="space-y-3">
                            <CapabilityScoreBar label="Vision & Opportunity" score={profile.capability_scores.vision_opportunity} />
                            <CapabilityScoreBar label="Execution & Delivery" score={profile.capability_scores.execution_delivery} />
                            <CapabilityScoreBar label="People & Culture" score={profile.capability_scores.people_culture} />
                            <CapabilityScoreBar label="Depth & Rigor" score={profile.capability_scores.depth_rigor} />
                        </div>
                    </Card>
                     <Card isPrintable={isPrintable}>
                        <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Top Strengths</h4>
                        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-green-700' : 'text-sm text-green-300'}`}>
                            {profile.top_strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                         <h4 className={`font-semibold mt-4 mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Watchouts</h4>
                        <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-yellow-700' : 'text-sm text-yellow-300'}`}>
                            {profile.watchouts.map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                    </Card>
                </div>
                <Card isPrintable={isPrintable} className="mt-6">
                    <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Actionable Advice</h4>
                    <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{profile.advice}</p>
                </Card>
            </Section>
        </Card>
    );
};

export const InvestmentMemoCanvas: React.FC<{ data: InvestmentMemoOutput, isPrintable?: boolean }> = ({ data, isPrintable=false }) => {
    const MemoSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className={isPrintable ? 'mb-6' : 'mb-4'}>
            <h4 className={`font-bold ${isPrintable ? 'text-base text-gray-700 border-b border-gray-200 pb-1 mb-2' : 'text-lg text-gray-200 mb-2'}`}>{title}</h4>
            <div className={`${isPrintable ? 'text-sm text-gray-600 space-y-2' : 'text-sm text-gray-400 space-y-2'}`}>
                {children}
            </div>
        </div>
    );
    
    return (
        <Card isPrintable={isPrintable}>
            <Section title="Investment Memorandum" icon={<DocumentTextIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
                <MemoSection title="Executive Summary">
                    <p>{data.executiveSummary}</p>
                </MemoSection>
                <MemoSection title="Problem & Solution">
                    <p><strong className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>Problem:</strong> {data.problemAndSolution.problem}</p>
                    <p><strong className={isPrintable ? 'text-gray-700' : 'text-gray-300'}>Solution:</strong> {data.problemAndSolution.solution}</p>
                </MemoSection>
                <MemoSection title="Market Opportunity">
                    <p>{data.marketOpportunity.summary}</p>
                    <p className="mt-1 italic">{data.marketOpportunity.marketSize}</p>
                </MemoSection>
                <MemoSection title="Product & Advantage">
                    <p>{data.product.description}</p>
                    <p className="mt-1"><strong>Unfair Advantage:</strong> {data.product.unfairAdvantage}</p>
                </MemoSection>
                <MemoSection title="Team">
                    <p>{data.team.summary}</p>
                    <ul className="list-disc list-inside mt-1">
                        {data.team.strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </MemoSection>
                <MemoSection title="Go-to-Market Strategy">
                    <p>{data.goToMarketStrategy.summary}</p>
                </MemoSection>
                <MemoSection title="Financials">
                    <p>{data.financialsSummary.summary}</p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {data.financialsSummary.keyProjections.map((kp, i) => (
                            <div key={i} className={`p-2 rounded ${isPrintable ? 'bg-gray-100' : 'bg-gray-800'}`}>
                                <span className="block text-xs font-bold">{kp.metric}</span>
                                <span className="block text-sm">{kp.value}</span>
                            </div>
                        ))}
                    </div>
                </MemoSection>
                <MemoSection title="Deal & Ask">
                    <p><strong>Ask:</strong> {data.dealAndAsk.ask}</p>
                    <p><strong>Use of Funds:</strong> {data.dealAndAsk.useOfFunds}</p>
                </MemoSection>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <MemoSection title="Investment Thesis">
                        <ul className="list-disc list-inside">
                            {data.investmentThesis.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </MemoSection>
                    <MemoSection title="Key Risks">
                        <ul className="list-disc list-inside">
                            {data.keyRisks.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                    </MemoSection>
                </div>
            </Section>
        </Card>
    );
};

export const ReferencesCanvas: React.FC<{ sources: GroundingSource[], isPrintable?: boolean }> = ({ sources, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="References & Citations" icon={<BookOpenIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <ReferencesBlock sources={sources} isPrintable={isPrintable} />
        </Section>
    </Card>
);

export const EthicalConsiderationsCanvas: React.FC<{ data: ResearchOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Ethical Considerations" icon={<HeartIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
             <EthicalConsiderationsBlock considerations={data.ethicalConsiderations} isPrintable={isPrintable} />
        </Section>
    </Card>
);

export const EthicsCanvas: React.FC<{ data: EthicsOracleOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Ethics & Compliance Audit" icon={<HeartIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            {data.redFlagWarning && (
                <div className={`p-4 mb-6 rounded-lg ${isPrintable ? 'bg-red-50 border-l-4 border-red-500' : 'bg-red-900/30 border-l-4 border-red-500'}`}>
                    <h4 className={`font-bold flex items-center gap-2 ${isPrintable ? 'text-red-800' : 'text-red-300'}`}>
                        <ExclamationTriangleIcon className="w-5 h-5"/>
                        CRITICAL RED FLAG
                    </h4>
                    <p className={`mt-1 ${isPrintable ? 'text-red-700' : 'text-red-200'}`}>{data.redFlagWarning}</p>
                </div>
            )}
            
            <div className="space-y-4">
                {data.scores.map((item, i) => (
                    <Card key={i} isPrintable={isPrintable}>
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h5 className={`font-bold ${isPrintable ? 'text-gray-800' : 'text-white'}`}>{item.dimension}</h5>
                                <p className={`text-sm mt-1 ${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{item.explanation}</p>
                            </div>
                            <ScorePill score={item.score as 'Green' | 'Yellow' | 'Red'} isPrintable={isPrintable} />
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-6">
                <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Recommendations</h4>
                <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
        </Section>
    </Card>
);

export const SuccessScoreCanvas: React.FC<{ data: SuccessScoreOutput, isPrintable?: boolean }> = ({ data, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Venture Success Score Analysis" icon={<StarIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Overall Assessment</h4>
                <p className={`${isPrintable ? 'text-gray-600' : 'text-gray-400'}`}>{data.scoreJustification}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card isPrintable={isPrintable}>
                    <h5 className={`font-semibold mb-3 ${isPrintable ? 'text-green-700' : 'text-green-400'}`}>Key Strengths</h5>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                        {data.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card>
                <Card isPrintable={isPrintable}>
                    <h5 className={`font-semibold mb-3 ${isPrintable ? 'text-yellow-700' : 'text-yellow-400'}`}>Areas for Improvement</h5>
                    <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-300'}`}>
                        {data.areasForImprovement.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Card>
            </div>

            <div className="mt-6">
                <h4 className={`font-semibold mb-3 ${isPrintable ? 'text-lg text-gray-800' : 'text-lg text-white'}`}>Strategic Recommendations</h4>
                <ul className={`list-disc list-inside space-y-1 ${isPrintable ? 'text-sm text-gray-600' : 'text-sm text-gray-400'}`}>
                    {data.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                </ul>
            </div>
        </Section>
    </Card>
);

export const UsageMetricsCanvas: React.FC<{ agents: Agent[], metrics: UsageMetrics, isPrintable?: boolean }> = ({ agents, metrics, isPrintable = false }) => (
    <Card isPrintable={isPrintable}>
        <Section title="Computational Usage" icon={<ChipIcon className="w-6 h-6"/>} isPrintable={isPrintable}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card isPrintable={isPrintable}>
                    <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Total Tokens</h4>
                    <p className={`text-3xl font-bold ${isPrintable ? 'text-blue-600' : 'text-blue-400'}`}>{metrics.totalTokens.toLocaleString()}</p>
                </Card>
                <Card isPrintable={isPrintable}>
                    <h4 className={`font-semibold mb-2 ${isPrintable ? 'text-gray-700' : 'text-gray-300'}`}>Est. Carbon Footprint</h4>
                    <p className={`text-3xl font-bold ${isPrintable ? 'text-green-600' : 'text-green-400'}`}>~{metrics.co2g.toFixed(2)}g CO₂e</p>
                </Card>
            </div>
            
            <div className="overflow-x-auto">
                <table className={`w-full text-left ${isPrintable ? 'text-sm' : 'text-sm'}`}>
                    <thead className={isPrintable ? 'bg-gray-100' : 'bg-gray-900/50'}>
                        <tr>
                            <th className="p-2 font-semibold">Agent</th>
                            <th className="p-2 font-semibold text-right">Input Tokens</th>
                            <th className="p-2 font-semibold text-right">Output Tokens</th>
                            <th className="p-2 font-semibold text-right">Total Tokens</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agents.map((agent, i) => agent.output?.tokenUsage && (
                            <tr key={i} className={`border-t ${isPrintable ? 'border-gray-200' : 'border-gray-700/50'}`}>
                                <td className="p-2">{agent.name}</td>
                                <td className="p-2 text-right font-mono">{agent.output.tokenUsage.input.toLocaleString()}</td>
                                <td className="p-2 text-right font-mono">{agent.output.tokenUsage.output.toLocaleString()}</td>
                                <td className="p-2 text-right font-mono font-bold">{agent.output.tokenUsage.total.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    </Card>
);
