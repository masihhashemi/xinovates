


import { Agent, AgentRole } from './types';
// FIX: Add missing icon imports
import { AnalystAvatar, PersonaAvatar, EmpathyMapAvatar, ProblemSynthesizerAvatar, VisionaryAvatar, DevilsAdvocateAvatar, SolutionSelectorAvatar, ValuePropositionAvatar, ModelerAvatar, StorytellerAvatar, ForecasterAvatar, RiskAvatar, BlueprintAvatar, LaunchAvatar, StrategistAvatar, SteveJobsAvatar, PitchDeckAvatar, EthicsOracleAvatar, UsersIcon, StarIcon, ScaleIcon, MagnifyingGlassIcon, AcademicCapIcon, SparklesIcon, DocumentTextIcon } from './components/Icons';

export const APP_VERSION = '1.20.0';

// An illustrative, conservative estimate for CO2 emissions from LLM inference.
// Based on figures like 0.03g per query (~1k tokens).
export const CO2_GRAMS_PER_1K_TOKENS = 0.03;

// A fixed token "cost" for each image generation call, as they don't return token counts.
export const IMAGE_GENERATION_TOKEN_COST = 250;

// Estimated seconds per agent task, used for pre-simulation time estimates.
export const ESTIMATED_TIME_PER_AGENT_SECONDS = {
    quality: 12,
    creative: 15,
    fast: 6,
};

