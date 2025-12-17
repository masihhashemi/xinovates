
import React from 'react';

// New AgentRoles based on Double Diamond process
export enum AgentRole {
    // PRE-SIMULATION
    FOUNDER_DNA = 'Founder DNA',
    MARKET_FIT_ANALYST = 'Market-Fit Analyst',
    // DISCOVER
    PROBLEM_RESEARCH = 'Problem Research',
    CUSTOMER_PERSONA = 'Customer Persona',
    EMPATHY_MAP = 'Empathy Map',
    // DEFINE
    PROBLEM_SYNTHESIZER = 'Problem Synthesizer',
    // DEVELOP
    TECHNOLOGY_SCOUT = 'Technology Scout',
    SOLUTION_IDEATION = 'Solution Ideation',
    SOLUTION_CRITIQUE = "Solution Critique",
    VENTURE_ANALYST = 'Venture Analyst',
    SOLUTION_EVOLUTION = 'Solution Evolution',
    SOLUTION_SELECTION = 'Solution Selection',
    DEVILS_ADVOCATE = "Devil's Advocate",
    // DELIVER
    IP_STRATEGIST = 'IP Strategist',
    TALENT_STRATEGIST = 'Talent Strategist',
    VALUE_PROPOSITION = 'Value Proposition',
    LEAN_CANVAS = 'Lean Canvas',
    STORYBOARDING = 'Storyboarding',
    FINANCIAL_MODELER = 'Financial Modeler',
    INVESTMENT_MEMO = 'Investment Memo',
    RISK_ANALYSIS = 'Risk Analysis',
    TECHNICAL_BLUEPRINT = 'Technical Blueprint',
    GO_TO_MARKET = 'Go-to-Market',
    STRATEGY = 'Strategy', // Kept for unfair advantage analysis in Deliver phase
    PITCH_DECK = 'Pitch Deck',
    // POST-ANALYSIS
    ETHICS_ORACLE = 'Ethics Oracle',
    SUCCESS_SCORE_ANALYSIS = 'Success Score Analysis'
}

export type AgentStatus = 'idle' | 'working' | 'done' | 'error';
export type ModelMode = 'fast' | 'quality' | 'creative';
export type StrategicDirective = 'BALANCED' | 'TIME_TO_MARKET' | 'UNIQUE_VALUE_PROPOSITION' | 'CAPITAL_EFFICIENCY';

export interface Agent {
    role: AgentRole;
    name: string;
    description: string;
    status: AgentStatus;
    avatar: React.FC<{ className?: string }>;
    output?: any;
    tokenUsage?: {
        input: number;
        output: number;
        total: number;
        };
}

export interface GroundingSource {
    uri: string;
    title: string;
}

// --- Agent & Canvas Data Structures ---

// PRE-SIMULATION: FOUNDER ANALYSIS
export interface FounderAnalysisProfile {
  founder_name: string;
  capability_scores: {
    vision_opportunity: number;
    execution_delivery: number;
    people_culture: number;
    depth_rigor: number;
  };
  role_fit: {
    CEO: number;
    CTO: number;
    COO: number;
    CPO: number;
    Head_of_People: number;
  };
  headline: string;
  summary: string;
  top_strengths: string[];
  watchouts: string[];
  advice: string;
}

export interface FounderInput {
    id: string;
    name: string;
    description: string;
    photoB64: string | null;
    reportText?: string | null;
    reportFileName?: string | null;
    analysisProfile?: FounderAnalysisProfile | null;
    manualTraits?: Record<string, number>;
}

export interface FounderProfile {
    name: string; // Used as key to match with input
    founderType: string;
    strengthsAndStyle: string;
}

export interface FounderDnaOutput {
    teamArchetype: string;
    teamStrengths: string[];
    potentialGaps: string[];
    collaborationStyle: string;
    founderProfiles: FounderProfile[];
}


// DISCOVER PHASE OUTPUTS
export interface TargetAudienceDetail {
    description: string;
    demographics: string[];
    needs: string[];
}

export interface MarketAnalysisDetail {
    summary: string;
    marketSize: string;
    growthRate: string;
    keySegments: string[];
}

export interface CompetitorDetail {
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    founders?: string;
    foundedYear?: number;
    funding?: string;
    keyProduct?: string;
}

export interface TechnologicalAnalysisDetail {
    assessment: string;
    requiredTechnologies: string[];
    potentialChallenges: string[];
}

export interface TrendAndOpportunity {
    trend: string;
    implication: string;
    opportunity: string;
}

