
import React, { useState, useCallback, useRef, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfjsLib from 'pdfjs-dist';
import { Agent, AgentRole, AgentStatus, ModelMode, SavedRun, ReportData, StrategicDirective, ProblemStatementOutput, IdeationOutput, AllCritiquesOutput, SolutionSelectionOutput, ValuePropositionCanvasOutput, LeanCanvasOutput, StoryboardOutput, FinancialPlanningOutput, RiskAnalysisOutput, TechnicalArchitectOutput, GoToMarketOutput, CustomerPersonaOutput, EmpathyMapCanvasOutput, ResearchOutput, StrategyOutput, RedTeamOutput, PitchDeckOutput, EthicsOracleOutput, FounderDnaOutput, FounderInput, UsageMetrics, SuccessScoreOutput, CashFlowModelOutput, IpStrategyOutput, TechnologyResearchOutput, TalentStrategyOutput, UserProfile, IdealCoFounderProfile, SuggestedFounderProfile, VentureAnalystOutput, SolutionScoringOutput, InvestmentMemoOutput, PitchDeckSlide, ProblemFrame } from './types';
import { AGENT_DEFINITIONS, APP_VERSION, ESTIMATED_TIME_PER_AGENT_SECONDS, CO2_GRAMS_PER_1K_TOKENS, IDEA_AREAS, TARGET_MARKETS } from './constants';
import { runProblemResearch, runCustomerPersona, runEmpathyMap, runProblemSynthesizer, runTechnologyScout, runSolutionIdeation, runSolutionCritique, runSolutionScoring, runSolutionEvolution, runValueProposition, runLeanCanvas, runStoryboarding, runFinancialModeler, runStrategy, runRiskAnalysis, runTechnicalBlueprint, runGoToMarket, delay, runSolutionEnhancement, runRedTeamAnalysis, runEthicsAnalysis, runFounderDna, runSuccessScoring, runFinancialScenarioModeling, runBrandNameSuggestion, runVideoGeneration, runFounderResearch, runIpStrategyAnalysis, emptyUsage, runTalentStrategy, runTalentScout, runFounderReportAnalysis, runCvAnalysis, runMarketFitAnalysis, runInvestmentMemo, runPitchDeck, runChallengeGeneration, runProblemFraming } from './services/geminiService';
import { storageService } from './services/storageService';
import Spinner from './components/Spinner';
import PrintableReport from './components/PrintableReport';
import AgentDetailModal from './components/AgentDetailModal';
import { LeanCanvas, FinancialModelerCanvas, ValuePropositionCanvas, StoryboardReportCanvas, CustomerPersonaCanvas, EmpathyMapCanvas, StrategyCanvas, ElevatorPitchView, ProblemStatementCanvas, SolutionSelectionCanvas, FounderDnaCanvas, CompetitiveLandscapeCanvas, InfographicOverviewCanvas, RiskAnalysisCanvas, TechnicalBlueprintCanvas, GoToMarketCanvas, MarketAnalysisCanvas, ReferencesCanvas, RedTeamCanvas, EthicsCanvas, EthicalConsiderationsCanvas, UsageMetricsCanvas, SuccessScoreCanvas, IpStrategyCanvas, TechnologyScoutCanvas, IdealCoFounderCanvas, TeamCompositionCanvas, FounderAnalysisProfileCanvas, InvestmentMemoCanvas, SolutionScoringCanvas } from './components/CanvasViews';
import CashFlowModelModal from './components/CashFlowModelModal';
import { CopyIcon, CheckIcon, DownloadIcon, XinovatesAvatar, QuestionMarkCircleIcon, ArchiveBoxIcon, ArrowLeftOnRectangleIcon, BookmarkSquareIcon, LightBulbIcon, UserCircleIcon, BeakerIcon, ChartPieIcon, ShieldCheckIcon, RocketLaunchIcon, PuzzlePieceIcon, UsersIcon, BookOpenIcon, ChevronRightIcon, ShareIcon, ChipIcon, CrosshairsIcon, SparklesIcon, ScaleIcon, TrashIcon, AcademicCapIcon, ClockIcon, CloudIcon, DataPacketIcon, StarIcon, DocumentArrowUpIcon, DocumentTextIcon, MagnifyingGlassIcon, BoltIcon, HeartIcon, ArrowPathIcon, PresentationChartBarIcon, ChartBarIcon, CheckCircleIcon } from './components/Icons';
import HelpModal from './components/Modal';
import LoginScreen from './components/LoginScreen';
import { HistoryModal } from './components/HistoryModal';
import DecisionPoint from './components/DecisionPoint';
import ShareableReport from './components/ShareableReport';
import PersonaChatModal from './components/PersonaChatModal';
import ScienceModal from './components/ScienceModal';
import ConceptVideo from './components/ConceptVideo';
import VersionHistoryModal from './components/VersionHistoryModal';
import IdeaComparisonPoint from './components/IdeaComparisonPoint';
import BrandNameSelectionPoint from './components/BrandNameSelectionPoint';
import ChallengeSelectionPoint from './components/ChallengeSelectionPoint';
import ProblemFramingPoint from './components/ProblemFramingPoint';
import ProgressDisplay from './components/ProgressDisplay';
import PrintablePitchDeck from './components/PrintablePitchDeck';
import PitchDeckView from './components/PitchDeckView';
import TrendSpotterModal from './components/TrendSpotterModal';
import AdminDashboard from './components/AdminDashboard';

// Configure the PDF.js worker
const PDF_WORKER_URL = 'https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_URL;

type ActiveTab = 'overview' | 'founder_dna' | 'problem' | 'solution' | 'tech_research' | 'ip_strategy' | 'financials' | 'advantages' | 'gtm' | 'risk' | 'ops' | 'references' | 'redteam' | 'ethics' | 'success_score' | 'pitch_deck' | 'investment_memo' |'usage_metrics';

const PREDEFINED_TRAITS = [
    "Innovative", "Learning", "Organising", "Futurist", "Strategic",
    "Initiating", "Developing", "Individualising", "Empathic",
    "Thinking", "Adaptable"
];

const getPhaseForAgent = (role: AgentRole): string => {
    switch(role) {
        case AgentRole.FOUNDER_DNA:
        case AgentRole.MARKET_FIT_ANALYST:
            return "Pre-Simulation Analysis";
        case AgentRole.PROBLEM_RESEARCH:
        case AgentRole.CUSTOMER_PERSONA:
        case AgentRole.EMPATHY_MAP:
            return "Discover";
        case AgentRole.PROBLEM_SYNTHESIZER:
            return "Define";
        case AgentRole.TECHNOLOGY_SCOUT:
        case AgentRole.SOLUTION_IDEATION:
        case AgentRole.SOLUTION_CRITIQUE:
        case AgentRole.VENTURE_ANALYST:
        case AgentRole.SOLUTION_EVOLUTION:
        case AgentRole.SOLUTION_SELECTION:
        case AgentRole.DEVILS_ADVOCATE:
            return "Develop";
        default:
            return "Deliver";
    }
}

const deliverableAgentsList: AgentRole[] = [
    AgentRole.IP_STRATEGIST, AgentRole.TALENT_STRATEGIST, AgentRole.VALUE_PROPOSITION, AgentRole.LEAN_CANVAS,
    AgentRole.STORYBOARDING, AgentRole.FINANCIAL_MODELER, AgentRole.RISK_ANALYSIS,
    AgentRole.TECHNICAL_BLUEPRINT, AgentRole.GO_TO_MARKET, AgentRole.STRATEGY, AgentRole.PITCH_DECK, AgentRole.INVESTMENT_MEMO
];

const PreSimulationMetrics: React.FC<{ modelMode: ModelMode, isRefinementEnabled: boolean, founderCount: number }> = ({ modelMode, isRefinementEnabled, founderCount }) => {
    const coreAgents = 10;
    const deliverableAgents = 9;
    const optionalAgents = (isRefinementEnabled ? 1 : 0) + (founderCount > 0 ? 1 : 0);
    const totalAgents = coreAgents + deliverableAgents + optionalAgents;
    
    const timePerAgent = ESTIMATED_TIME_PER_AGENT_SECONDS[modelMode];
    const totalSeconds = totalAgents * timePerAgent;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    const estimatedTokens = totalAgents * 1500;
    const estimatedCo2g = (estimatedTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;

    return (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-3 bg-gray-900/50 border themed-border rounded-lg text-xs">
            <h4 className="font-bold text-gray-300">Metrics Snapshot (Est.)</h4>
            <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-gray-400" title="Estimated total run time for all phases.">
                    <ClockIcon className="w-4 h-4 text-blue-400" />
                    <span>~{minutes}m {seconds.toFixed(0)}s</span>
                </div>
                 <div className="flex items-center gap-2 text-gray-400" title="Estimated Carbon Dioxide equivalent for this simulation run.">
                    <CloudIcon className="w-4 h-4 text-green-400" />
                    <span>~{estimatedCo2g.toFixed(2)}g CO₂e</span>
                </div>
            </div>
        </div>
    );
};

const getDistilledReportForPostAnalysis = (fullReport: ReportData): ReportData => {
    const distilledReport = { ...fullReport };
    distilledReport.research = null;
    distilledReport.technologyScoutReport = null;
    distilledReport.allSolutions = null;
    distilledReport.allCritiques = null;
    distilledReport.solutionScoring = null;
    distilledReport.ventureAnalysis = null;
    distilledReport.empathyMap = null;
    distilledReport.storyboard = null;
    distilledReport.userContext = null;

    if (distilledReport.founders) {
        distilledReport.founders = distilledReport.founders.map(f => ({
            ...f,
            description: '',
            reportText: null,
            photoB64: null,
        }));
    }

    return distilledReport;
};

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [justLoggedIn, setJustLoggedIn] = useState(false);

    const [agents, setAgents] = useState<Agent[]>(AGENT_DEFINITIONS);
    const [workflowMode, setWorkflowMode] = useState<'problemFirst' | 'solutionFirst'>('problemFirst');
    const [challenge, setChallenge] = useState<string>('');
    const [userSolution, setUserSolution] = useState<string>('');
    const [ideaArea, setIdeaArea] = useState<string>(IDEA_AREAS[0].value);
    const [targetMarket, setTargetMarket] = useState<string>(TARGET_MARKETS[0].value);
    const [founders, setFounders] = useState<FounderInput[]>([{ id: crypto.randomUUID(), name: '', description: '', photoB64: null, reportText: null, reportFileName: null, analysisProfile: null, manualTraits: {} }]);
    const [modelMode, setModelMode] = useState<ModelMode>('quality');
    const [strategicDirective, setStrategicDirective] = useState<StrategicDirective>('BALANCED');
    const [isRefinementEnabled, setIsRefinementEnabled] = useState<boolean>(true);
    const [useFounderDnaInIdeation, setUseFounderDnaInIdeation] = useState<boolean>(false);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [isCoreSimFinished, setIsCoreSimFinished] = useState<boolean>(false);
    const [isAwaitingIdeaComparison, setIsAwaitingIdeaComparison] = useState<boolean>(false);
    const [isAwaitingChallengeSelection, setIsAwaitingChallengeSelection] = useState<boolean>(false);
    const [suggestedChallenges, setSuggestedChallenges] = useState<ProblemStatementOutput[] | null>(null);
    const [isAwaitingProblemFraming, setIsAwaitingProblemFraming] = useState<boolean>(false);
    const [suggestedProblemFrames, setSuggestedProblemFrames] = useState<ProblemFrame[] | null>(null);
    const [isAwaitingBrandNameSelection, setIsAwaitingBrandNameSelection] = useState<boolean>(false);
    const [suggestedBrandNames, setSuggestedBrandNames] = useState<string[]>([]);
    const [userSelectedBrandName, setUserSelectedBrandName] = useState<string | null>(null);
    const [isGeneratingDeliverables, setIsGeneratingDeliverables] = useState<boolean>(false);
    const [hasGeneratedDeliverables, setHasGeneratedDeliverables] = useState<boolean>(false);
    const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
    const [enhancementError, setEnhancementError] = useState<string | null>(null);
    const [enhancementProgress, setEnhancementProgress] = useState<string[]>([]);
    const [showFounderDnaInput, setShowFounderDnaInput] = useState<boolean>(false);
    const [showSolutionInput, setShowSolutionInput] = useState<boolean>(false);
    const [selectedDeliverables, setSelectedDeliverables] = useState<Set<AgentRole>>(new Set(deliverableAgentsList));
    
    // Trend Spotter State
    const [showTrendSpotterModal, setShowTrendSpotterModal] = useState<boolean>(false);

    // User Context Upload
    const [userContext, setUserContext] = useState<string | null>(null);
    const [contextFileName, setContextFileName] = useState<string | null>(null);
    const [isParsingPdf, setIsParsingPdf] = useState<boolean>(false);
    const [parsingError, setParsingError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Founder Search & Analysis
    const [searchingFounderId, setSearchingFounderId] = useState<string | null>(null);
    const [analyzingFounderId, setAnalyzingFounderId] = useState<string | null>(null);
    const [founderSearchError, setFounderSearchError] = useState<Record<string, string | null>>({});
    const [founderAnalysisError, setFounderAnalysisError] = useState<Record<string, string | null>>({});
    const [manualInputFounderId, setManualInputFounderId] = useState<string | null>(null);
    const [analyzingCvId, setAnalyzingCvId] = useState<string | null>(null);
    const [cvAnalysisError, setCvAnalysisError] = useState<Record<string, string | null>>({});
    const [analysisSuccess, setAnalysisSuccess] = useState<Record<string, boolean>>({});

    // Talent Scout
    const [isScouting, setIsScouting] = useState<string | null>(null);
    const [scoutError, setScoutError] = useState<Record<string, string | null>>({});

    // Outputs from all agents
    const [founderDna, setFounderDna] = useState<FounderDnaOutput | null>(null);
    const [research, setResearch] = useState<ResearchOutput | null>(null);
    const [customerPersona, setCustomerPersona] = useState<CustomerPersonaOutput | null>(null);
    const [empathyMap, setEmpathyMap] = useState<EmpathyMapCanvasOutput | null>(null);
    const [problemStatement, setProblemStatement] = useState<ProblemStatementOutput | null>(null);
    const [technologyScoutReport, setTechnologyScoutReport] = useState<TechnologyResearchOutput | null>(null);
    const [allSolutions, setAllSolutions] = useState<IdeationOutput | null>(null);
    const [allCritiques, setAllCritiques] = useState<AllCritiquesOutput | null>(null);
    const [solutionScoring, setSolutionScoring] = useState<SolutionScoringOutput | null>(null);
    const [selectedSolution, setSelectedSolution] = useState<SolutionSelectionOutput | null>(null);
    const [ipStrategy, setIpStrategy] = useState<IpStrategyOutput | null>(null);
    const [talentStrategy, setTalentStrategy] = useState<TalentStrategyOutput | null>(null);
    const [valueProposition, setValueProposition] = useState<ValuePropositionCanvasOutput | null>(null);
    const [leanCanvas, setLeanCanvas] = useState<LeanCanvasOutput | null>(null);
    const [storyboard, setStoryboard] = useState<StoryboardOutput | null>(null);
    const [financialPlan, setFinancialPlan] = useState<FinancialPlanningOutput | null>(null);
    const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysisOutput | null>(null);
    const [technicalBlueprint, setTechnicalBlueprint] = useState<TechnicalArchitectOutput | null>(null);
    const [goToMarket, setGoToMarket] = useState<GoToMarketOutput | null>(null);
    const [strategy, setStrategy] = useState<StrategyOutput | null>(null);
    const [redTeamReport, setRedTeamReport] = useState<RedTeamOutput | null>(null);
    const [ethicsReport, setEthicsReport] = useState<EthicsOracleOutput | null>(null);
    const [pitchDeck, setPitchDeck] = useState<PitchDeckOutput | null>(null);
    const [investmentMemo, setInvestmentMemo] = useState<InvestmentMemoOutput | null>(null);
    const [successScore, setSuccessScore] = useState<SuccessScoreOutput | null>(null);
    const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);
    const [totalTokens, setTotalTokens] = useState(0);

    // Video generation state
    const [isGeneratingVideo, setIsGeneratingVideo] = useState<boolean>(false);
    const [videoGenerationProgress, setVideoGenerationProgress] = useState<string[]>([]);
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
    const [videoGenerationError, setVideoGenerationError] = useState<string | null>(null);
    const videoAbortControllerRef = useRef<AbortController | null>(null);
    const enhancementCancelledRef = useRef<boolean>(false);

    // Simulation Progress State
    const [completedAgents, setCompletedAgents] = useState(0);
    const [totalAgentsToRun, setTotalAgentsToRun] = useState(0);


    const [error, setError] = useState<string | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
    const [isGeneratingHtml, setIsGeneratingHtml] = useState<boolean>(false);
    const [isGeneratingDeck, setIsGeneratingDeck] = useState<boolean>(false);
    const [copied, setCopied] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [showScienceModal, setShowScienceModal] = useState<boolean>(false);
    const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
    const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
    const [showVersionHistoryModal, setShowVersionHistoryModal] = useState<boolean>(false);
    const [showCashFlowModal, setShowCashFlowModal] = useState<boolean>(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
    const [savedRuns, setSavedRuns] = useState<SavedRun[]>([]);
    const [activeRunId, setActiveRunId] = useState<string | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
    const [personaToChat, setPersonaToChat] = useState<CustomerPersonaOutput | null>(null);
    
    const [isRedTeaming, setIsRedTeaming] = useState<boolean>(false);
    const [redTeamError, setRedTeamError] = useState<string | null>(null);
    const [isAuditingEthics, setIsAuditingEthics] = useState<boolean>(false);
    const [ethicsError, setEthicsError] = useState<string | null>(null);
    const [isScoring, setIsScoring] = useState<boolean>(false);
    const [scoringError, setScoringError] = useState<string | null>(null);
    const [isModelingScenarios, setIsModelingScenarios] = useState<boolean>(false);
    const [scenarioError, setScenarioError] = useState<string | null>(null);
    
    const agentNodeRefs = useRef<{[key in AgentRole]?: HTMLDivElement | null}>({});
    const diagramContainerRef = useRef<HTMLDivElement>(null);

    const reportRef = useRef<HTMLDivElement>(null);
    const shareableReportRef = useRef<HTMLDivElement>(null);
    const pitchDeckRef = useRef<HTMLDivElement>(null);

    const isFinished = hasGeneratedDeliverables;
    
    // SECURITY CHECK: Ensure user is authorized to perform actions
    const isAuthorized = currentUser && (currentUser.status === 'active' || currentUser.role === 'admin');

    useEffect(() => {
        const themeClass = `theme-${modelMode}`;
        document.body.className = themeClass;
        return () => {
            document.body.className = '';
        };
    }, [modelMode]);

    useEffect(() => {
        const user = storageService.getCurrentUser();
        if (user) {
            // SECURITY: Verify user exists in internal DB (prevents tampering with localStorage)
            storageService.getUser(user.username).then(latestUser => {
                if (latestUser) {
                    const { passwordHash, ...profile } = latestUser;
                    setCurrentUser(profile);
                } else {
                    // User found in session but not in DB (invalid state), logout
                    console.warn("User session invalid. Logging out.");
                    storageService.clearCurrentUser();
                    setCurrentUser(null);
                }
            });
            const loadRuns = async () => {
                const runs = await storageService.getRuns(user.username);
                setSavedRuns(runs);
            };
            loadRuns();
        }
    }, []);

     useEffect(() => {
        if (justLoggedIn) {
            const timer = setTimeout(() => setJustLoggedIn(false), 500); 
            return () => clearTimeout(timer);
        }
    }, [justLoggedIn]);

    useEffect(() => {
        if (isSimulating || isGeneratingDeliverables) {
            const doneAgents = agents.filter(a => a.status === 'done').length;
            setCompletedAgents(doneAgents);
        }
    }, [agents, isSimulating, isGeneratingDeliverables]);
    
    useEffect(() => {
        if (isCoreSimFinished && !isFinished && !isRefinementEnabled && !isGeneratingDeliverables && !isSimulating) {
            updateAgentStatus(AgentRole.DEVILS_ADVOCATE, 'done');
            handleDeliverableGeneration();
        }
    }, [isCoreSimFinished, isFinished, isRefinementEnabled, isGeneratingDeliverables, isSimulating]);

    useEffect(() => {
        if(isCoreSimFinished && isRefinementEnabled) {
            updateAgentStatus(AgentRole.DEVILS_ADVOCATE, 'working');
        }
    }, [isCoreSimFinished, isRefinementEnabled]);

    useEffect(() => {
        return () => {
            if (generatedVideoUrl && generatedVideoUrl.startsWith('blob:')) {
                URL.revokeObjectURL(generatedVideoUrl);
            }
        };
    }, [generatedVideoUrl]);

    const handleDeliverableToggle = (role: AgentRole) => {
        setSelectedDeliverables(prev => {
            const newSet = new Set(prev);
            if (newSet.has(role)) {
                newSet.delete(role);
            } else {
                newSet.add(role);
            }
            return newSet;
        });
    };

    const handleLogin = async (userProfile: UserProfile, rememberMe: boolean = true) => {
        setIsTransitioning(true);
        setTimeout(async () => {
            storageService.setCurrentUser(userProfile, rememberMe);
            setCurrentUser(userProfile);
            const runs = await storageService.getRuns(userProfile.username);
            setSavedRuns(runs);
            setJustLoggedIn(true);

            if (navigator.storage && navigator.storage.persist) {
                try {
                    const isPersisted = await navigator.storage.persisted();
                    if (!isPersisted) {
                        const result = await navigator.storage.persist();
                        if (result) {
                            console.log("Persistent storage permission granted.");
                        } else {
                            console.warn("Persistent storage permission was not granted.");
                        }
                    }
                } catch (error) {
                    console.error("Failed to request or check persistent storage:", error);
                }
            }
        }, 500);
    };
    
    const handleLogout = () => {
        storageService.clearCurrentUser();
        setCurrentUser(null);
        setIsTransitioning(false);
        setSavedRuns([]);
        resetSimulation();
    };

    const loadRunData = (run: SavedRun) => {
        const reportData = run.report;
        setChallenge(run.challenge);
        setUserSolution(reportData.userSolution || '');
        setStrategicDirective(reportData.strategicDirective || 'BALANCED');
        setIdeaArea(reportData.ideaArea || IDEA_AREAS[0].value);
        setTargetMarket(reportData.targetMarket || TARGET_MARKETS[0].value);
        setUserContext(reportData.userContext || null);
        
        setFounders(reportData.founders || [{ id: crypto.randomUUID(), name: '', description: '', photoB64: null, reportText: null, reportFileName: null, analysisProfile: null, manualTraits: {} }]);
        setFounderDna(reportData.founderDna);

        setResearch(reportData.research);
        setCustomerPersona(reportData.customerPersona);
        setEmpathyMap(reportData.empathyMap);
        setProblemStatement(reportData.problemStatement);

        setTechnologyScoutReport(reportData.technologyScoutReport);
        setAllSolutions(reportData.allSolutions);
        setAllCritiques(reportData.allCritiques);
        setSolutionScoring(reportData.solutionScoring);
        setSelectedSolution(reportData.selectedSolution);
        setIpStrategy(reportData.ipStrategy);
        setTalentStrategy(reportData.talentStrategy || null);
        setValueProposition(reportData.valueProposition);
        setLeanCanvas(reportData.leanCanvas);
        setStoryboard(reportData.storyboard);
        setFinancialPlan(reportData.financialPlan);
        setRiskAnalysis(reportData.riskAnalysis);
        setTechnicalBlueprint(reportData.technicalBlueprint);
        setGoToMarket(reportData.goToMarket);
        setStrategy(reportData.strategy);
        setRedTeamReport(reportData.redTeam);
        setEthicsReport(reportData.ethicsReport);
        setPitchDeck(reportData.pitchDeck);
        setInvestmentMemo(reportData.investmentMemo || null);
        setSuccessScore(reportData.successScore);
        setUsageMetrics(reportData.usageMetrics || null);

        setActiveRunId(run.id);
        setIsSaved(true);
        setActiveTab('overview');
        setAgents(AGENT_DEFINITIONS.map(a => ({...a, status: 'done'})));
        setIsSimulating(false);
        setIsCoreSimFinished(true);
        setHasGeneratedDeliverables(true);
        setError(null);
        setIsScouting(null);
        setScoutError({});
    };

    const handleLoadRun = (runId: string) => {
        if (!currentUser) return;
        const runToLoad = savedRuns.find(run => run.id === runId);
        if (runToLoad) {
            loadRunData(runToLoad);
            setShowHistoryModal(false);
        }
    };
    
    const handleDeleteRun = async (runId: string) => {
        if (!currentUser) return;
        await storageService.deleteRun(runId);
        const updatedRuns = await storageService.getRuns(currentUser.username);
        setSavedRuns(updatedRuns);
    };

    const updateAgentStatus = (role: AgentRole, status: AgentStatus, output?: any) => {
        setAgents(prevAgents =>
            prevAgents.map(agent =>
                agent.role === role ? { ...agent, status, output: output || agent.output, tokenUsage: output?.tokenUsage } : agent
            )
        );
    };

    const resetSimulation = () => {
        setAgents(AGENT_DEFINITIONS);
        setChallenge('');
        setUserSolution('');
        setIdeaArea(IDEA_AREAS[0].value);
        setTargetMarket(TARGET_MARKETS[0].value);
        setFounders([{ id: crypto.randomUUID(), name: '', description: '', photoB64: null, reportText: null, reportFileName: null, analysisProfile: null, manualTraits: {} }]);
        setStrategicDirective('BALANCED');
        setIsRefinementEnabled(true);
        setUseFounderDnaInIdeation(false);
        setIsSimulating(false);
        setIsCoreSimFinished(false);
        setHasGeneratedDeliverables(false);
        setIsAwaitingIdeaComparison(false);
        setIsAwaitingChallengeSelection(false);
        setSuggestedChallenges(null);
        setIsAwaitingProblemFraming(false);
        setSuggestedProblemFrames(null);
        setIsAwaitingBrandNameSelection(false);
        setSuggestedBrandNames([]);
        setUserSelectedBrandName(null);
        setIsGeneratingDeliverables(false);
        setIsEnhancing(false);
        setEnhancementError(null);
        setError(null);
        setCopied(false);
        setSelectedAgent(null);
        setActiveRunId(null);
        setIsSaved(false);
        setActiveTab('overview');
        setPersonaToChat(null);
        setTotalTokens(0);
        
        setCompletedAgents(0);
        setTotalAgentsToRun(0);
        
        setUserContext(null);
        setContextFileName(null);
        setIsParsingPdf(false);
        setParsingError(null);
        if(fileInputRef.current) fileInputRef.current.value = "";

        setIsRedTeaming(false);
        setRedTeamError(null);
        setIsAuditingEthics(false);
        setEthicsError(null);
        setIsScoring(false);
        setScoringError(null);
        setIsModelingScenarios(false);
        setScenarioError(null);
        setSearchingFounderId(null);
        setFounderSearchError({});
        setAnalyzingFounderId(null);
        setFounderAnalysisError({});
        setManualInputFounderId(null);
        setIsScouting(null);
        setScoutError({});
        setAnalyzingCvId(null);
        setCvAnalysisError({});
        setAnalysisSuccess({});

        if (generatedVideoUrl && generatedVideoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(generatedVideoUrl);
        }
        setGeneratedVideoUrl(null);
        setIsGeneratingVideo(false);
        setVideoGenerationProgress([]);
        setVideoGenerationError(null);

        setFounderDna(null);
        setResearch(null);
        setCustomerPersona(null);
        setEmpathyMap(null);
        setProblemStatement(null);
        setTechnologyScoutReport(null);
        setAllSolutions(null);
        setAllCritiques(null);
        setSolutionScoring(null);
        setSelectedSolution(null);
        setIpStrategy(null);
        setTalentStrategy(null);
        setValueProposition(null);
        setLeanCanvas(null);
        setStoryboard(null);
        setFinancialPlan(null);
        setRiskAnalysis(null);
        setTechnicalBlueprint(null);
        setGoToMarket(null);
        setStrategy(null);
        setRedTeamReport(null);
        setEthicsReport(null);
        setPitchDeck(null);
        setInvestmentMemo(null);
        setSuccessScore(null);
        setUsageMetrics(null);
    };

    const handleCopy = () => {
        if (!isFinished) return;
        
        const reportData: ReportData = {
            strategicDirective,
            ideaArea,
            targetMarket,
            userContext,
            userSolution,
            founders,
            founderDna,
            research,
            customerPersona: customerPersona ? { ...customerPersona, avatarB64: undefined } : null,
            empathyMap,
            problemStatement,
            technologyScoutReport,
            allSolutions,
            allCritiques,
            ventureAnalysis: null,
            solutionScoring,
            selectedSolution,
            ipStrategy,
            talentStrategy,
            valueProposition,
            leanCanvas,
            storyboard: storyboard ? { ...storyboard, panels: storyboard.panels.map(p => ({...p, imageB64: undefined})) } : null,
            financialPlan: financialPlan ? { ...financialPlan, elevatorPitchImageB64: undefined } : null,
            investmentMemo,
            riskAnalysis,
            technicalBlueprint,
            goToMarket,
            strategy,
            redTeam: redTeamReport,
            ethicsReport,
            pitchDeck,
            successScore,
            usageMetrics
        };
        navigator.clipboard.writeText(JSON.stringify({ challenge, report: reportData }, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGeneratePdf = async () => {
        if (!reportRef.current) {
            console.error("Report component is not available.");
            return;
        }
        setIsGeneratingPdf(true);
        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                windowWidth: reportRef.current.scrollWidth,
                windowHeight: reportRef.current.scrollHeight,
            });
    
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgHeight = (canvas.height * pdfWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;
    
            let pageCount = 1;
            while (heightLeft > 0) {
                position = -pdfHeight * pageCount;
                pdf.addPage();
                pageCount++;
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
    
            for (let i = 1; i <= pageCount; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(150);
                if (i > 1) { 
                    pdf.text(`© ${new Date().getFullYear()} Xinovates | Saïd Business School, University of Oxford`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });
                    pdf.text(`Page ${i - 1} of ${pageCount - 1}`, pdfWidth - 25, pdfHeight - 10);
                }
            }
            
            const brandName = financialPlan?.selectedBrandName || 'Xinovates';
            pdf.save(`${brandName}-Report.pdf`);
    
        } catch (e) {
            console.error("Failed to generate PDF:", e);
            setError("Could not generate the PDF report. Please try again.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    const handleGeneratePitchDeckPdf = async () => {
        if (!pitchDeckRef.current || !pitchDeck) {
            setError("Pitch deck content is not available.");
            return;
        }
        setIsGeneratingDeck(true);
    
        try {
            // Find all nested slide elements
            const slideElements = Array.from(pitchDeckRef.current.querySelectorAll('.break-after-page > div'));
            
            const pdf = new jsPDF('l', 'mm', 'a4'); 
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
    
            for (let i = 0; i < slideElements.length; i++) {
                const slideElement = slideElements[i] as HTMLElement;
                const canvas = await html2canvas(slideElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                });
    
                if (i > 0) {
                    pdf.addPage();
                }
    
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            }
            
            const brandName = financialPlan?.selectedBrandName || 'Xinovates';
            pdf.save(`${brandName}-Pitch-Deck.pdf`);
    
        } catch (e) {
            console.error("Failed to generate Pitch Deck PDF:", e);
            setError("Could not generate the Pitch Deck PDF. Please try again.");
        } finally {
            setIsGeneratingDeck(false);
        }
    };
    
    const handleGenerateShareableHtml = () => {
        if (!shareableReportRef.current || !isFinished || !financialPlan) {
            setError("Cannot generate shareable page, data is missing.");
            return;
        }
        setIsGeneratingHtml(true);
    
        try {
            const content = shareableReportRef.current.innerHTML;
            const brandName = financialPlan?.selectedBrandName || 'Xinovates Venture Plan';
            
            const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${brandName}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
            .printable-section { break-inside: avoid; }
            img { max-width: 100%; height: auto; border-radius: 0.5rem; }
            table { min-width: 100%; }
        </style>
    </head>
    <body class="bg-gray-50 text-gray-800">
        ${content}
    </body>
    </html>
            `;
    
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${financialPlan.selectedBrandName}-Venture-Plan.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Failed to generate shareable HTML:", e);
            setError("Could not generate the shareable HTML page. Please try again.");
        } finally {
            setIsGeneratingHtml(false);
        }
    };

    const handleSaveRun = async () => {
        if (!currentUser || !isFinished) return;
        
        const reportData: ReportData = {
            strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, 
            ventureAnalysis: null,
            solutionScoring, selectedSolution,
            ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy,
            redTeam: redTeamReport,
            ethicsReport,
            pitchDeck: pitchDeck,
            investmentMemo,
            successScore,
            usageMetrics,
        };

        const run: SavedRun = {
            id: activeRunId || crypto.randomUUID(),
            username: currentUser.username,
            savedAt: new Date().toISOString(),
            challenge: challenge,
            title: financialPlan?.selectedBrandName,
            report: reportData
        };

        await storageService.saveRun(run);
        const updatedRuns = await storageService.getRuns(currentUser.username);
        setSavedRuns(updatedRuns);
        setActiveRunId(run.id);
        setIsSaved(true);
    };

    const handleGenerateTrends = async (market: string) => {
        if (!isAuthorized) {
            setError("Unauthorized access.");
            return [];
        }
        const { data, usage } = await runChallengeGeneration(TARGET_MARKETS.find(m => m.value === market)?.label || market, modelMode);
        return data.challenges;
    };

    const handleSelectTrend = (selectedTrend: string) => {
        setChallenge(selectedTrend);
        setShowTrendSpotterModal(false);
    };

    const handleFounderUpdate = (id: string, field: keyof Omit<FounderInput, 'id'>, value: any) => {
        setFounders(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    };

    const handleFounderTraitUpdate = (founderId: string, trait: string, value: number) => {
        setFounders(prev => prev.map(f => {
            if (f.id === founderId) {
                const newTraits = { ...(f.manualTraits || {}), [trait]: value };
                return { ...f, manualTraits: newTraits };
            }
            return f;
        }));
    };

    const handleAddFounder = () => {
        setFounders(prev => [...prev, { id: crypto.randomUUID(), name: '', description: '', photoB64: null, reportText: null, reportFileName: null, analysisProfile: null, manualTraits: {} }]);
    };

    const handleRemoveFounder = (id: string) => {
        setFounders(prev => prev.filter(f => f.id !== id));
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleFounderUpdate(id, 'photoB64', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setCvAnalysisError(prev => ({ ...prev, [id]: null }));
        setAnalyzingCvId(id);

        try {
            let textContent = '';
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textData = await page.getTextContent();
                    textContent += textData.items.map(item => 'str' in item ? item.str : '').join(' ') + '\n';
                }
            } else if (file.type === 'text/plain') {
                textContent = await file.text();
            } else {
                throw new Error('Unsupported file type. Please upload a PDF or TXT file.');
            }
            
            const founder = founders.find(f => f.id === id);
            if (!founder) throw new Error('Founder not found');
            
            const { data, usage } = await runCvAnalysis(founder.name, textContent, modelMode);
            handleFounderUpdate(id, 'description', data.summary);
            setTotalTokens(prev => prev + usage.total);

        } catch (err) {
            console.error("Error processing CV:", err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to process CV.';
            setCvAnalysisError(prev => ({ ...prev, [id]: errorMessage }));
        } finally {
            setAnalyzingCvId(null);
        }

        if (e.target) e.target.value = '';
    };

    const analyzeFounder = async (founderId: string, founderName: string, reportText: string) => {
        setAnalyzingFounderId(founderId);
        setFounderAnalysisError(prev => ({ ...prev, [founderId]: null }));
        try {
            const { data, usage } = await runFounderReportAnalysis(founderName, reportText, modelMode);
            
            setFounders(prev => prev.map(f => {
                if (f.id === founderId) {
                    // Update only analysisProfile, preserving description (Hard Skills)
                    return { ...f, analysisProfile: data };
                }
                return f;
            }));
            
            setAnalysisSuccess(prev => ({ ...prev, [founderId]: true }));
            setTotalTokens(prev => prev + usage.total);
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setAnalysisSuccess(prev => ({ ...prev, [founderId]: false }));
            }, 5000);

        } catch (e) {
            console.error("Founder analysis failed:", e);
            const errorMessage = e instanceof Error ? e.message : "Failed to analyze the report.";
            setFounderAnalysisError(prev => ({ ...prev, [founderId]: errorMessage }));
        } finally {
            setAnalyzingFounderId(null);
        }
    }

    const handleAnalyzeManualTraits = async (founderId: string) => {
        const founder = founders.find(f => f.id === founderId);
        if (!founder || !founder.name.trim()) return;

        const reportText = `Founder Self-Assessment for ${founder.name}:\n` +
            PREDEFINED_TRAITS.map(trait =>
                `- ${trait}: Score ${founder.manualTraits?.[trait] || 50}`
            ).join('\n');

        await analyzeFounder(founderId, founder.name, reportText);
        setManualInputFounderId(null);
    };

    const handleFounderSearch = async (founderId: string) => {
        const founder = founders.find(f => f.id === founderId);
        if (!founder || !founder.name.trim()) return;
    
        setSearchingFounderId(founderId);
        setFounderSearchError(prev => ({ ...prev, [founderId]: null }));
        try {
            const { data, usage } = await runFounderResearch(founder.name, modelMode);
            if (data.summary) {
                handleFounderUpdate(founderId, 'description', data.summary);
            } else {
                 handleFounderUpdate(founderId, 'description', 'No professional information found online.');
            }
            setTotalTokens(prev => prev + usage.total); 
        } catch (e) {
            console.error("Founder search failed:", e);
            const errorMessage = e instanceof Error ? e.message : "Failed to search for founder information.";
            setFounderSearchError(prev => ({ ...prev, [founderId]: errorMessage }));
        } finally {
            setSearchingFounderId(null);
        }
    };
    
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setParsingError('Please upload a valid PDF file.');
            return;
        }
        
        setUserContext(null);
        setContextFileName(null);
        setParsingError(null);
        setIsParsingPdf(true);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target?.result;
                    if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
                        throw new Error("Could not read file into ArrayBuffer.");
                    }
                    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                    let fullText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join(' ');
                        fullText += pageText + '\n\n';
                    }
                    setUserContext(fullText);
                    setContextFileName(file.name);
                } catch (err) {
                    console.error("Error parsing PDF:", err);
                    setParsingError(err instanceof Error ? err.message : 'Failed to parse PDF.');
                    setUserContext(null);
                    setContextFileName(null);
                } finally {
                    setIsParsingPdf(false);
                }
            };
            reader.onerror = () => {
                setParsingError('Failed to read file.');
                setIsParsingPdf(false);
            }
            reader.readAsArrayBuffer(file);

        } catch (err) {
            console.error("Error with file reader:", err);
            setParsingError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setIsParsingPdf(false);
        }
        
        if (e.target) e.target.value = '';
    };

    const handleRemoveContext = () => {
        setUserContext(null);
        setContextFileName(null);
        setParsingError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleCoreSimulation = useCallback(async () => {
        if (!currentUser) return;
        
        if (!isAuthorized) {
            setError("Account is pending approval. Please wait for an administrator to activate your account.");
            return;
        }

        // Check Run Limits (Initial UI Check)
        if (currentUser.runCount >= currentUser.maxRuns) {
            setError(`Run limit reached (${currentUser.maxRuns}). Please contact support or upgrade.`);
            return;
        }

        const isProblemFirst = workflowMode === 'problemFirst';
        const promptInput = challenge;
        if (!promptInput) {
            setError(`Please enter ${isProblemFirst ? 'an innovation challenge' : 'your solution description'} to start.`);
            return;
        }
        
        // --- Increment Usage Count (Atomic Check) ---
        try {
            const newCount = await storageService.incrementRunCount(currentUser.username);
            // Update local user state immediately so UI reflects usage
            setCurrentUser(prev => prev ? { ...prev, runCount: newCount } : null);
        } catch (err) {
            console.error("Failed to increment run count", err);
            // Handle specifically the Quota Exceeded error
            if (err === 'Quota exceeded' || (typeof err === 'string' && err.includes('Quota'))) {
                 setError(`Run limit reached (${currentUser.maxRuns}). You cannot run another simulation.`);
            } else {
                 setError("Failed to verify usage limits. Please try again.");
            }
            return;
        }

        const currentChallenge = challenge;
        const currentUserSolution = workflowMode === 'solutionFirst' ? challenge : userSolution;
        const currentIdeaArea = ideaArea;
        const currentTargetMarket = targetMarket;
        const currentRefinementSetting = isRefinementEnabled;
        const currentDirective = strategicDirective;
        const currentFounders = founders;
        const currentUseFounderDna = useFounderDnaInIdeation;
        const currentUserContext = userContext;
        const currentSelectedDeliverables = selectedDeliverables;
        const currentWorkflowMode = workflowMode;
        
        resetSimulation();
        
        setChallenge(currentChallenge);
        setUserSolution(currentUserSolution);
        setIdeaArea(currentIdeaArea);
        setTargetMarket(currentTargetMarket);
        setIsRefinementEnabled(currentRefinementSetting);
        setStrategicDirective(currentDirective);
        setFounders(currentFounders);
        setUseFounderDnaInIdeation(currentUseFounderDna);
        setUserContext(currentUserContext);
        setSelectedDeliverables(currentSelectedDeliverables);
        setWorkflowMode(currentWorkflowMode);

        let total = 0;
        if (currentFounders.some(f => f.description.trim() !== '')) {
            total++;
        }

        if (currentWorkflowMode === 'problemFirst') {
            total += 5; 
            if (currentUserSolution.trim() === '') {
                total += 4; 
            } else if (currentRefinementSetting) {
                total += 1; 
            }
        } else { 
            total += 1; 
            total += 4; 
        }

        if (currentRefinementSetting) {
            total++;
        }
        total += currentSelectedDeliverables.size;
        setTotalAgentsToRun(total);
        setCompletedAgents(0);

        setIsSimulating(true);

        let currentTotalTokens = 0;
        const foundersWithDescriptions = founders.filter(f => f.description.trim() !== '');
        
        const ideaAreaLabel = IDEA_AREAS.find(a => a.value === currentIdeaArea)?.label || currentIdeaArea;
        const targetMarketLabel = TARGET_MARKETS.find(m => m.value === currentTargetMarket)?.label || currentTargetMarket;

        try {
            let dnaResult: FounderDnaOutput | null = null;
            if (foundersWithDescriptions.length > 0) {
                updateAgentStatus(AgentRole.FOUNDER_DNA, 'working');
                await delay(500);
                const { data, usage } = await runFounderDna(foundersWithDescriptions, modelMode, strategicDirective);
                dnaResult = data;
                setFounderDna(dnaResult);
                currentTotalTokens += usage.total;
                setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.FOUNDER_DNA, 'done', { output: dnaResult, tokenUsage: usage });
            }
            
            if (isProblemFirst) {
                await runProblemFirstFlow(currentChallenge, currentUserSolution, ideaAreaLabel, targetMarketLabel, currentUserContext, currentUseFounderDna, currentTotalTokens, dnaResult);
            } else {
                await runSolutionFirstFlow(currentUserSolution, ideaAreaLabel, targetMarketLabel, currentTotalTokens);
            }

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setAgents(prev => prev.map(a => a.status === 'working' ? {...a, status: 'error'} : a));
            setIsSimulating(false);
        }
    }, [challenge, userSolution, ideaArea, targetMarket, modelMode, strategicDirective, isRefinementEnabled, founders, useFounderDnaInIdeation, userContext, workflowMode, selectedDeliverables, currentUser, isAuthorized]);
    
    // ... (rest of flow logic functions: runProblemFirstFlow, resumeSimulationWithFrame, etc.) ...
    const runProblemFirstFlow = async (
        currentChallenge: string,
        currentUserSolution: string,
        ideaAreaLabel: string,
        targetMarketLabel: string,
        currentUserContext: string | null,
        currentUseFounderDna: boolean,
        initialTokens: number,
        localFounderDna: FounderDnaOutput | null
    ) => {
        let currentTotalTokens = initialTokens;

        // Step 1: Research
        updateAgentStatus(AgentRole.PROBLEM_RESEARCH, 'working');
        await delay(500);
        const { data: researchResult, usage: researchUsage } = await runProblemResearch(currentChallenge, ideaAreaLabel, targetMarketLabel, modelMode, strategicDirective, currentUserContext);
        updateAgentStatus(AgentRole.PROBLEM_RESEARCH, 'done', { output: researchResult, tokenUsage: researchUsage });
        currentTotalTokens += researchUsage.total;
        setTotalTokens(currentTotalTokens);
        setResearch(researchResult);
        
        // NEW STEP: Problem Framing (if manual solution not provided)
        if (currentUserSolution.trim() === '') {
            // Run Problem Framer Agent
            const { data: framesResult, usage: framesUsage } = await runProblemFraming(currentChallenge, researchResult, modelMode);
            currentTotalTokens += framesUsage.total;
            setTotalTokens(currentTotalTokens);
            setSuggestedProblemFrames(framesResult.problemFrames);
            setIsAwaitingProblemFraming(true);
            setIsSimulating(false); // STOP here and wait for user selection
            return;
        }

        // If user already has a solution, proceed directly (simulating a 'skip' of framing)
        await resumeSimulationWithFrame(null, currentChallenge, currentUserSolution, targetMarketLabel, currentUseFounderDna, currentTotalTokens, localFounderDna);
    };

    const resumeSimulationWithFrame = async (
        selectedFrame: ProblemFrame | null,
        currentChallenge: string,
        currentUserSolution: string,
        targetMarketLabel: string,
        currentUseFounderDna: boolean,
        initialTokens: number,
        localFounderDna: FounderDnaOutput | null
    ) => {
        setIsSimulating(true);
        let currentTotalTokens = initialTokens;
        
        // We assume Research is already done and stored in state `research`
        if (!research) {
            setError("Critical error: Research data missing.");
            setIsSimulating(false);
            return;
        }

        updateAgentStatus(AgentRole.CUSTOMER_PERSONA, 'working');
        await delay(500);
        const { data: personaResult, usage: personaUsage } = await runCustomerPersona(currentChallenge, research, targetMarketLabel, modelMode, strategicDirective, selectedFrame);
        updateAgentStatus(AgentRole.CUSTOMER_PERSONA, 'done', { output: personaResult, tokenUsage: personaUsage });
        currentTotalTokens += personaUsage.total;
        setTotalTokens(currentTotalTokens);
        setCustomerPersona(personaResult);

        updateAgentStatus(AgentRole.EMPATHY_MAP, 'working');
        await delay(500);
        const { data: empathyMapResult, usage: empathyUsage } = await runEmpathyMap(currentChallenge, research, personaResult, modelMode, strategicDirective, selectedFrame);
        updateAgentStatus(AgentRole.EMPATHY_MAP, 'done', { output: empathyMapResult, tokenUsage: empathyUsage });
        currentTotalTokens += empathyUsage.total;
        setTotalTokens(currentTotalTokens);
        setEmpathyMap(empathyMapResult);

        updateAgentStatus(AgentRole.PROBLEM_SYNTHESIZER, 'working');
        await delay(500);
        const { data: problemStatementResult, usage: problemUsage } = await runProblemSynthesizer(currentChallenge, research, personaResult, empathyMapResult, modelMode, strategicDirective, selectedFrame);
        updateAgentStatus(AgentRole.PROBLEM_SYNTHESIZER, 'done', { output: problemStatementResult, tokenUsage: problemUsage });
        currentTotalTokens += problemUsage.total;
        setTotalTokens(currentTotalTokens);
        setProblemStatement(problemStatementResult);
        
        updateAgentStatus(AgentRole.TECHNOLOGY_SCOUT, 'working');
        await delay(500);
        const { data: techScoutResult, usage: techScoutUsage } = await runTechnologyScout(problemStatementResult, modelMode, strategicDirective);
        updateAgentStatus(AgentRole.TECHNOLOGY_SCOUT, 'done', { output: techScoutResult, tokenUsage: techScoutUsage });
        currentTotalTokens += techScoutUsage.total;
        setTotalTokens(currentTotalTokens);
        setTechnologyScoutReport(techScoutResult);

        if (currentUserSolution.trim() !== '') {
            // ... (rest of solution provided flow) ...
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'done', { output: { solutions: [] }, tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'done', { output: [], tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'done', { output: null, tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.SOLUTION_EVOLUTION, 'done', { output: null, tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.SOLUTION_SELECTION, 'working');
            await delay(500);

            const { data: brandNameResult, usage: brandNameUsage } = await runBrandNameSuggestion(currentUserSolution, problemStatementResult.problemStatement, modelMode, strategicDirective);
            currentTotalTokens += brandNameUsage.total;
            setTotalTokens(currentTotalTokens);
            setSuggestedBrandNames(brandNameResult.suggestedNames);
            setIsAwaitingBrandNameSelection(true);
        } else {
            // ... (rest of ideation flow) ...
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'working');
            await delay(500);
            const { data: ideationResult, usage: ideationUsage } = await runSolutionIdeation(problemStatementResult, techScoutResult, modelMode, strategicDirective, currentUseFounderDna ? localFounderDna : null);
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'done', { output: ideationResult, tokenUsage: ideationUsage });
            currentTotalTokens += ideationUsage.total;
            setTotalTokens(currentTotalTokens);
            setAllSolutions(ideationResult);

            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'working');
            await delay(500);
            const { data: critiqueResult, usage: critiqueUsage } = await runSolutionCritique(ideationResult, modelMode, strategicDirective);
            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'done', { output: critiqueResult, tokenUsage: critiqueUsage });
            currentTotalTokens += critiqueUsage.total;
            setTotalTokens(currentTotalTokens);
            setAllCritiques(critiqueResult);

            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'working');
            await delay(500);
            const { data: scoringResult, usage: scoringUsage } = await runSolutionScoring(problemStatementResult, ideationResult, critiqueResult, modelMode, strategicDirective, localFounderDna);
            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'done', { output: scoringResult, tokenUsage: scoringUsage });
            currentTotalTokens += scoringUsage.total;
            setTotalTokens(currentTotalTokens);
            setSolutionScoring(scoringResult);
            
            setIsAwaitingIdeaComparison(true);
        }
        setIsSimulating(false);
    };

    const handleProblemFrameSelection = async (frame: ProblemFrame) => {
        setIsAwaitingProblemFraming(false);
        const targetMarketLabel = TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket;
        // Resume simulation
        await resumeSimulationWithFrame(frame, challenge, userSolution, targetMarketLabel, useFounderDnaInIdeation, totalTokens, founderDna);
    };

    const runSolutionFirstFlow = async (
        currentUserSolution: string,
        ideaAreaLabel: string,
        targetMarketLabel: string,
        initialTokens: number
    ) => {
        let currentTotalTokens = initialTokens;
        
        updateAgentStatus(AgentRole.MARKET_FIT_ANALYST, 'working');
        await delay(500);
        const { data: marketFitResult, usage: marketFitUsage } = await runMarketFitAnalysis(currentUserSolution, ideaAreaLabel, targetMarketLabel, modelMode, strategicDirective);
        updateAgentStatus(AgentRole.MARKET_FIT_ANALYST, 'done', { output: marketFitResult, tokenUsage: marketFitUsage });
        currentTotalTokens += marketFitUsage.total;
        setTotalTokens(currentTotalTokens);
        
        setSuggestedChallenges(marketFitResult.challenges);
        setIsAwaitingChallengeSelection(true);
        setIsSimulating(false);
    };
    
    const handleChallengeSelection = async (selectedChallenge: ProblemStatementOutput) => {
        setIsAwaitingChallengeSelection(false);
        setProblemStatement(selectedChallenge);
        setChallenge(selectedChallenge.problemStatement); 
        
        setIsSimulating(true);
        let currentTotalTokens = totalTokens;
        const ideaAreaLabel = IDEA_AREAS.find(a => a.value === ideaArea)?.label || ideaArea;
        const targetMarketLabel = TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket;

        try {
            updateAgentStatus(AgentRole.MARKET_FIT_ANALYST, 'done');
            
            updateAgentStatus(AgentRole.PROBLEM_RESEARCH, 'working');
            await delay(500);
            const { data: researchResult, usage: researchUsage } = await runProblemResearch(selectedChallenge.problemStatement, ideaAreaLabel, targetMarketLabel, modelMode, strategicDirective, userContext);
            updateAgentStatus(AgentRole.PROBLEM_RESEARCH, 'done', { output: researchResult, tokenUsage: researchUsage });
            currentTotalTokens += researchUsage.total; setTotalTokens(currentTotalTokens);
            setResearch(researchResult);

            // In solution-first flow, we skip manual problem framing because the user already selected a challenge from the Market Fit Analyst.
            // We pass null as problemFrame.

            updateAgentStatus(AgentRole.CUSTOMER_PERSONA, 'working');
            await delay(500);
            const { data: personaResult, usage: personaUsage } = await runCustomerPersona(selectedChallenge.problemStatement, researchResult, targetMarketLabel, modelMode, strategicDirective, null);
            updateAgentStatus(AgentRole.CUSTOMER_PERSONA, 'done', { output: personaResult, tokenUsage: personaUsage });
            currentTotalTokens += personaUsage.total; setTotalTokens(currentTotalTokens);
            setCustomerPersona(personaResult);

            updateAgentStatus(AgentRole.EMPATHY_MAP, 'working');
            await delay(500);
            const { data: empathyMapResult, usage: empathyUsage } = await runEmpathyMap(selectedChallenge.problemStatement, researchResult, personaResult, modelMode, strategicDirective, null);
            updateAgentStatus(AgentRole.EMPATHY_MAP, 'done', { output: empathyMapResult, tokenUsage: empathyUsage });
            currentTotalTokens += empathyUsage.total; setTotalTokens(currentTotalTokens);
            setEmpathyMap(empathyMapResult);
            
            updateAgentStatus(AgentRole.PROBLEM_SYNTHESIZER, 'done', { output: selectedChallenge, tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'done', { output: { solutions: [] }, tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'done', { output: [], tokenUsage: emptyUsage() });
            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'done', { output: null, tokenUsage: emptyUsage() });

            updateAgentStatus(AgentRole.TECHNOLOGY_SCOUT, 'working');
            await delay(500);
            const { data: techScoutResult, usage: techScoutUsage } = await runTechnologyScout(selectedChallenge, modelMode, strategicDirective);
            updateAgentStatus(AgentRole.TECHNOLOGY_SCOUT, 'done', { output: techScoutResult, tokenUsage: techScoutUsage });
            currentTotalTokens += techScoutUsage.total;
            setTotalTokens(currentTotalTokens);
            setTechnologyScoutReport(techScoutResult);
            
            updateAgentStatus(AgentRole.SOLUTION_SELECTION, 'working');
            const { data: brandNameResult, usage: brandNameUsage } = await runBrandNameSuggestion(userSolution, selectedChallenge.problemStatement, modelMode, strategicDirective);
            currentTotalTokens += brandNameUsage.total; setTotalTokens(currentTotalTokens);
            setSuggestedBrandNames(brandNameResult.suggestedNames);
            setIsAwaitingBrandNameSelection(true);

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
            setAgents(prev => prev.map(a => a.status === 'working' ? {...a, status: 'error'} : a));
        } finally {
            setIsSimulating(false);
        }
    };
    
    const handleBrandNameSelection = async (brandName: string) => {
        setUserSelectedBrandName(brandName);
    
        const userProvidedSolution: SolutionSelectionOutput = {
            selectedSolutionId: 1,
            solutionTitle: "User-Provided Solution",
            solutionDescription: userSolution,
            justification: "This solution was provided directly by the user to serve as the basis for the venture plan.",
            pros: ["Clear initial vision provided by the founder.", "Bypasses brainstorming for faster path to planning."],
            cons: ["The solution has not been subjected to AI-driven critique or compared against other alternatives."]
        };
    
        setSelectedSolution(userProvidedSolution);
        updateAgentStatus(AgentRole.SOLUTION_EVOLUTION, 'done', { output: userProvidedSolution, tokenUsage: emptyUsage() });
        updateAgentStatus(AgentRole.SOLUTION_SELECTION, 'done', { output: userProvidedSolution, tokenUsage: emptyUsage() });
        
        setIsAwaitingBrandNameSelection(false);

        if (userSolution.trim() !== '' && isRefinementEnabled) {
            setIsSimulating(true); 
            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'working');
            try {
                const ideationForCritique: IdeationOutput = {
                    solutions: [{
                        id: 1,
                        title: userProvidedSolution.solutionTitle,
                        summary: "User-provided solution.",
                        description: userProvidedSolution.solutionDescription,
                    }]
                };
                const { data: critiqueResult, usage: critiqueUsage } = await runSolutionCritique(ideationForCritique, modelMode, strategicDirective);
                setTotalTokens(prev => prev + critiqueUsage.total);
                updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'done', { output: critiqueResult, tokenUsage: critiqueUsage });
                setAllCritiques(critiqueResult);
            } catch (e) {
                console.error("Error generating critique for user solution:", e);
                setError(e instanceof Error ? e.message : "Failed to generate critique for the provided solution.");
                updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'error');
                setIsSimulating(false);
                return; 
            } finally {
                setIsSimulating(false);
            }
        }
        
        setIsCoreSimFinished(true);
    };

    const handleIdeaSelection = async (solutionId: number) => {
        if (!solutionScoring || !allSolutions || !allCritiques) return;

        setIsAwaitingIdeaComparison(false);
        setIsSimulating(true);

        try {
            updateAgentStatus(AgentRole.SOLUTION_EVOLUTION, 'working');
            await delay(500);

            const tempVentureAnalysis: VentureAnalystOutput = {
                rankedSolutions: solutionScoring.scores.map((s, index) => ({
                    id: s.solutionId,
                    title: allSolutions.solutions.find(sol => sol.id === s.solutionId)?.title || `Solution ${s.solutionId}`,
                    rank: index + 1,
                    justification: '',
                })),
                debateSummary: solutionScoring.recommendationText,
                recommendedSolutionId: solutionId 
            };

            const { data: evolvedSolution, usage: evolutionUsage } = await runSolutionEvolution(
                tempVentureAnalysis,
                allSolutions,
                allCritiques,
                modelMode,
                strategicDirective
            );
            
            setTotalTokens(prev => prev + evolutionUsage.total);
            updateAgentStatus(AgentRole.SOLUTION_EVOLUTION, 'done', { output: evolvedSolution, tokenUsage: evolutionUsage });
            
            setSelectedSolution(evolvedSolution);
            updateAgentStatus(AgentRole.SOLUTION_SELECTION, 'done', { output: evolvedSolution, tokenUsage: emptyUsage() });

            setIsCoreSimFinished(true);

        } catch (e) {
            console.error("Error during solution evolution:", e);
            setError(e instanceof Error ? e.message : "Failed to evolve the selected solution.");
            updateAgentStatus(AgentRole.SOLUTION_EVOLUTION, 'error');
        } finally {
            setIsSimulating(false);
        }
    };

    const handleRegenerateIdeas = useCallback(async () => {
        if (!problemStatement || !technologyScoutReport) {
            setError('Cannot regenerate ideas without a problem statement and tech research.');
            return;
        }

        setIsSimulating(true);
        setError(null);
        let currentTotalTokens = totalTokens;
        let localFounderDna = founderDna;

        try {
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'working');
            await delay(500);
            const { data: ideationResult, usage: ideationUsage } = await runSolutionIdeation(problemStatement, technologyScoutReport, modelMode, strategicDirective, useFounderDnaInIdeation ? localFounderDna : null);
            updateAgentStatus(AgentRole.SOLUTION_IDEATION, 'done', { output: ideationResult, tokenUsage: ideationUsage });
            currentTotalTokens += ideationUsage.total;
            setAllSolutions(ideationResult);

            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'working');
            await delay(500);
            const { data: critiqueResult, usage: critiqueUsage } = await runSolutionCritique(ideationResult, modelMode, strategicDirective);
            updateAgentStatus(AgentRole.SOLUTION_CRITIQUE, 'done', { output: critiqueResult, tokenUsage: critiqueUsage });
            currentTotalTokens += critiqueUsage.total;
            setAllCritiques(critiqueResult);

            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'working');
            await delay(500);
            const { data: scoringResult, usage: scoringUsage } = await runSolutionScoring(problemStatement, ideationResult, critiqueResult, modelMode, strategicDirective, founderDna);
            updateAgentStatus(AgentRole.VENTURE_ANALYST, 'done', { output: scoringResult, tokenUsage: scoringUsage });
            currentTotalTokens += scoringUsage.total;
            setSolutionScoring(scoringResult);

            setTotalTokens(currentTotalTokens);

        } catch (e) {
             console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during regeneration.');
            setAgents(prev => prev.map(a => a.status === 'working' ? {...a, status: 'error'} : a));
        } finally {
            setIsSimulating(false);
        }
    }, [problemStatement, technologyScoutReport, modelMode, strategicDirective, useFounderDnaInIdeation, founderDna, totalTokens]);


    const handleCancelEnhancement = useCallback(() => {
        enhancementCancelledRef.current = true;
        setIsEnhancing(false);
        setEnhancementError("Solution enhancement cancelled by user.");
        setEnhancementProgress(prev => [...prev, "Process cancelled."]);
    }, []);

    const handleEnhanceSolution = useCallback(async () => {
        if (!problemStatement || !selectedSolution || !allCritiques) return;
        
        const critique = allCritiques.find(c => c.solutionId === selectedSolution.selectedSolutionId);
        if (!critique) {
            setEnhancementError("Could not find critique for the selected solution.");
            return;
        }

        enhancementCancelledRef.current = false;
        setIsEnhancing(true);
        setEnhancementError(null);
        setEnhancementProgress([]);
        updateAgentStatus(AgentRole.DEVILS_ADVOCATE, 'working');

        const onProgress = (message: string) => {
            if (!enhancementCancelledRef.current) {
                setEnhancementProgress(prev => [...prev, message]);
            }
        };

        try {
            const { data: enhancementResult, usage } = await runSolutionEnhancement(
                problemStatement.problemStatement,
                selectedSolution,
                critique.devilsAdvocate,
                modelMode,
                strategicDirective,
                onProgress
            );

            if (enhancementCancelledRef.current) {
                console.log("Enhancement was cancelled, ignoring result.");
                return;
            }

            setTotalTokens(prev => prev + usage.total);
            updateAgentStatus(AgentRole.DEVILS_ADVOCATE, 'working', { output: enhancementResult, tokenUsage: usage });

            setSelectedSolution(prev => {
                if (!prev) return null;
                const newHistory = [...(prev.history || []), {
                    title: prev.solutionTitle,
                    description: prev.solutionDescription,
                    justification: prev.justification
                }];
                return {
                    ...prev,
                    solutionTitle: enhancementResult.refinedSolutionTitle,
                    solutionDescription: enhancementResult.refinedSolutionDescription,
                    justification: enhancementResult.justificationForChange,
                    history: newHistory
                }
            });

        } catch (e) {
            if (!enhancementCancelledRef.current) {
                console.error("Enhancement failed:", e);
                setEnhancementError(e instanceof Error ? e.message : "Failed to enhance solution.");
            }
        } finally {
            if (!enhancementCancelledRef.current) {
                setIsEnhancing(false);
            }
        }
    }, [problemStatement, selectedSolution, allCritiques, modelMode, strategicDirective]);

    const handleDeliverableGeneration = useCallback(async () => {
        if (!problemStatement || !selectedSolution || !customerPersona || !research) {
            setError('Core simulation data is missing. Please start over.');
            return;
        }

        setIsGeneratingDeliverables(true);
        updateAgentStatus(AgentRole.DEVILS_ADVOCATE, 'done');
        setError(null);
        let currentTotalTokens = totalTokens;
        
        const targetMarketLabel = TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket;

        try {
            const history = { problemStatement: problemStatement.problemStatement, solution: selectedSolution.solutionDescription, targetMarket: targetMarketLabel };
            
            let ipResult: IpStrategyOutput | null = null;
            if (selectedDeliverables.has(AgentRole.IP_STRATEGIST)) {
                updateAgentStatus(AgentRole.IP_STRATEGIST, 'working');
                await delay(500);
                const { data, usage } = await runIpStrategyAnalysis(selectedSolution.solutionDescription, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.IP_STRATEGIST, 'done', { output: data, tokenUsage: usage });
                setIpStrategy(data);
                ipResult = data;
            }

            if (selectedDeliverables.has(AgentRole.TALENT_STRATEGIST) && founderDna) {
                updateAgentStatus(AgentRole.TALENT_STRATEGIST, 'working');
                await delay(500);
                const { data, usage } = await runTalentStrategy(selectedSolution, founderDna, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.TALENT_STRATEGIST, 'done', { output: data, tokenUsage: usage });
                setTalentStrategy(data);
            }

            let vpcResult: ValuePropositionCanvasOutput | null = null;
            if (selectedDeliverables.has(AgentRole.VALUE_PROPOSITION)) {
                updateAgentStatus(AgentRole.VALUE_PROPOSITION, 'working');
                await delay(500);
                const { data, usage } = await runValueProposition(history, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.VALUE_PROPOSITION, 'done', { output: data, tokenUsage: usage });
                setValueProposition(data);
                vpcResult = data;
            }

            let leanCanvasResult: LeanCanvasOutput | null = null;
            if (selectedDeliverables.has(AgentRole.LEAN_CANVAS) && vpcResult) {
                updateAgentStatus(AgentRole.LEAN_CANVAS, 'working');
                await delay(500);
                const { data, usage } = await runLeanCanvas(history, vpcResult, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.LEAN_CANVAS, 'done', { output: data, tokenUsage: usage });
                setLeanCanvas(data);
                leanCanvasResult = data;
            }

            let storyboardResult: StoryboardOutput | null = null;
            if (selectedDeliverables.has(AgentRole.STORYBOARDING) && vpcResult && leanCanvasResult) {
                updateAgentStatus(AgentRole.STORYBOARDING, 'working');
                await delay(500);
                const { data, usage } = await runStoryboarding(history, customerPersona, vpcResult, leanCanvasResult, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.STORYBOARDING, 'done', { output: data, tokenUsage: usage });
                setStoryboard(data);
                storyboardResult = data;
            }
            
            let localFinancialPlan: FinancialPlanningOutput | null = null;
            if (selectedDeliverables.has(AgentRole.FINANCIAL_MODELER) && leanCanvasResult) {
                updateAgentStatus(AgentRole.FINANCIAL_MODELER, 'working');
                await delay(500);
                const { data, usage } = await runFinancialModeler(history, leanCanvasResult, modelMode, strategicDirective, userSelectedBrandName);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.FINANCIAL_MODELER, 'done', { output: data, tokenUsage: usage });
                setFinancialPlan(data);
                localFinancialPlan = data;
            }

            if (selectedDeliverables.has(AgentRole.STRATEGY) && leanCanvasResult) {
                updateAgentStatus(AgentRole.STRATEGY, 'working');
                await delay(500);
                const { data, usage } = await runStrategy(history, leanCanvasResult, research, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.STRATEGY, 'done', { output: data, tokenUsage: usage });
                setStrategy(data);
            }

            if (selectedDeliverables.has(AgentRole.RISK_ANALYSIS)) {
                updateAgentStatus(AgentRole.RISK_ANALYSIS, 'working');
                await delay(500);
                const { data, usage } = await runRiskAnalysis(history, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.RISK_ANALYSIS, 'done', { output: data, tokenUsage: usage });
                setRiskAnalysis(data);
            }

            if (selectedDeliverables.has(AgentRole.TECHNICAL_BLUEPRINT)) {
                updateAgentStatus(AgentRole.TECHNICAL_BLUEPRINT, 'working');
                await delay(500);
                const { data, usage } = await runTechnicalBlueprint(history, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.TECHNICAL_BLUEPRINT, 'done', { output: data, tokenUsage: usage });
                setTechnicalBlueprint(data);
            }
            
            if (selectedDeliverables.has(AgentRole.GO_TO_MARKET)) {
                updateAgentStatus(AgentRole.GO_TO_MARKET, 'working');
                await delay(500);
                const { data, usage } = await runGoToMarket(history, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.GO_TO_MARKET, 'done', { output: data, tokenUsage: usage });
                setGoToMarket(data);
            }
            
            const fullReportForPostAnalysis: ReportData = {
                strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, 
                ventureAnalysis: null,
                solutionScoring, selectedSolution,
                ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard: storyboardResult, financialPlan: localFinancialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy,
                redTeam: null, ethicsReport: null, pitchDeck: null, investmentMemo: null, successScore: null,
            };

            const distilledReport = getDistilledReportForPostAnalysis(fullReportForPostAnalysis);

            let pitchDeckResult: PitchDeckOutput | null = null;
            if (selectedDeliverables.has(AgentRole.PITCH_DECK)) {
                updateAgentStatus(AgentRole.PITCH_DECK, 'working');
                await delay(500);
                const { data, usage } = await runPitchDeck(distilledReport, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.PITCH_DECK, 'done', { output: data, tokenUsage: usage });
                setPitchDeck(data);
                pitchDeckResult = data;
            }
            
            if (selectedDeliverables.has(AgentRole.INVESTMENT_MEMO)) {
                updateAgentStatus(AgentRole.INVESTMENT_MEMO, 'working');
                await delay(500);
                const reportForMemo: ReportData = { ...fullReportForPostAnalysis, pitchDeck: pitchDeckResult };
                const distilledReportForMemo = getDistilledReportForPostAnalysis(reportForMemo);
                const { data, usage } = await runInvestmentMemo(distilledReportForMemo, modelMode, strategicDirective);
                currentTotalTokens += usage.total; setTotalTokens(currentTotalTokens);
                updateAgentStatus(AgentRole.INVESTMENT_MEMO, 'done', { output: data, tokenUsage: usage });
                setInvestmentMemo(data);
            }


            const finalCo2g = (currentTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
            setUsageMetrics({ totalTokens: currentTotalTokens, co2g: finalCo2g });

        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'An unknown error occurred during deliverable generation.');
            setAgents(prev => prev.map(a => a.status === 'working' ? {...a, status: 'error'} : a));
        } finally {
            setIsGeneratingDeliverables(false);
            setHasGeneratedDeliverables(true);
        }
    }, [challenge, modelMode, strategicDirective, problemStatement, selectedSolution, customerPersona, research, totalTokens, targetMarket, userSelectedBrandName, selectedDeliverables, founderDna]);
    
    // ... (keep handleRunRedTeam, handleRunEthicsAudit, etc. as they are) ...
    const handleRunRedTeam = async () => {
        if (!isFinished || isRedTeaming) return;

        setIsRedTeaming(true);
        setRedTeamError(null);

        try {
            const fullReport: ReportData = {
                strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, 
                ventureAnalysis: null,
                solutionScoring, selectedSolution,
                ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy,
                redTeam: null,
                ethicsReport: null,
                pitchDeck: pitchDeck,
                investmentMemo: investmentMemo,
                successScore: null,
            };
            const distilledReport = getDistilledReportForPostAnalysis(fullReport);
            const { data: result, usage } = await runRedTeamAnalysis(distilledReport, modelMode, strategicDirective);
            setRedTeamReport(result);
            setActiveTab('redteam');
            const updatedTotalTokens = totalTokens + usage.total;
            setTotalTokens(updatedTotalTokens);
            const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
            setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });
        } catch (e) {
            console.error("Red Team analysis failed:", e);
            setRedTeamError(e instanceof Error ? e.message : "The Red Team analysis failed. Please try again.");
        } finally {
            setIsRedTeaming(false);
        }
    };
    
    const handleRunEthicsAudit = async () => {
        if (!isFinished || isAuditingEthics) return;

        setIsAuditingEthics(true);
        setEthicsError(null);

        try {
            const fullReport: ReportData = {
                strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, 
                ventureAnalysis: null,
                solutionScoring, selectedSolution,
                ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy,
                redTeam: redTeamReport,
                ethicsReport: null,
                pitchDeck: pitchDeck,
                investmentMemo: investmentMemo,
                successScore: null,
            };
            const distilledReport = getDistilledReportForPostAnalysis(fullReport);
            const { data: result, usage } = await runEthicsAnalysis(distilledReport, modelMode, strategicDirective);
            setEthicsReport(result);
            setActiveTab('ethics');
            const updatedTotalTokens = totalTokens + usage.total;
            setTotalTokens(updatedTotalTokens);
            const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
            setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });
        } catch (e) {
            console.error("Ethics audit failed:", e);
            setEthicsError(e instanceof Error ? e.message : "The Ethics audit failed. Please try again.");
        } finally {
            setIsAuditingEthics(false);
        }
    };
    
    const handleRunSuccessScore = async () => {
        if (!isFinished || isScoring) return;

        setIsScoring(true);
        setScoringError(null);

        try {
            const fullReport: ReportData = {
                strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, 
                ventureAnalysis: null,
                solutionScoring, selectedSolution,
                ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy,
                redTeam: redTeamReport,
                ethicsReport: ethicsReport,
                pitchDeck: pitchDeck,
                investmentMemo: investmentMemo,
                successScore: null
            };
            const distilledReport = getDistilledReportForPostAnalysis(fullReport);
            const { data: result, usage } = await runSuccessScoring(distilledReport, modelMode, strategicDirective);
            setSuccessScore(result);
            setActiveTab('success_score');
            
            const updatedTotalTokens = totalTokens + usage.total;
            setTotalTokens(updatedTotalTokens);
            const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
            setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });

        } catch (e) {
            console.error("Success scoring failed:", e);
            setScoringError(e instanceof Error ? e.message : "The Success Score analysis failed. Please try again.");
        } finally {
            setIsScoring(false);
        }
    };

    const handleRunScenarioModeling = async () => {
        if (!problemStatement || !selectedSolution || !financialPlan || isModelingScenarios) return;

        setIsModelingScenarios(true);
        setScenarioError(null);

        try {
            const history = {
                problemStatement: problemStatement.problemStatement,
                solution: selectedSolution.solutionDescription,
                targetMarket: TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket
            };

            const { data: scenarios, usage } = await runFinancialScenarioModeling(history, financialPlan, modelMode, strategicDirective);
            
            setFinancialPlan(prev => prev ? { ...prev, scenarios } : null);

            const updatedTotalTokens = totalTokens + usage.total;
            setTotalTokens(updatedTotalTokens);
            const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
            setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });

        } catch (e) {
            console.error("Scenario modeling failed:", e);
            setScenarioError(e instanceof Error ? e.message : "The scenario modeling failed. Please try again.");
        } finally {
            setIsModelingScenarios(false);
        }
    };

    const handleGenerateVideo = useCallback(async () => {
        if (!storyboard || isGeneratingVideo) return;
    
        videoAbortControllerRef.current = new AbortController();
        const signal = videoAbortControllerRef.current.signal;
    
        setIsGeneratingVideo(true);
        if (generatedVideoUrl && generatedVideoUrl.startsWith('blob:')) {
            URL.revokeObjectURL(generatedVideoUrl);
        }
        setGeneratedVideoUrl(null);
        setVideoGenerationProgress([]);
        setVideoGenerationError(null);
    
        const onProgress = (message: string) => {
            setVideoGenerationProgress(prev => [...prev, message]);
        };
    
        try {
            const { data, usage } = await runVideoGeneration(storyboard, modelMode, onProgress, signal);
            
            onProgress("Fetching video data...");
            const response = await fetch(`${data.videoUrl}&key=${process.env.API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
            }
    
            const videoBlob = await response.blob();
            const objectUrl = URL.createObjectURL(videoBlob);
            setGeneratedVideoUrl(objectUrl);
    
            const updatedTotalTokens = totalTokens + usage.total;
            setTotalTokens(updatedTotalTokens);
            if(usageMetrics) {
                const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
                setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });
            }
        } catch (e: any) {
            if (e instanceof DOMException && e.name === 'AbortError') {
                 setVideoGenerationError("Video generation was cancelled by the user.");
                 setVideoGenerationProgress(prev => [...prev, "Process cancelled."]);
            } else {
                const errorMessage = e instanceof Error ? e.message : JSON.stringify(e);
                
                // Specific handling for Veo 404 (often due to missing project access/billing)
                if (errorMessage.includes("404") || errorMessage.includes("NOT_FOUND") || errorMessage.includes("Requested entity was not found")) {
                     if ((window as any).aistudio) {
                         onProgress("Veo model requires a paid project key. Opening selection dialog...");
                         try {
                             await (window as any).aistudio.openSelectKey();
                             setVideoGenerationError("API Key updated. Please try generating the video again.");
                         } catch (keyError) {
                             console.error(keyError);
                             setVideoGenerationError("Failed to update API key. Please refresh and try again.");
                         }
                     } else {
                         setVideoGenerationError("Video generation failed (404). Ensure your API key has access to the Veo model.");
                     }
                } else {
                    console.error("Video generation failed in App:", e);
                    setVideoGenerationError(errorMessage);
                }
            }
        } finally {
            setIsGeneratingVideo(false);
            videoAbortControllerRef.current = null;
        }
    }, [storyboard, isGeneratingVideo, totalTokens, usageMetrics, generatedVideoUrl, modelMode]);
    
    const handleCancelVideoGeneration = useCallback(() => {
        videoAbortControllerRef.current?.abort();
    }, []);

    const handleSuggestCandidates = async (profile: IdealCoFounderProfile) => {
        if (!selectedSolution || isScouting) return;

        const roleTitle = profile.roleTitle;
        setIsScouting(roleTitle);
        setScoutError(prev => ({ ...prev, [roleTitle]: null }));

        try {
            const { data: suggestions, usage } = await runTalentScout(profile, selectedSolution, modelMode, strategicDirective);
            
            setTalentStrategy(prev => {
                if (!prev) return null;
                const updatedIdealCoFounders = prev.idealCoFounders.map(p => {
                    if (p.roleTitle === roleTitle) {
                        return { ...p, suggestedCandidates: suggestions };
                    }
                    return p;
                });
                return { ...prev, idealCoFounders: updatedIdealCoFounders };
            });

            setTotalTokens(prev => prev + usage.total);
            if (usageMetrics) {
                const updatedTotalTokens = usageMetrics.totalTokens + usage.total;
                const finalCo2g = (updatedTotalTokens / 1000) * CO2_GRAMS_PER_1K_TOKENS;
                setUsageMetrics({ totalTokens: updatedTotalTokens, co2g: finalCo2g });
            }

        } catch (e) {
            console.error("Talent scouting failed:", e);
            const errorMessage = e instanceof Error ? e.message : "Failed to suggest candidates.";
            setScoutError(prev => ({ ...prev, [roleTitle]: errorMessage }));
        } finally {
            setIsScouting(null);
        }
    };

    const TabButton: React.FC<{tab: ActiveTab; label: string; icon: React.ReactNode;}> = ({ tab, label, icon }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center sm:justify-start gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 w-full sm:w-auto ${
                    isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700'
                }`}
            >
                {icon}
                <span className="hidden sm:inline">{label}</span>
            </button>
        );
    }
    
    // ... (handleReferenceNavigate) ...
    const handleReferenceNavigate = (index: number) => {
        setActiveTab('references');
        setTimeout(() => {
            const element = document.getElementById(`reference-${index}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('highlight-reference');
                setTimeout(() => {
                    element.classList.remove('highlight-reference');
                }, 2000);
            }
        }, 100);
    };
    
    if (!currentUser) {
        return (
             <div className={isTransitioning ? 'animate-login-exit' : ''}>
                <LoginScreen onLogin={handleLogin} isTransitioning={isTransitioning} />
            </div>
        );
    }

    const hasFounderDescriptions = founders.some(f => f.description.trim() !== '');
    const isProblemFirst = workflowMode === 'problemFirst';

    const activeAgent = agents.find(a => a.status === 'working');
    const currentPhase = activeAgent ? getPhaseForAgent(activeAgent.role) : 'Initializing...';

    // Usage Metrics logic
    const runsLeft = Math.max(0, currentUser.maxRuns - currentUser.runCount);
    const isRunLimitReached = currentUser.runCount >= currentUser.maxRuns;
    let usageColor = 'text-green-400 bg-green-900/30 border-green-500/50';
    if (runsLeft <= 2 && runsLeft > 0) usageColor = 'text-yellow-400 bg-yellow-900/30 border-yellow-500/50';
    if (runsLeft === 0) usageColor = 'text-red-400 bg-red-900/30 border-red-500/50';


    return (
        <div className={`min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8 flex flex-col ${justLoggedIn ? 'animate-main-enter' : ''}`}>
            {/* ... Header and Pre-Simulation Content ... */}
            <div className="max-w-7xl mx-auto w-full flex flex-col">
                <header className="mb-6">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                        <div className="flex items-center gap-3 sm:gap-4">
                             <XinovatesAvatar className="w-12 h-12 sm:w-14 sm:h-14" />
                            <h1 className="text-4xl sm:text-5xl font-bold">
                                <span className="text-transparent bg-clip-text logo-text-x-grad">X</span>
                                <span className="text-white">inovates</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 text-sm">
                             <div className="text-right">
                                <span className="text-gray-300 font-semibold hidden sm:inline">Welcome, {currentUser.displayName}</span>
                                {currentUser.role === 'admin' && <span className="text-xs text-yellow-400 block">Admin</span>}
                             </div>
                             {currentUser.role === 'admin' && (
                                <button onClick={() => setShowAdminDashboard(true)} className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors">
                                    <ShieldCheckIcon className="w-5 h-5"/> Admin Dashboard
                                </button>
                             )}
                            <button onClick={() => setShowScienceModal(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                <AcademicCapIcon className="w-5 h-5"/> Our Science
                            </button>
                             <button onClick={() => setShowHistoryModal(true)} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                <ArchiveBoxIcon className="w-5 h-5"/> My Runs
                            </button>
                             <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                                <ArrowLeftOnRectangleIcon className="w-5 h-5"/> Logout
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-baseline flex-wrap gap-2">
                        <p className="mt-2 text-lg text-gray-400 text-center sm:text-left">Your AI Co-Founder for Venture Creation</p>
                        <div className="flex items-center gap-4">
                             {currentUser.role === 'user' && currentUser.status === 'active' && (
                                <div className={`text-sm font-semibold px-3 py-1 rounded-full border ${usageColor} transition-colors duration-300`}>
                                    Runs Left: {runsLeft} / {currentUser.maxRuns}
                                </div>
                             )}
                            <button onClick={() => setShowVersionHistoryModal(true)} className="text-sm text-gray-500 hover:text-gray-300 hover:underline transition-colors">v{APP_VERSION}</button>
                        </div>
                    </div>
                </header>
                
                 {currentUser.status === 'pending' && (
                    <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 text-sm text-center p-3 rounded-lg mb-6 animate-fade-in">
                        <strong>Account Pending Approval:</strong> Your account is currently pending administrator review. You cannot run new simulations until approved.
                    </div>
                 )}

                 {!isFinished && !isAwaitingIdeaComparison && !isAwaitingBrandNameSelection && !isAwaitingChallengeSelection && !isAwaitingProblemFraming && isAuthorized && (
                    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-2xl border themed-border mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-700/50 p-1 rounded-lg flex gap-1 text-sm font-semibold">
                                <button onClick={() => setWorkflowMode('problemFirst')} className={`px-4 py-2 rounded-md transition-colors ${isProblemFirst ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>Start with a Problem</button>
                                <button onClick={() => setWorkflowMode('solutionFirst')} className={`px-4 py-2 rounded-md transition-colors ${!isProblemFirst ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>Start with a Solution</button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-white">{isProblemFirst ? 'Innovation Challenge' : 'Describe Your Solution'}</h2>
                            <div className="flex items-center gap-2">
                                {isProblemFirst && (
                                    <button
                                        onClick={() => setShowTrendSpotterModal(true)}
                                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                        aria-label="Open Trend Spotter"
                                        title="Trend Spotter: Identify Urgent Challenges"
                                    >
                                        <SparklesIcon className="w-8 h-8" />
                                    </button>
                                )}
                                <button 
                                    onClick={() => setShowHelpModal(true)} 
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label="Show help"
                                >
                                    <QuestionMarkCircleIcon className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                        <textarea
                            value={challenge}
                            onChange={(e) => setChallenge(e.target.value)}
                            placeholder={isProblemFirst ? "e.g., Design a system to reduce plastic waste in oceans." : "e.g., An AI-powered drone swarm that can identify and collect plastic debris from ocean surfaces."}
                            rows={3}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                            disabled={isSimulating || isGeneratingDeliverables}
                        />

                        {/* ... (rest of input form including solution input, file upload, dropdowns, founder DNA input) ... */}
                        {isProblemFirst && (
                            <div className="mt-4">
                                <button onClick={() => setShowSolutionInput(!showSolutionInput)}
                                    className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors flex justify-between items-center"
                                    disabled={isSimulating || isGeneratingDeliverables}
                                >
                                    <span className="font-semibold text-gray-300">I have a solution in mind (Optional)</span>
                                    <ChevronRightIcon className={`w-5 h-5 transition-transform ${showSolutionInput ? 'rotate-90' : ''}`}/>
                                </button>
                                {showSolutionInput && (
                                    <div className="mt-4 p-4 bg-gray-900/30 rounded-lg animate-fade-in-down">
                                        <h4 className="font-semibold text-lg text-gray-200 mb-2">Describe Your Solution</h4>
                                        <p className="text-sm text-gray-400 mb-4">
                                            If you provide a solution, the AI will skip the brainstorming phase and directly build a venture plan around your idea.
                                        </p>
                                        <textarea
                                            value={userSolution}
                                            onChange={(e) => setUserSolution(e.target.value)}
                                            placeholder="e.g., A mobile app that uses image recognition to identify recyclable materials and connects users to local recycling centers."
                                            rows={4}
                                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                                            disabled={isSimulating || isGeneratingDeliverables}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Provide Context (Optional PDF)
                            </label>
                            <div className="mt-2 flex flex-col gap-2 items-start">
                                {!contextFileName && (
                                    <label htmlFor="context-file-upload" className="relative cursor-pointer bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                        <span className="flex items-center gap-2">
                                            <DocumentArrowUpIcon className="w-5 h-5"/>
                                            Upload Research or Brief
                                        </span>
                                        <input id="context-file-upload" ref={fileInputRef} name="context-file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} disabled={isParsingPdf}/>
                                    </label>
                                )}
                                {isParsingPdf && <div className="flex items-center gap-2 text-sm text-gray-400"><Spinner/> <span>Parsing PDF...</span></div>}
                                {parsingError && <p className="text-xs text-red-400">{parsingError}</p>}
                                {contextFileName && !isParsingPdf && (
                                    <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-lg">
                                        <DocumentTextIcon className="w-6 h-6 text-green-400"/>
                                        <span className="text-sm text-gray-300">{contextFileName}</span>
                                        <button onClick={handleRemoveContext} className="text-red-400 hover:text-red-300"><TrashIcon className="w-5 h-5"/></button>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            <div>
                                <label htmlFor="ideaArea" className="block text-sm font-medium text-gray-300 mb-2">Area of Innovation</label>
                                <select
                                    id="ideaArea"
                                    value={ideaArea}
                                    onChange={(e) => setIdeaArea(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200"
                                    disabled={isSimulating || isGeneratingDeliverables}
                                >
                                    {IDEA_AREAS.map(area => (
                                        <option key={area.value} value={area.value}>{area.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="targetMarket" className="block text-sm font-medium text-gray-300 mb-2">Target Market</label>
                                <select
                                    id="targetMarket"
                                    value={targetMarket}
                                    onChange={(e) => setTargetMarket(e.target.value)}
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200"
                                    disabled={isSimulating || isGeneratingDeliverables}
                                >
                                    {TARGET_MARKETS.map(market => (
                                        <option key={market.value} value={market.value}>{market.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="strategicDirective" className="block text-sm font-medium text-gray-300 mb-2">Strategic Directive</label>
                                <select id="strategicDirective" value={strategicDirective} onChange={(e) => setStrategicDirective(e.target.value as StrategicDirective)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200" disabled={isSimulating || isGeneratingDeliverables}>
                                    <option value="BALANCED">Balanced Approach</option>
                                    <option value="TIME_TO_MARKET">Time to Market</option>
                                    <option value="UNIQUE_VALUE_PROPOSITION">Unique Value Proposition</option>
                                    <option value="CAPITAL_EFFICIENCY">Capital Efficiency</option>
                                </select>
                            </div>
                            
                             <div>
                                <label htmlFor="modelMode" className="block text-sm font-medium text-gray-300 mb-2">Execution Mode</label>
                                <select id="modelMode" value={modelMode} onChange={(e) => setModelMode(e.target.value as ModelMode)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200" disabled={isSimulating || isGeneratingDeliverables}>
                                    <option value="quality">Quality (Best, Slower)</option>
                                    <option value="creative">Creative (Most Novel)</option>
                                    <option value="fast">Fast (Quickest, Lower Cost)</option>
                                </select>
                            </div>
                            
                            <div className="flex flex-col justify-end">
                                <label className="flex items-center cursor-pointer p-3 bg-gray-700/50 rounded-lg h-full">
                                    <input
                                        id="enable-refinement"
                                        type="checkbox"
                                        checked={isRefinementEnabled}
                                        onChange={(e) => setIsRefinementEnabled(e.target.checked)}
                                        className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-blue-500 themed-focus-ring focus:ring-offset-gray-800"
                                        disabled={isSimulating || isGeneratingDeliverables}
                                    />
                                    <span className="ml-3 text-sm font-medium text-gray-300">Enable Devil's Advocate Loop</span>
                                </label>
                            </div>
                            
                            <div className="flex flex-col justify-end">
                                <label className="flex items-center cursor-pointer p-3 bg-gray-700/50 rounded-lg h-full">
                                    <input
                                        id="use-founder-dna"
                                        type="checkbox"
                                        checked={useFounderDnaInIdeation}
                                        onChange={(e) => setUseFounderDnaInIdeation(e.target.checked)}
                                        disabled={!hasFounderDescriptions || isSimulating || isGeneratingDeliverables || !isProblemFirst}
                                        className="h-5 w-5 rounded border-gray-500 bg-gray-700 text-blue-500 themed-focus-ring focus:ring-offset-gray-800 disabled:cursor-not-allowed"
                                    />
                                    <span className={`ml-3 text-sm font-medium ${(hasFounderDescriptions && isProblemFirst) ? 'text-gray-300' : 'text-gray-500'}`}>Use Founder DNA in Ideation</span>
                                </label>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button onClick={() => setShowFounderDnaInput(!showFounderDnaInput)}
                                className="w-full text-left p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors flex justify-between items-center"
                                disabled={isSimulating || isGeneratingDeliverables}
                            >
                                <span className="font-semibold text-gray-300">Provide Founder DNA (Optional)</span>
                                <ChevronRightIcon className={`w-5 h-5 transition-transform ${showFounderDnaInput ? 'rotate-90' : ''}`}/>
                            </button>
                            {showFounderDnaInput && (
                                <div className="mt-4 p-4 bg-gray-900/30 rounded-lg animate-fade-in-down">
                                    <h4 className="font-semibold text-lg text-gray-200 mb-4">Founder DNA Input</h4>
                                    <div className="space-y-6">
                                        {founders.map((founder, index) => (
                                            <div key={founder.id} className="p-4 bg-gray-700/50 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={founder.name}
                                                            onChange={(e) => handleFounderUpdate(founder.id, 'name', e.target.value)}
                                                            placeholder={`Founder ${index + 1} Name`}
                                                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md pr-10"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleFounderSearch(founder.id)}
                                                            disabled={!founder.name.trim() || !!searchingFounderId}
                                                            className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                                                            aria-label={`Search for ${founder.name}`}
                                                            title={`Search for ${founder.name}`}
                                                        >
                                                            {searchingFounderId === founder.id ? <Spinner /> : <MagnifyingGlassIcon className="w-5 h-5"/>}
                                                        </button>
                                                    </div>
                                                     <div className="flex items-center gap-2">
                                                        <label htmlFor={`photo-upload-${founder.id}`} className="cursor-pointer bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors">
                                                            {founder.photoB64 ? 'Change Photo' : 'Upload Photo'}
                                                        </label>
                                                        <input id={`photo-upload-${founder.id}`} type="file" className="sr-only" onChange={(e) => handlePhotoUpload(e, founder.id)} accept="image/*"/>
                                                        {founder.photoB64 && <img src={founder.photoB64} alt={founder.name || `Founder ${index+1}`} className="w-10 h-10 rounded-full object-cover"/>}
                                                    </div>
                                                </div>
                                                <textarea
                                                    value={founder.description}
                                                    onChange={(e) => handleFounderUpdate(founder.id, 'description', e.target.value)}
                                                    placeholder={founder.name ? `Describe ${founder.name}'s professional background, work style, and motivations... or upload a CV.` : `Describe Founder ${index + 1}'s professional background... or upload a CV.`}
                                                    rows={3}
                                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md mt-3 text-sm"
                                                />
                                                {founderSearchError[founder.id] && <p className="text-xs text-red-400 mt-1">{founderSearchError[founder.id]}</p>}
                                                
                                                <div className="mt-3">
                                                    <label htmlFor={`cv-upload-${founder.id}`} className="relative cursor-pointer bg-gray-600 hover:bg-gray-500 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors inline-flex items-center gap-2">
                                                        <DocumentArrowUpIcon className="w-4 h-4"/>
                                                        <span>Generate from CV</span>
                                                    </label>
                                                    <input id={`cv-upload-${founder.id}`} type="file" className="sr-only" onChange={(e) => handleCvUpload(e, founder.id)} accept=".pdf,.txt" disabled={!founder.name.trim() || !!analyzingCvId} />
                                                    {analyzingCvId === founder.id && <div className="inline-flex items-center gap-2 text-sm text-gray-400 ml-3"><Spinner/> <span>Analyzing CV...</span></div>}
                                                    {cvAnalysisError[founder.id] && <p className="text-xs text-red-400 mt-1">{cvAnalysisError[founder.id]}</p>}
                                                </div>

                                                
                                                <div className="mt-4 pt-4 border-t border-gray-600/50">
                                                     <label className="block text-sm font-medium text-gray-300 mb-2">
                                                        Founder Personality/Strengths Analysis
                                                    </label>
                                                    <p className="text-xs text-gray-400 mb-2">Analyze founder strengths by manually rating predefined traits. This helps the AI understand the team's dynamics.</p>
                                                    <button type="button" onClick={() => setManualInputFounderId(manualInputFounderId === founder.id ? null : founder.id)} className="text-sm text-blue-400 hover:text-blue-300 font-semibold">
                                                        {manualInputFounderId === founder.id ? 'Hide Manual Trait Input' : 'Enter Traits Manually'}
                                                    </button>

                                                    {founderAnalysisError[founder.id] && <p className="text-xs text-red-400 mt-2">{founderAnalysisError[founder.id]}</p>}
                                                    
                                                    {manualInputFounderId === founder.id && (
                                                        <div className="mt-4 p-4 bg-gray-900/50 rounded-lg animate-fade-in">
                                                            <h5 className="font-semibold text-gray-200 mb-3">Self-Assessed Traits</h5>
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                                                {PREDEFINED_TRAITS.map(trait => (
                                                                    <div key={trait}>
                                                                        <label htmlFor={`${founder.id}-${trait}`} className="text-sm text-gray-300 flex justify-between">
                                                                            <span>{trait}</span>
                                                                            <span className="font-bold">{(founder.manualTraits?.[trait] || 50)}</span>
                                                                        </label>
                                                                        <input
                                                                            id={`${founder.id}-${trait}`}
                                                                            type="range"
                                                                            min="0"
                                                                            max="100"
                                                                            value={founder.manualTraits?.[trait] || 50}
                                                                            onChange={(e) => handleFounderTraitUpdate(founder.id, trait, parseInt(e.target.value, 10))}
                                                                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            {analysisSuccess[founder.id] ? (
                                                                <span className="text-green-400 flex items-center gap-2 text-sm font-semibold mt-4 animate-fade-in">
                                                                    <CheckCircleIcon className="w-5 h-5" />
                                                                    Soft Skills Analyzed
                                                                </span>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAnalyzeManualTraits(founder.id)}
                                                                    disabled={!!analyzingFounderId || !founder.name}
                                                                    className="mt-4 flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    title={!founder.name ? 'Please enter a founder name first' : ''}
                                                                >
                                                                    {analyzingFounderId === founder.id && manualInputFounderId ? <Spinner /> : <SparklesIcon className="w-4 h-4"/>}
                                                                    Analyze Manual Input
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex justify-end mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveFounder(founder.id)}
                                                        disabled={founders.length <= 1}
                                                        className="text-red-500 hover:text-red-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                                                        aria-label="Remove founder"
                                                    >
                                                        <TrashIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddFounder}
                                        className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Add Founder
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        <PreSimulationMetrics modelMode={modelMode} isRefinementEnabled={isRefinementEnabled} founderCount={founders.filter(f => f.description.trim() !== '').length} />

                    </div>
                )}
                
                <div ref={diagramContainerRef} className="relative">
                    <ConceptVideo 
                        agents={agents} 
                        onAgentClick={setSelectedAgent}
                        selectedDeliverables={selectedDeliverables}
                        onDeliverableToggle={handleDeliverableToggle}
                        isRefinementEnabled={isRefinementEnabled}
                    />
                    {(isSimulating || isGeneratingDeliverables) && activeAgent && (
                        <ProgressDisplay 
                            activeAgent={activeAgent} 
                            phase={currentPhase}
                            completedAgents={completedAgents}
                            totalAgentsToRun={totalAgentsToRun}
                            modelMode={modelMode}
                        />
                    )}
                </div>

                 {!isFinished && !isAwaitingIdeaComparison && !isAwaitingBrandNameSelection && !isAwaitingChallengeSelection && !isAwaitingProblemFraming && isAuthorized && (
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleCoreSimulation}
                            disabled={isSimulating || !challenge || isGeneratingDeliverables || isCoreSimFinished || isRunLimitReached}
                            className="px-8 py-4 primary-button text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-lg mx-auto"
                        >
                            {(isSimulating || isGeneratingDeliverables) ? (
                                <>
                                    <Spinner />
                                    <span className="ml-3">Simulating...</span>
                                </>
                            ) : isRunLimitReached ? (
                                'Run Limit Reached'
                            ) : (
                                'Innovate'
                            )}
                        </button>
                        {isRunLimitReached && <p className="mt-2 text-sm text-red-400 font-semibold">You have used {currentUser.maxRuns}/{currentUser.maxRuns} runs. Please contact admin to upgrade.</p>}
                        {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
                    </div>
                )}
                
                {isAwaitingChallengeSelection && suggestedChallenges && (
                    <ChallengeSelectionPoint 
                        suggestedChallenges={suggestedChallenges} 
                        onSelectChallenge={handleChallengeSelection} 
                    />
                )}
                
                {isAwaitingProblemFraming && suggestedProblemFrames && (
                    <ProblemFramingPoint
                        frames={suggestedProblemFrames}
                        onSelectFrame={handleProblemFrameSelection}
                    />
                )}
                
                {isAwaitingBrandNameSelection && (
                    <BrandNameSelectionPoint 
                        suggestedNames={suggestedBrandNames} 
                        onSelect={handleBrandNameSelection} 
                    />
                )}

                {isAwaitingIdeaComparison && allSolutions && allCritiques && solutionScoring && (
                    <IdeaComparisonPoint
                        allSolutions={allSolutions}
                        allCritiques={allCritiques}
                        solutionScores={solutionScoring}
                        onSelectIdea={handleIdeaSelection}
                        onRegenerateIdeas={handleRegenerateIdeas}
                    />
                )}
                
                {isCoreSimFinished && !isFinished && isRefinementEnabled && !isAwaitingBrandNameSelection && (
                    <DecisionPoint 
                        problemStatement={problemStatement}
                        customerPersona={customerPersona}
                        selectedSolution={selectedSolution}
                        allCritiques={allCritiques}
                        onApprove={handleDeliverableGeneration}
                        onEnhance={handleEnhanceSolution}
                        onCancelEnhancement={handleCancelEnhancement}
                        onRestart={resetSimulation}
                        isGenerating={isGeneratingDeliverables}
                        isEnhancing={isEnhancing}
                        enhancementProgress={enhancementProgress}
                        error={enhancementError}
                    />
                )}

                {isFinished && (
                    <div className="mt-8 animate-fade-in">
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Venture Plan: {financialPlan?.selectedBrandName}</h2>
                                <p className="text-gray-400">Your comprehensive venture creation report is ready.</p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button onClick={handleSaveRun} disabled={isSaved} className={`flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50`}>
                                    {isSaved ? <CheckIcon className="w-5 h-5"/> : <BookmarkSquareIcon className="w-5 h-5"/>}
                                    {isSaved ? 'Saved' : 'Save Run'}
                                </button>
                                <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">
                                    {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5"/>}
                                    Copy JSON
                                </button>
                                <button onClick={handleGenerateShareableHtml} disabled={isGeneratingHtml} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                                    {isGeneratingHtml ? <Spinner /> : <DocumentTextIcon className="w-5 h-5"/>}
                                    Download HTML
                                </button>
                                <button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                                    {isGeneratingPdf ? <Spinner /> : <DownloadIcon className="w-5 h-5"/>}
                                    Download PDF
                                </button>
                                <button onClick={handleGeneratePitchDeckPdf} disabled={isGeneratingDeck} className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50">
                                    {isGeneratingDeck ? <Spinner /> : <PresentationChartBarIcon className="w-5 h-5"/>}
                                    Download Pitch Deck
                                </button>
                            </div>
                        </div>
                        
                        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-2xl border themed-border overflow-hidden">
                            <div className="flex border-b border-gray-700 overflow-x-auto no-scrollbar">
                                <TabButton tab="overview" label="Overview" icon={<ChartPieIcon className="w-4 h-4"/>} />
                                {(founderDna || talentStrategy || founders.some(f => f.analysisProfile)) && <TabButton tab="founder_dna" label="Founder & Team" icon={<UsersIcon className="w-4 h-4"/>} />}
                                <TabButton tab="problem" label="Problem Space" icon={<MagnifyingGlassIcon className="w-4 h-4"/>} />
                                <TabButton tab="solution" label="Solution" icon={<LightBulbIcon className="w-4 h-4"/>} />
                                {technologyScoutReport && <TabButton tab="tech_research" label="Tech Intelligence" icon={<AcademicCapIcon className="w-4 h-4"/>} />}
                                {ipStrategy && <TabButton tab="ip_strategy" label="IP Strategy" icon={<ScaleIcon className="w-4 h-4"/>} />}
                                <TabButton tab="financials" label="Financials" icon={<ChartBarIcon className="w-4 h-4"/>} />
                                {investmentMemo && <TabButton tab="investment_memo" label="Memo" icon={<DocumentTextIcon className="w-4 h-4"/>} />}
                                <TabButton tab="advantages" label="Advantages" icon={<BoltIcon className="w-4 h-4"/>} />
                                <TabButton tab="gtm" label="Go-to-Market" icon={<RocketLaunchIcon className="w-4 h-4"/>} />
                                <TabButton tab="risk" label="Risks" icon={<ShieldCheckIcon className="w-4 h-4"/>} />
                                <TabButton tab="ops" label="Ops & Tech" icon={<PuzzlePieceIcon className="w-4 h-4"/>} />
                                <TabButton tab="references" label="References" icon={<BookOpenIcon className="w-4 h-4"/>} />
                                <TabButton tab="redteam" label="Red Team" icon={<CrosshairsIcon className="w-4 h-4"/>} />
                                <TabButton tab="ethics" label="Ethics Audit" icon={<HeartIcon className="w-4 h-4"/>} />
                                <TabButton tab="success_score" label="Success Score" icon={<StarIcon className="w-4 h-4"/>} />
                                <TabButton tab="pitch_deck" label="Pitch Deck" icon={<PresentationChartBarIcon className="w-4 h-4"/>} />
                                <TabButton tab="usage_metrics" label="Usage" icon={<ChipIcon className="w-4 h-4"/>} />
                            </div>

                            <div className="p-6">
                                {activeTab === 'overview' && (
                                    <InfographicOverviewCanvas 
                                        financialPlan={financialPlan} 
                                        leanCanvas={leanCanvas} 
                                        problemStatement={problemStatement} 
                                        selectedSolution={selectedSolution} 
                                        customerPersona={customerPersona} 
                                        strategy={strategy} 
                                        research={research}
                                        technicalBlueprint={technicalBlueprint}
                                        successScore={successScore}
                                        storyboard={storyboard}
                                    />
                                )}
                                {/* ... other tabs ... */}
                                {activeTab === 'founder_dna' && (
                                    <div className="space-y-8">
                                        {founderDna && <FounderDnaCanvas analysis={founderDna} founders={founders} />}
                                        {founders.map(f => f.analysisProfile && (
                                            <FounderAnalysisProfileCanvas key={f.id} profile={f.analysisProfile} />
                                        ))}
                                        {talentStrategy && (
                                            <IdealCoFounderCanvas 
                                                data={talentStrategy} 
                                                onSuggestCandidates={handleSuggestCandidates} 
                                                isScouting={isScouting}
                                                scoutError={scoutError}
                                            />
                                        )}
                                        {talentStrategy && talentStrategy.teamCapabilityAnalysis && <TeamCompositionCanvas data={talentStrategy} />}
                                    </div>
                                )}
                                {activeTab === 'problem' && (
                                    <div className="space-y-6">
                                        {problemStatement && <ProblemStatementCanvas data={problemStatement} />}
                                        {customerPersona && <CustomerPersonaCanvas data={customerPersona} onInterview={() => setPersonaToChat(customerPersona)} />}
                                        {empathyMap && <EmpathyMapCanvas data={empathyMap} />}
                                        {(research?.marketAnalysis || financialPlan?.marketSize) && <MarketAnalysisCanvas researchData={research} financialData={financialPlan} />}
                                    </div>
                                )}
                                {activeTab === 'solution' && (
                                    <div className="space-y-6">
                                        {solutionScoring && allSolutions && <SolutionScoringCanvas data={solutionScoring} allSolutions={allSolutions} />}
                                        {selectedSolution && <SolutionSelectionCanvas data={selectedSolution} allSolutions={allSolutions} allCritiques={allCritiques} />}
                                        {valueProposition && <ValuePropositionCanvas data={valueProposition} />}
                                        {leanCanvas && <LeanCanvas data={leanCanvas} />}
                                        {storyboard && (
                                            <StoryboardReportCanvas 
                                                data={storyboard} 
                                                onGenerateVideo={handleGenerateVideo} 
                                                onCancelVideoGeneration={handleCancelVideoGeneration}
                                                isGeneratingVideo={isGeneratingVideo}
                                                videoGenerationProgress={videoGenerationProgress}
                                                generatedVideoUrl={generatedVideoUrl}
                                                videoGenerationError={videoGenerationError}
                                            />
                                        )}
                                    </div>
                                )}
                                {activeTab === 'tech_research' && technologyScoutReport && <TechnologyScoutCanvas data={technologyScoutReport} />}
                                {activeTab === 'ip_strategy' && ipStrategy && <IpStrategyCanvas data={ipStrategy} />}
                                {activeTab === 'financials' && financialPlan && (
                                    <FinancialModelerCanvas 
                                        data={financialPlan} 
                                        isModelingScenarios={isModelingScenarios}
                                        scenarioError={scenarioError}
                                        handleRunScenarioModeling={handleRunScenarioModeling}
                                        onOpenCashFlowModel={() => setShowCashFlowModal(true)}
                                    />
                                )}
                                {activeTab === 'investment_memo' && investmentMemo && <InvestmentMemoCanvas data={investmentMemo} />}
                                {activeTab === 'advantages' && (
                                    <div className="space-y-6">
                                        {strategy && <StrategyCanvas data={strategy} />}
                                        {research?.competitiveLandscape && research.competitiveLandscape.length > 0 && <CompetitiveLandscapeCanvas data={research} />}
                                    </div>
                                )}
                                {activeTab === 'gtm' && goToMarket && <GoToMarketCanvas data={goToMarket} />}
                                {activeTab === 'risk' && (
                                    <div className="space-y-6">
                                        {riskAnalysis && <RiskAnalysisCanvas data={riskAnalysis} />}
                                    </div>
                                )}
                                {activeTab === 'ops' && technicalBlueprint && <TechnicalBlueprintCanvas data={technicalBlueprint} />}
                                {activeTab === 'references' && research?.sources && <ReferencesCanvas sources={research.sources} />}
                                {activeTab === 'redteam' && (
                                    <div className="space-y-6">
                                        {redTeamReport ? (
                                            <RedTeamCanvas data={redTeamReport} />
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="bg-red-900/20 p-6 rounded-full inline-block mb-4">
                                                    <CrosshairsIcon className="w-12 h-12 text-red-500" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Stress-Test Your Strategy</h3>
                                                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                                    Deploy a "Red Team" AI agent to simulate a ruthless competitor. It will attack your business plan to expose weaknesses you might have missed.
                                                </p>
                                                <button 
                                                    onClick={handleRunRedTeam} 
                                                    disabled={isRedTeaming}
                                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                                                >
                                                    {isRedTeaming ? <Spinner /> : <BoltIcon className="w-5 h-5"/>}
                                                    Launch Red Team Attack
                                                </button>
                                                {redTeamError && <p className="mt-4 text-red-400">{redTeamError}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'ethics' && (
                                    <div className="space-y-6">
                                        {ethicsReport ? (
                                            <EthicsCanvas data={ethicsReport} />
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="bg-blue-900/20 p-6 rounded-full inline-block mb-4">
                                                    <ScaleIcon className="w-12 h-12 text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Ethics & Compliance Audit</h3>
                                                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                                    Run an AI audit to evaluate your venture against key ethical frameworks (privacy, bias, sustainability) and identify potential risks early.
                                                </p>
                                                <button 
                                                    onClick={handleRunEthicsAudit} 
                                                    disabled={isAuditingEthics}
                                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                                                >
                                                    {isAuditingEthics ? <Spinner /> : <HeartIcon className="w-5 h-5"/>}
                                                    Run Ethics Audit
                                                </button>
                                                {ethicsError && <p className="mt-4 text-red-400">{ethicsError}</p>}
                                            </div>
                                        )}
                                        {research?.ethicalConsiderations && <EthicalConsiderationsCanvas data={research} />}
                                    </div>
                                )}
                                {activeTab === 'success_score' && (
                                    <div className="space-y-6">
                                        {successScore ? (
                                            <SuccessScoreCanvas data={successScore} />
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="bg-yellow-900/20 p-6 rounded-full inline-block mb-4">
                                                    <StarIcon className="w-12 h-12 text-yellow-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">Get Your Innovation Success Score</h3>
                                                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                                                    Have the AI evaluate your entire venture plan against VC criteria (Desirability, Feasibility, Viability) to generate a predictive success score.
                                                </p>
                                                <button 
                                                    onClick={handleRunSuccessScore} 
                                                    disabled={isScoring}
                                                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                                                >
                                                    {isScoring ? <Spinner /> : <SparklesIcon className="w-5 h-5"/>}
                                                    Calculate Score
                                                </button>
                                                {scoringError && <p className="mt-4 text-red-400">{scoringError}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'pitch_deck' && pitchDeck && (
                                    <PitchDeckView pitchDeck={pitchDeck} brandName={financialPlan?.selectedBrandName} />
                                )}
                                {activeTab === 'usage_metrics' && usageMetrics && <UsageMetricsCanvas agents={agents} metrics={usageMetrics} />}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Hidden Elements for PDF/HTML Generation - Positioned off-screen by the components themselves to ensure rendering */}
                <div style={{ position: 'absolute', top: '-20000px', left: '-20000px', width: '1px', height: '1px', overflow: 'hidden' }}>
                    <div ref={reportRef}>
                        {isFinished && <PrintableReport challenge={challenge} report={{ strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, solutionScoring, selectedSolution, ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy, redTeam: redTeamReport, ethicsReport, pitchDeck, investmentMemo, usageMetrics, successScore, ventureAnalysis: null }} agents={agents} />}
                    </div>
                    <div ref={shareableReportRef}>
                        {isFinished && <ShareableReport challenge={challenge} report={{ strategicDirective, ideaArea, targetMarket, userContext, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement, technologyScoutReport, allSolutions, allCritiques, solutionScoring, selectedSolution, ipStrategy, talentStrategy, valueProposition, leanCanvas, storyboard, financialPlan, riskAnalysis, technicalBlueprint, goToMarket, strategy, redTeam: redTeamReport, ethicsReport, pitchDeck, investmentMemo, usageMetrics, successScore, ventureAnalysis: null }} agents={agents} />}
                    </div>
                    <div ref={pitchDeckRef}>
                         {isFinished && pitchDeck && <PrintablePitchDeck pitchDeck={pitchDeck} brandName={financialPlan?.selectedBrandName} />}
                    </div>
                </div>

                {selectedAgent && (
                    <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
                )}
                {showScienceModal && <ScienceModal onClose={() => setShowScienceModal(false)} />}
                {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
                {showHistoryModal && <HistoryModal runs={savedRuns} onLoad={handleLoadRun} onDelete={handleDeleteRun} onClose={() => setShowHistoryModal(false)} />}
                {showVersionHistoryModal && <VersionHistoryModal onClose={() => setShowVersionHistoryModal(false)} />}
                {showAdminDashboard && <AdminDashboard onClose={() => setShowAdminDashboard(false)} currentUser={currentUser} />}
                {personaToChat && <PersonaChatModal persona={personaToChat} onClose={() => setPersonaToChat(null)} />}
                {showTrendSpotterModal && (
                    <TrendSpotterModal 
                        isOpen={showTrendSpotterModal} 
                        onClose={() => setShowTrendSpotterModal(false)}
                        initialMarket={targetMarket}
                        onSelectChallenge={handleSelectTrend}
                        onGenerate={handleGenerateTrends}
                    />
                )}
                {showCashFlowModal && financialPlan && (
                    <CashFlowModelModal
                        isOpen={showCashFlowModal}
                        onClose={() => setShowCashFlowModal(false)}
                        baseFinancialPlan={financialPlan}
                        modelMode={modelMode}
                        strategicDirective={strategicDirective}
                        onSave={(newModel) => setFinancialPlan(prev => prev ? { ...prev, cashFlowModel: newModel } : null)}
                    />
                )}
            </div>
        </div>
    );
};

export default App;