export const CHANGELOG = [
  {
    version: '1.20.0',
    date: 'July 2024',
    changes: [
        '**Feature**: Significantly expanded the "Target Market" selection to include a comprehensive list of countries.',
        '**UI Improvement**: Added visual status indicators (colored dots) to Agent nodes for better progress tracking.',
    ],
  },
  {
    version: '1.19.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Added a new **Investment Memo Writer** agent to synthesize the full venture plan into a professional memo for VCs.',
        '**Improvement**: Renamed the "Financial Planner" agent to **"Financial Modeler"** to more accurately reflect its function in creating detailed financial models and projections.',
    ],
  },
  {
    version: '1.18.1',
    date: 'July 2024',
    changes: [
        '**Feature**: Added a "Regenerate Ideas" button to the Solution Analysis screen, allowing users to request a new set of solutions if the initial batch is not satisfactory.',
        '**Improvement**: Enhanced the iterative loop during the ideation phase, giving users more control over the creative process.'
    ],
  },
  {
    version: '1.18.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Enhanced the solution selection phase with a quantitative "Solution Analysis" dashboard. The Venture Analyst now scores each idea on key metrics (Innovation, Feasibility, Market Fit, etc.).',
        '**Feature**: Added a spider chart to visually compare the strengths and weaknesses of each solution.',
        '**Feature**: Added a "Tangible Advantages" chart to quantify the benefits of each solution against the current baseline.',
        '**Improvement**: The idea selection screen is now a more powerful, data-driven decision point for the user.',
    ],
  },
  {
    version: '1.17.0',
    date: 'July 2024',
    changes: [
        '**Feature**: Reintroduced user selection after the AI\'s "Tournament of Ideas." Users can now review the AI\'s ranked analysis and choose which concept to evolve, providing a better balance between AI automation and user strategy.',
    ],
  },
  {
    version: '1.16.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: The "Talent Strategist" is now interactive. Users can trigger a "Talent Scout" AI agent that suggests real-world professional examples from public sources like LinkedIn for each ideal co-founder profile.',
        '**Improvement**: Enhanced UI for displaying suggested candidates with justifications and links to public profiles.',
    ],
  },
  {
    version: '1.15.1',
    date: 'July 2024',
    changes: [
        '**Patch**: Internal code quality improvements and stability updates.',
    ],
  },
  {
    version: '1.15.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Added a "Pitch Deck" agent. It can be selected as a deliverable to synthesize the entire venture plan into a 10-slide investor pitch deck.',
        '**Feature**: The final report now includes a "Pitch Deck" tab with a slide viewer and an option to download the deck as a multi-page PDF.',
    ],
  },
  {
    version: '1.14.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Added a "Talent Strategist" agent that analyzes the solution and founder DNA to recommend ideal co-founder profiles needed to fill skill and experience gaps.',
        '**Improvement**: The new "Ideal Co-Founder Profiles" section is now integrated into the "Founders" tab in the final report.',
    ],
  },
  {
    version: '1.13.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Introduced the "IP Strategist" agent to analyze a solution\'s novelty, patentability, and freedom to operate.',
        '**Feature**: Added a new "IP & Defensibility" canvas to the final report to display the IP analysis.',
        '**Improvement**: Updated UI icons for Red Team and Ethics audit tabs for better visual distinction.'
    ],
  },
  {
    version: '1.12.3',
    date: 'July 2024',
    changes: [
        '**Improvement**: The version number on the login page is now interactive and displays the full version history.',
        '**Patch**: Internal code quality improvements and dependency updates.',
    ],
  },
  {
    version: '1.12.2',
    date: 'July 2024',
    changes: [
        '**Patch**: Corrected module resolution paths and fixed component import/export errors across the application.',
        '**Patch**: Resolved a syntax error in the Cash Flow Modelling module.',
        '**Patch**: Implemented and exported several missing UI components to ensure application stability.'
    ],
  },
  {
    version: '1.12.1',
    date: 'July 2024',
    changes: [
        '**Patch**: Internal updates and performance improvements.',
    ],
  },
  {
    version: '1.12.0',
    date: 'July 2024',
    changes: [
        '**Feature**: Added a new Brand Naming step. When a user provides their own solution, the AI now suggests brand names to choose from or allows for custom entry.',
        '**Feature**: Added "Consultancy" as a new option in the "Area of Innovation" dropdown, expanding the types of ventures that can be explored.',
    ],
  },
  {
    version: '1.11.0',
    date: 'July 2024',
    changes: [
        '**Feature**: Added "Area of Innovation" and "Target Market" selectors to allow users to guide the ideation process towards specific domains.',
        '**Improvement**: All configuration controls are now disabled during a simulation run to improve user experience and prevent errors.',
    ],
  },
  {
    version: '1.10.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Introduced financial scenario modeling. Users can now run \'Best Case\' and \'Worst Case\' analyses to stress-test their financial projections.',
    ],
  },
  {
    version: '1.9.0',
    date: 'July 2024',
    changes: [
        '**Major Improvement**: Overhauled the financial modeling to provide a granular, spreadsheet-style breakdown of revenue and costs, ensuring greater transparency and accuracy.',
        '**Improvement**: Completely redesigned the Customer Journey Map with an intuitive visual timeline for enhanced readability and strategic clarity.',
    ],
  },
  {
    version: '1.8.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Added the "Innovation Viability Framework" to the Overview tab, providing a Venn diagram visualization of the venture\'s core strengths (Desirability, Feasibility, Viability, Adaptability).',
        '**Feature**: Replaced the technical architecture diagram with a strategic Customer Journey Map on the Go-to-Market tab.',
        '**Feature**: Added a detailed financial data table below the projection chart for transparent analysis.',
        '**Improvement**: Enhanced financial reporting consistency between the overview snapshot and detailed projections.',
        '**Patch**: Fixed a rendering issue where the financial projection chart would not display correctly.'
    ],
  },
  {
    version: '1.7.0',
    date: 'July 2024',
    changes: [
        '**Feature**: Redesigned the "Overview" tab into a dynamic, scannable infographic.',
        '**Improvement**: The new infographic view provides a more compelling executive summary, combining the elevator pitch, success score, core venture details, and customer journey into a single, cohesive narrative.',
    ],
  },
  {
    version: '1.6.0',
    date: 'July 2024',
    changes: [
        '**Major Feature**: Introduced a predictive "Innovation Success Score". This AI-powered analysis provides a VC-style rating of the venture\'s potential based on Desirability, Feasibility, Viability, and Impact Integrity.',
    ],
  },
  {
    version: '1.5.0',
    date: 'July 2024',
    changes: [
        '**Refactor**: Removed the UI/UX Wireframer agent to streamline the venture creation process and focus on core strategic deliverables.',
    ],
  },
  {
    version: '1.4.2',
    date: 'July 2024',
    changes: [
        '**Patch**: Minor UI text and layout improvements.',
        '**Patch**: Improved stability for image generation services.',
        '**Patch**: Corrected formatting in downloadable PDF reports.',
    ],
  },
  {
    version: '1.4.0',
    date: 'July 2024',
    changes: [
      '**Major Feature**: Added post-analysis "Red Team" agent to generate competitive counter-strategies.',
      '**Major Feature**: Added post-analysis "Ethics Oracle" agent to perform an ethical audit of the venture.',
      '**Feature**: UI/UX Wireframer agent now generates an HTML preview of the main application screen.',
      '**Improvement**: Revamped the agent progress visualization for better clarity and aesthetics.',
      '**Improvement**: The full venture plan can now be downloaded as a shareable, self-contained HTML file.',
      '**Improvement**: Added interactive chat with the generated Customer Persona.',
    ],
  },
  {
    version: '1.3.0',
    date: 'June 2024',
    changes: [
      '**Major Feature**: Introduced optional "Founder DNA" analysis to tailor ideation to the founding team\'s strengths.',
      '**Feature**: Added a "Devil\'s Advocate" refinement loop, allowing users to iteratively improve the selected solution before generating final deliverables.',
      '**Improvement**: Added user authentication and the ability to save and load past venture runs.',
      '**Improvement**: Reworked the final report view with dedicated tabs for each canvas and improved navigation.',
    ],
  },
];