export interface EthicalConsiderationDetail {
    aspect: string;
    details: string;
    mitigation: string;
}

export interface ResearchOutput {
    problemSummary: string;
    targetAudience: TargetAudienceDetail;
    marketAnalysis: MarketAnalysisDetail;
    competitiveLandscape: CompetitorDetail[];
    technologicalAnalysis: TechnologicalAnalysisDetail;
    trendsAndOpportunities: TrendAndOpportunity[];
    ethicalConsiderations: EthicalConsiderationDetail[];
    sources?: GroundingSource[];
}

export interface ProblemFrame {
    id: string;
    coreProblem: string;
    rootCause: string;
    targetSegment: string;
    rationale: string;
    evidence: string; // Data anchor/citation
    validationScores: {
        reach: number; // 1-10: How many affected?
        impact: number; // 1-10: Pain level?
        confidence: number; // 1-10: Evidence backing?
        feasibility: number; // 1-10: Ease of implementation? (High is easier)
    };
    strategicLabel: string; // e.g. "High Risk / High Reward", "Quick Win", "Mass Market"
}

export interface CustomerPersonaOutput {
    name: string;
    age: number;
    occupation: string;
    bio: string;
    goals: string[];
    frustrations: string[];
    avatarPrompt: string;
    avatarB64: string;
}

export interface EmpathyMapCanvasOutput {
    says: string[];
    thinks: string[];
    does: string[];
    feels: string[];
    pains: string[];
    gains: string[];
}

// DEFINE PHASE OUTPUT
export interface ProblemStatementOutput {
    problemStatement: string; // "How Might We..."
    context: string;
    userImpact: string;
    keyInsights: string[];
}


// DEVELOP PHASE OUTPUTS
export interface TechnologyDetail {
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    trl: number; // Technology Readiness Level from 1-9
    implementationComplexity: 'Low' | 'Medium' | 'High';
}

export interface ExistingSolutionPattern {
    name: string;
    description: string;
    companiesUsingIt: string[];
}

export interface PatentDetail {
    patentId: string; // e.g., "US20220123456A1"
    title: string;
    summary: string;
    link: string; // Link to Google Patents or USPTO
}

export interface ExpertDetail {
    name: string;
    affiliation: string; // e.g., "Stanford University AI Lab"
    specialization: string;
    link: string; // Link to their profile or lab website
}

export interface TechnologyResearchOutput {
    summary: string;
    keyTechnologies: TechnologyDetail[];
    emergingTrends: string[];
    existingSolutionPatterns: ExistingSolutionPattern[];
    priorArt: PatentDetail[];
    leadingExperts: ExpertDetail[];
    sources?: GroundingSource[];
}

export interface IdeationOutput {
    solutions: { 
        id: number; 
        title: string; 
        summary: string;
        description: string 
    }[];
}

export interface Critique {
    weaknesses: string[];
    questions: string[];
}

export type AllCritiquesOutput = {
    solutionId: number;
    devilsAdvocate: Critique;
    steveJobs: Critique;
}[];

export interface SolutionScores {
    solutionId: number;
    scores: {
        Innovation: number;
        Feasibility: number;
        MarketFit: number;
        Scalability: number;
        CapitalEfficiency: number;
        FounderDnaAlignment?: number;
    };
}

export interface KeyAdvantageMetric {
    metricName: string;
    unit: string;
    baselineValue: number;
    isHigherBetter: boolean;
    solutionValues: {
        solutionId: number;
        value: number;
    }[];
}

export interface SolutionScoringOutput {
    scores: SolutionScores[];
    recommendationText: string;
    recommendedSolutionId: number;
    keyAdvantageMetrics: KeyAdvantageMetric[];
}

export interface VentureAnalystOutput {
    rankedSolutions: {
        id: number;
        title: string;
        rank: number;
        justification: string;
    }[];
    debateSummary: string;
    recommendedSolutionId: number;
}


export interface SolutionSelectionOutput {
    selectedSolutionId: number;
    solutionTitle: string;
    solutionDescription: string;
    justification: string;
    pros: string[];
    cons: string[];
    history?: { title: string; description: string; justification: string }[];
}

export interface SolutionEnhancementOutput {
    refinedSolutionTitle: string;
    refinedSolutionDescription: string;
    justificationForChange: string;
}


// DELIVER PHASE OUTPUTS
export interface IpStrategyOutput {
    patentabilityScore: number;
    patentabilityReasoning: string;
    priorArtSummary: {
        title: string;
        link: string;
        summary: string;
    }[];
    freedomToOperateSignal: 'Green' | 'Yellow' | 'Red';
    freedomToOperateReasoning: string;
    ipStrategyRecommendation: string;
    sources?: GroundingSource[];
}

export interface SuggestedFounderProfile {
    name: string;
    currentRole: string;
    company: string;
    profileUrl: string; // Link to LinkedIn or public profile
    justification: string;
}

export interface IdealCoFounderProfile {
    roleTitle: string;
    archetype: string;
    keyResponsibilities: string[];
    requiredSkillsAndExperience: string[];
    complementaryTraits: string[];
    suggestedCandidates?: SuggestedFounderProfile[];
}

export interface TeamCapabilityScore {
    dimension: 'Technical Expertise' | 'Product Vision' | 'Sales & Marketing' | 'Operational Excellence' | 'Fundraising Ability' | 'Industry Network';
    score: number; // Score from 1-10
    justification: string;
}

export interface TalentStrategyOutput {
    summary: string;
    idealCoFounders: IdealCoFounderProfile[];
    teamCapabilityAnalysis: {
        currentTeam: TeamCapabilityScore[];
        idealTeam: TeamCapabilityScore[];
    };
}

export interface ValuePropositionCanvasOutput {
    customer: {
        gains: string[];
        pains: string[];
        customerJobs: string[];
    };
    valueMap: {
        gainCreators: string[];
        painRelievers: string[];
        productsAndServices: string[];
    };
}

export interface LeanCanvasOutput {
    problem: string[];
    solution: string[];
    keyMetrics: string[];
    uniqueValueProposition: string[];
    unfairAdvantage: string[];
    channels: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
}

export interface StoryboardPanel {
    panel: number;
    scene: string;
    narration: string;
    imagePrompt: string;
    imageB64?: string;
}

export interface StoryboardOutput {
    title: string;
    panels: StoryboardPanel[];
}

export interface YearlyBreakdownItem {
    component: string;
    value: string;
    calculation: string;
}

export interface FinancialProjectionYear {
    year: number;
    revenueBreakdown: YearlyBreakdownItem[];
    costBreakdown: YearlyBreakdownItem[];
    totalRevenue: string;
    totalCosts: string;
    profit: string;
    justification: string;
}


export interface CostBreakdownItem {
    category: string;
    description: string;
    estimatedAnnualCost: string;
}

export interface FinancialScenario {
    scenarioType: 'Best Case' | 'Worst Case';
    summaryOfAssumptions: string;
    cashFlowModel: CashFlowModelOutput;
}

export interface FinancialPlanningOutput {
    selectedBrandName: string;
    suggestedBrandNames: string[];
    elevatorPitch: string;
    elevatorPitchImagePrompt: string;
    elevatorPitchImageB64: string;
    costBreakdown: CostBreakdownItem[];
    marketSize: {
        potentialAddressableMarket: string;
        totalAddressableMarket: string;
        serviceableAvailableMarket: string;
        serviceableObtainableMarket: string;
        calculationReference: string;
    };
    cashFlowModel: CashFlowModelOutput;
    scenarios?: FinancialScenario[];
}

export interface RiskItem {
    risk: string;
    category: 'Market' | 'Financial' | 'Technical' | 'Operational';
    likelihood: 'Low' | 'Medium' | 'High';
    impact: 'Low' | 'Medium' | 'High';
    mitigation: string;
}

export interface RiskAnalysisOutput {
    riskSummary: string;
    risks: RiskItem[];
}

export interface TechStackItem {
    layer: 'Frontend' | 'Backend' | 'Database' | 'Cloud/Hosting' | 'Key Libraries';
    technology: string;
    reason: string;
}

export interface ProductRoadmapPhase {
    phase: 'MVP (0-3 months)' | 'V1 (3-6 months)' | 'V2 (6-12 months)';
    strategicGoals: string[];
    features: string[];
}

export interface MvpDefinition {
    summary: string;
    coreFeatures: string[];
    successMetrics: string[];
}

export interface TechnicalArchitectOutput {
    architectureOverview: string;
    techStack: TechStackItem[];
    mvpDefinition: MvpDefinition;
    productRoadmap: ProductRoadmapPhase[];
    productRoadmapMermaidCode: string;
    aiCoreSpecification: {
        approach: string;
        reasoning: string;
    };
    validationStrategy: {
        phase: string;
        objective: string;
        methodology: string;
    }[];
}