export const IDEA_AREAS = [
    { value: 'OTHER', label: 'Other / General' },
    { value: 'AI_SAAS', label: 'Artificial Intelligence & SaaS' },
    { value: 'DEEP_TECH', label: 'Deep Tech' },
    { value: 'HEALTH', label: 'Healthcare & Biotech' },
    { value: 'FINTECH', label: 'Finance & FinTech' },
    { value: 'SUSTAINABILITY', label: 'Sustainability & Green Tech' },
    { value: 'EDUCATION', label: 'Education & EdTech' },
    { value: 'CONSUMER', label: 'Consumer Goods & Retail' },
    { value: 'MEDIA', label: 'Entertainment & Media' },
    { value: 'TRANSPORT', label: 'Transportation & Logistics' },
    { value: 'PROPTECH', label: 'Real Estate & PropTech' },
    { value: 'SOCIAL_IMPACT', label: 'Social Impact & Non-Profit' },
    { value: 'CONSULTANCY', label: 'Consultancy' }
];

export const TARGET_MARKETS = [
    { value: 'GLOBAL', label: 'Global (Default)' },
    // Regions
    { value: 'NORTH_AMERICA_REGION', label: 'North America (Region)' },
    { value: 'EUROPE_REGION', label: 'Europe (Region)' },
    { value: 'ASIA_PACIFIC_REGION', label: 'Asia Pacific (Region)' },
    { value: 'LATIN_AMERICA_REGION', label: 'Latin America (Region)' },
    { value: 'MIDDLE_EAST_REGION', label: 'Middle East (Region)' },
    { value: 'AFRICA_REGION', label: 'Africa (Region)' },
    // Countries - Top Markets & Comprehensive List
    { value: 'US', label: 'United States' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' },
    { value: 'AU', label: 'Australia' },
    { value: 'AF', label: 'Afghanistan' },
    { value: 'AL', label: 'Albania' },
    { value: 'DZ', label: 'Algeria' },
    { value: 'AD', label: 'Andorra' },
    { value: 'AO', label: 'Angola' },
    { value: 'AR', label: 'Argentina' },
    { value: 'AM', label: 'Armenia' },
    { value: 'AT', label: 'Austria' },
    { value: 'AZ', label: 'Azerbaijan' },
    { value: 'BH', label: 'Bahrain' },
    { value: 'BD', label: 'Bangladesh' },
    { value: 'BE', label: 'Belgium' },
    { value: 'BO', label: 'Bolivia' },
    { value: 'BA', label: 'Bosnia and Herzegovina' },
    { value: 'BW', label: 'Botswana' },
    { value: 'BG', label: 'Bulgaria' },
    { value: 'KH', label: 'Cambodia' },
    { value: 'CM', label: 'Cameroon' },
    { value: 'CL', label: 'Chile' },
    { value: 'CO', label: 'Colombia' },
    { value: 'CR', label: 'Costa Rica' },
    { value: 'HR', label: 'Croatia' },
    { value: 'CY', label: 'Cyprus' },
    { value: 'CZ', label: 'Czech Republic' },
    { value: 'DK', label: 'Denmark' },
    { value: 'DO', label: 'Dominican Republic' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'EG', label: 'Egypt' },
    { value: 'EE', label: 'Estonia' },
    { value: 'ET', label: 'Ethiopia' },
    { value: 'FI', label: 'Finland' },
    { value: 'GE', label: 'Georgia' },
    { value: 'GH', label: 'Ghana' },
    { value: 'GR', label: 'Greece' },
    { value: 'HK', label: 'Hong Kong' },
    { value: 'HU', label: 'Hungary' },
    { value: 'IS', label: 'Iceland' },
    { value: 'ID', label: 'Indonesia' },
    { value: 'IR', label: 'Iran' },
    { value: 'IQ', label: 'Iraq' },
    { value: 'IE', label: 'Ireland' },
    { value: 'IL', label: 'Israel' },
    { value: 'IT', label: 'Italy' },
    { value: 'JM', label: 'Jamaica' },
    { value: 'JO', label: 'Jordan' },
    { value: 'KZ', label: 'Kazakhstan' },
    { value: 'KE', label: 'Kenya' },
    { value: 'KR', label: 'South Korea' },
    { value: 'KW', label: 'Kuwait' },
    { value: 'LV', label: 'Latvia' },
    { value: 'LB', label: 'Lebanon' },
    { value: 'LT', label: 'Lithuania' },
    { value: 'LU', label: 'Luxembourg' },
    { value: 'MY', label: 'Malaysia' },
    { value: 'MT', label: 'Malta' },
    { value: 'MX', label: 'Mexico' },
    { value: 'MA', label: 'Morocco' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'NO', label: 'Norway' },
    { value: 'OM', label: 'Oman' },
    { value: 'PK', label: 'Pakistan' },
    { value: 'PA', label: 'Panama' },
    { value: 'PE', label: 'Peru' },
    { value: 'PH', label: 'Philippines' },
    { value: 'PL', label: 'Poland' },
    { value: 'PT', label: 'Portugal' },
    { value: 'QA', label: 'Qatar' },
    { value: 'RO', label: 'Romania' },
    { value: 'RU', label: 'Russia' },
    { value: 'SA', label: 'Saudi Arabia' },
    { value: 'RS', label: 'Serbia' },
    { value: 'SG', label: 'Singapore' },
    { value: 'SK', label: 'Slovakia' },
    { value: 'SI', label: 'Slovenia' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'ES', label: 'Spain' },
    { value: 'LK', label: 'Sri Lanka' },
    { value: 'SE', label: 'Sweden' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'TW', label: 'Taiwan' },
    { value: 'TH', label: 'Thailand' },
    { value: 'TR', label: 'Turkey' },
    { value: 'UA', label: 'Ukraine' },
    { value: 'AE', label: 'United Arab Emirates' },
    { value: 'UY', label: 'Uruguay' },
    { value: 'VN', label: 'Vietnam' }
];


export const AGENT_DEFINITIONS: Agent[] = [
    // --- PRE-SIMULATION ---
    {
        role: AgentRole.FOUNDER_DNA,
        name: 'Founder DNA',
        description: 'Profiles the founding team based on their backgrounds, styles, and motivations to provide strategic self-awareness and identify team synergies.',
        status: 'idle',
        avatar: UsersIcon,
    },
    {
        role: AgentRole.MARKET_FIT_ANALYST,
        name: 'Market-Fit Analyst',
        description: 'Analyzes a user-provided solution to identify the most promising market problems it could solve, generating actionable challenges.',
        status: 'idle',
        avatar: MagnifyingGlassIcon,
    },
    // --- DISCOVER ---
    {
        role: AgentRole.PROBLEM_RESEARCH,
        name: 'Problem Research',
        description: 'Performs deep, recursive market research. Scans the landscape, identifies gaps, executes targeted follow-up searches, and synthesizes comprehensive data on competitors and trends.',
        status: 'idle',
        avatar: AnalystAvatar,
    },
    {
        role: AgentRole.CUSTOMER_PERSONA,
        name: 'Persona Creator',
        description: 'Creates a detailed, representative customer persona based on the initial research.',
        status: 'idle',
        avatar: PersonaAvatar,
    },
    {
        role: AgentRole.EMPATHY_MAP,
        name: 'Empathy Mapper',
        description: 'Builds an empathy map to deeply understand the persona\'s world, thoughts, and feelings.',
        status: 'idle',
        avatar: EmpathyMapAvatar,
    },
    // --- DEFINE ---
    {
        role: AgentRole.PROBLEM_SYNTHESIZER,
        name: 'Problem Synthesizer',
        description: 'Analyzes all discovery findings to define a single, clear, and actionable problem statement.',
        status: 'idle',
        avatar: ProblemSynthesizerAvatar,
    },
    // --- DEVELOP ---
    {
        role: AgentRole.TECHNOLOGY_SCOUT,
        name: 'Technology Scout',
        description: 'Researches existing technologies, academic literature, and solution patterns relevant to the defined problem to inform the ideation process.',
        status: 'idle',
        avatar: AcademicCapIcon,
    },
    {
        role: AgentRole.SOLUTION_IDEATION,
        name: 'Solution Ideation',
        description: 'Brainstorms multiple, diverse solutions specifically for the defined problem statement.',
        status: 'idle',
        avatar: VisionaryAvatar,
    },
    {
        role: AgentRole.SOLUTION_CRITIQUE,
        name: 'Solution Critics',
        description: 'Rigorously critiques the potential solutions from both pragmatic (Devil\'s Advocate) and visionary (Steve Jobs) perspectives.',
        status: 'idle',
        avatar: DevilsAdvocateAvatar, // Primary avatar
    },
    {
        role: AgentRole.VENTURE_ANALYST,
        name: 'Venture Analyst',
        description: 'Scores and ranks solutions based on key venture metrics (e.g., Innovation, Feasibility, Market Fit), providing a data-driven comparison with visual charts to aid in decision-making.',
        status: 'idle',
        avatar: ScaleIcon,
    },
    {
        role: AgentRole.SOLUTION_EVOLUTION,
        name: 'Solution Evolution',
        description: 'Evolves the user-selected idea by synthesizing its strengths with features from other concepts and addressing key critiques to create a superior version.',
        status: 'idle',
        avatar: SparklesIcon,
    },
    {
        role: AgentRole.SOLUTION_SELECTION,
        name: 'Solution Selection',
        description: 'Finalizes the evolved solution, providing a clear title, description, and justification for the chosen path forward.',
        status: 'idle',
        avatar: SolutionSelectorAvatar,
    },
    {
        role: AgentRole.DEVILS_ADVOCATE,
        name: "Devil's Advocate",
        description: "Provides a final, critical review of the selected solution, enabling an optional iterative refinement loop before final deliverable generation.",
        status: 'idle',
        avatar: DevilsAdvocateAvatar,
    },
    // --- DELIVER ---
    {
        role: AgentRole.IP_STRATEGIST,
        name: 'IP Strategist',
        description: "Analyzes the solution's novelty, potential patentability, and freedom to operate by searching for prior art. Recommends an intellectual property strategy.",
        status: 'idle',
        avatar: ScaleIcon,
    },
    {
        role: AgentRole.TALENT_STRATEGIST,
        name: 'Talent Strategist',
        description: "Analyzes the selected solution and existing team's DNA to identify and describe the ideal co-founders needed to fill skill and personality gaps.",
        status: 'idle',
        avatar: UsersIcon,
    },
    {
        role: AgentRole.VALUE_PROPOSITION,
        name: 'Value Proposition',
        description: 'Creates the Value Proposition Canvas for the selected solution.',
        status: 'idle',
        avatar: ValuePropositionAvatar,
    },
    {
        role: AgentRole.LEAN_CANVAS,
        name: 'Lean Canvas Modeler',
        description: 'Constructs the Lean Canvas to focus on a problem-solution fit, key metrics, and a path to market.',
        status: 'idle',
        avatar: ModelerAvatar,
    },
    {
        role: AgentRole.STORYBOARDING,
        name: 'Storyboarding',
        description: 'Creates a visual storyboard to illustrate the customer experience with the solution.',
        status: 'idle',
        avatar: StorytellerAvatar,
    },
    {
        role: AgentRole.FINANCIAL_MODELER,
        name: 'Financial Modeler',
        description: 'Projects 5-year financials, valuation, market size, and constructs a detailed interactive financial model.',
        status: 'idle',
        avatar: ForecasterAvatar,
    },
     {
        role: AgentRole.STRATEGY,
        name: 'Strategy',
        description: 'Formulates strategic analysis, including SWOT and competitive landscape, to define the unfair advantage.',
        status: 'idle',
        avatar: StrategistAvatar,
    },
    {
        role: AgentRole.RISK_ANALYSIS,
        name: 'Risk Analysis',
        description: 'Identifies potential risks and suggests mitigation strategies.',
        status: 'idle',
        avatar: RiskAvatar,
    },
    {
        role: AgentRole.TECHNICAL_BLUEPRINT,
        name: 'Tech Blueprint',
        description: 'Outlines a high-level tech stack, architecture, and development roadmap.',
        status: 'idle',
        avatar: BlueprintAvatar,
    },
    {
        role: AgentRole.GO_TO_MARKET,
        name: 'GTM Strategist',
        description: 'Develops a launch strategy, defining marketing channels, messaging, and timelines.',
        status: 'idle',
        avatar: LaunchAvatar,
    },
    {
        role: AgentRole.PITCH_DECK,
        name: 'Pitch Deck',
        description: 'Generates an investor-ready pitch deck.',
        status: 'idle',
        avatar: PitchDeckAvatar,
    },
    {
        role: AgentRole.INVESTMENT_MEMO,
        name: 'Investment Memo Writer',
        description: 'Synthesizes the entire venture plan into a structured investment memorandum for VCs.',
        status: 'idle',
        avatar: DocumentTextIcon,
    },
    // --- POST-ANALYSIS ---
    {
        role: AgentRole.ETHICS_ORACLE,
        name: 'Ethics Oracle',
        description: 'Evaluates the ethical and societal implications of the proposed business venture.',
        status: 'idle',
        avatar: EthicsOracleAvatar,
    },
    {
        role: AgentRole.SUCCESS_SCORE_ANALYSIS,
        name: 'Success Score Analyst',
        description: 'Provides a VC-style analysis and predictive success score for the entire venture plan.',
        status: 'idle',
        avatar: StarIcon,
    }
];