export interface MarketExpansionPhase {
    market: string;
    timeframe: string;
    justification: string;
    strategicGoals: string[];
}

export interface CustomerJourneyStage {
    stageName: 'Awareness' | 'Consideration' | 'Purchase' | 'Service' | 'Loyalty';
    customerGoals: string[];
    touchpoints: string[];
    customerExperience: string;
}

export interface GoToMarketOutput {
    launchStrategySummary: string;
    initialTargetCustomer: {
        segment: string;
        justification: string;
    };
    impactMetrics: {
        metric: string;
        target: string;
        measurementMethod: string;
    }[];
    targetChannels: {
        channel: string;
        strategy: string;
        kpis: string;
    }[];
    keyMessaging: {
        slogan: string;
        messagePoints: string[];
    };
    launchTimeline: {
        phase: 'Pre-Launch' | 'Beta Launch' | 'Public Launch';
        activities: string[];
        duration: string;
    }[];
    sampleAdCopy: {
        channel: string;
        headline: string;
        body: string;
    }[];
    contentCalendar: {
        week: string;
        theme: string;
        samplePost: string;
    }[];
    marketExpansionRoadmap: MarketExpansionPhase[];
    expansionRoadmapMermaidCode: string;
    customerJourneyMap: CustomerJourneyStage[];
}

export interface SWOTAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface CompetitorAnalysis {
    name: string;
    description: string;
    keyProduct: string;
    businessModel: string;
    strengths: string[];
    weaknesses: string[];
    differentiationOpportunity: string;
}

export interface CompetitorPositioning {
    feature: string; // e.g., 'Technology/Innovation', 'Pricing', 'Brand Recognition'
    yourVenture: {
        rating: 'Weak' | 'Average' | 'Strong' | 'Leading';
        justification: string;
    };
    competitors: {
        rating: 'Weak' | 'Average' | 'Strong' | 'Leading';
        justification: string;
    };
}

export interface AdvantageRadarScore {
    axis: 'Innovation' | 'Brand Strength' | 'Market Position' | 'Defensibility' | 'Execution Speed';
    ventureScore: number; // 1-10
    competitorAverageScore: number; // 1-10
}

export interface StrategyOutput {
    swotAnalysis: SWOTAnalysis;
    competitors: CompetitorAnalysis[];
    unfairAdvantage: string;
    competitivePositioningMatrix?: CompetitorPositioning[];
    advantageRadar?: AdvantageRadarScore[];
    sources?: GroundingSource[];
}

export interface RedTeamOutput {
    competitorProfile: {
        name: string;
        description: string;
    };
    counterStrategySummary: string;
    keyVulnerabilitiesExploited: string[];
    productFlank: {
        strategy: string;
        features: string[];
    };
    marketingBlitz: {
        strategy: string;
        tactics: string[];
    };
    pricingPressure: {
        strategy: string;
        details: string;
    };
}

export interface EthicsScore {
    dimension: 'Data Privacy & Security' | 'Bias & Fairness' | 'Environmental Sustainability' | 'Social Equity & Inclusion' | 'Regulatory Compliance Risk';
    score: 'Green' | 'Yellow' | 'Red';
    explanation: string;
}

export interface EthicsOracleOutput {
    scores: EthicsScore[];
    recommendations: string[];
    redFlagWarning?: string;
}

export interface PitchDeckSlide {
    slideNumber: number;
    title: string;
    content: {
        heading: string;
        points: string[];
    }[];
    imagePrompt: string;
    imageB64?: string;
}

export interface PitchDeckOutput {
    executiveSummary: string;
    slides: PitchDeckSlide[];
}

export interface InvestmentMemoOutput {
    executiveSummary: string;
    problemAndSolution: {
        problem: string;
        solution: string;
    };
    marketOpportunity: {
        summary: string;
        marketSize: string;
    };
    product: {
        description: string;
        unfairAdvantage: string;
    };
    team: {
        summary: string;
        strengths: string[];
    };
    goToMarketStrategy: {
        summary: string;
    };
    financialsSummary: {
        summary: string;
        keyProjections: { metric: string; value: string; }[];
    };
    dealAndAsk: {
        ask: string;
        useOfFunds: string;
    };
    investmentThesis: string[];
    keyRisks: string[];
}

export interface SuccessScoreOutput {
    overallScore: number;
    scoreJustification: string;
    scoreLevel: 'Low' | 'Medium' | 'High' | 'Excellent';
    pillarScores: {
        pillar: 'Desirability' | 'Feasibility' | 'Viability' | 'Impact Integrity';
        score: number;
        summary: string;
    }[];
    keyStrengths: string[];
    areasForImprovement: string[];
    recommendations: string[];
}

export interface UsageMetrics {
    totalTokens: number;
    co2g: number;
}

// --- Cash Flow Modelling Module Types ---

export interface CashFlowAssumptions {
    forecastHorizon: number; // in years
    initialRevenue: number;
    revenueGrowthRate: number[]; // array for each year, as a decimal e.g. 0.2 for 20%
    cogsPercentage: number[]; // as % of revenue
    opex: { // as % of revenue
        researchAndDevelopment: number[];
        salesAndMarketing: number[];
        generalAndAdministrative: number[];
    };
    taxRate: number; // as decimal
    capexPercentage: number[]; // as % of revenue
    depreciationPercentage: number[]; // as % of CAPEX
    changeInNwcPercentage: number; // as % of REVENUE growth
    discountRate: number; // as decimal (WACC)
    terminalValueMethod: 'Gordon Growth' | 'Exit Multiple';
    terminalGrowthRate: number; // as decimal
    exitMultiple: number; // e.g., 5x EBITDA
}

export interface CashFlowYear {
    year: number;
    revenue: number;
    cogs: number;
    grossProfit: number;
    opex: {
        researchAndDevelopment: number;
        salesAndMarketing: number;
        generalAndAdministrative: number;
        total: number;
    };
    ebitda: number;
    depreciation: number;
    ebit: number;
    taxes: number;
    nopat: number; // Net Operating Profit After Tax
    capex: number;
    changeInNwc: number; // Change in Net Working Capital
    fcff: number; // Free Cash Flow to Firm
}

export interface CashFlowModelOutput {
    assumptions: CashFlowAssumptions;
    cashFlows: CashFlowYear[];
    terminalValue: number;
    enterpriseValue: number;
    npv: number;
    irr: number;
}


// --- Saved Run Structure ---
export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'pending';

export interface User {
  username: string;
  passwordHash?: string;
  authMethod: 'local' | 'google';
  role: UserRole;
  status: UserStatus;
  displayName: string;
  runCount: number;
  maxRuns: number;
}

export type UserProfile = Omit<User, 'passwordHash'>;

export interface ReportData {
    strategicDirective: StrategicDirective | null;
    ideaArea: string | null;
    targetMarket: string | null;
    userContext: string | null;
    userSolution: string | null;
    // Pre-simulation
    founders: FounderInput[] | null;
    founderDna: FounderDnaOutput | null;
    // Diamond 1
    research: ResearchOutput | null;
    customerPersona: CustomerPersonaOutput | null;
    empathyMap: EmpathyMapCanvasOutput | null;
    problemStatement: ProblemStatementOutput | null;
    // Diamond 2
    technologyScoutReport: TechnologyResearchOutput | null;
    allSolutions: IdeationOutput | null;
    allCritiques: AllCritiquesOutput | null;
    // FIX: Add ventureAnalysis to ReportData type to store output from Venture Analyst agent.
    ventureAnalysis: VentureAnalystOutput | null;
    solutionScoring: SolutionScoringOutput | null;
    selectedSolution: SolutionSelectionOutput | null;
    ipStrategy: IpStrategyOutput | null;
    talentStrategy: TalentStrategyOutput | null;
    valueProposition: ValuePropositionCanvasOutput | null;
    leanCanvas: LeanCanvasOutput | null;
    storyboard: StoryboardOutput | null;
    financialPlan: FinancialPlanningOutput | null;
    investmentMemo: InvestmentMemoOutput | null;
    riskAnalysis: RiskAnalysisOutput | null;
    technicalBlueprint: TechnicalArchitectOutput | null;
    goToMarket: GoToMarketOutput | null;
    strategy: StrategyOutput | null;
    redTeam: RedTeamOutput | null;
    ethicsReport: EthicsOracleOutput | null;
    pitchDeck: PitchDeckOutput | null;
    successScore: SuccessScoreOutput | null;
    usageMetrics?: UsageMetrics | null;
}

export interface SavedRun {
    id: string;
    username: string;
    savedAt: string;
    challenge: string;
    title?: string;
    report: ReportData;
}

// --- Interactive Components ---
export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// --- App Performance & Learning ---
export interface AgentTimingData {
    id: string; // Composite key: `${modelMode}-${role}`
    modelMode: ModelMode;
    role: AgentRole;
    totalDurationSeconds: number;
    runCount: number;
}
