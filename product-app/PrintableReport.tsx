import React from 'react';
import { ReportData, StrategicDirective, Agent, FinancialPlanningOutput } from '../types';
import { IDEA_AREAS, TARGET_MARKETS } from '../constants';
// FIX: Correct component imports from CanvasViews. Some components were not exported from the main file.
import { 
    StrategyCanvas,
    CustomerPersonaCanvas,
    EmpathyMapCanvas,
    ValuePropositionCanvas,
    LeanCanvas,
    StoryboardReportCanvas,
    FinancialModelerCanvas,
    RiskAnalysisCanvas,
    TechnicalBlueprintCanvas,
    GoToMarketCanvas,
    MarketAnalysisCanvas,
    ReferencesCanvas,
    ProblemStatementCanvas,
    SolutionSelectionCanvas,
    RedTeamCanvas,
    EthicsCanvas,
    FounderDnaCanvas,
    CompetitiveLandscapeCanvas,
    EthicalConsiderationsCanvas,
    UsageMetricsCanvas,
    ElevatorPitchView,
    SuccessScoreCanvas,
    InnovationVennDiagram,
    IpStrategyCanvas,
    TechnologyScoutCanvas,
    IdealCoFounderCanvas,
    TeamCompositionCanvas,
    SolutionScoringCanvas,
    InvestmentMemoCanvas,
    VentureAnalystCanvas,
    FounderAnalysisProfileCanvas
} from './CanvasViews';

interface PrintableReportProps {
    challenge: string;
    report: ReportData;
    agents?: Agent[];
}

const DirectivePill: React.FC<{ directive: StrategicDirective | null }> = ({ directive }) => {
    if (!directive) return null;
    
    const directiveText = directive.replace(/_/g, ' ');
    const colors = {
        BALANCED: 'bg-blue-100 text-blue-800',
        TIME_TO_MARKET: 'bg-yellow-100 text-yellow-800',
        UNIQUE_VALUE_PROPOSITION: 'bg-purple-100 text-purple-800',
        CAPITAL_EFFICIENCY: 'bg-green-100 text-green-800'
    };

    return (
        <div className="mt-8">
             <span className={`px-4 py-2 text-sm font-semibold rounded-full ${colors[directive] || colors.BALANCED}`}>
                Strategic Directive: {directiveText}
            </span>
        </div>
    );
}

const CoverPage: React.FC<{
    challenge: string;
    brandName: string;
    directive: StrategicDirective | null;
    ideaArea: string | null;
    targetMarket: string | null;
    userSolution: string | null;
}> = ({ challenge, brandName, directive, ideaArea, targetMarket, userSolution }) => {
    const ideaAreaLabel = IDEA_AREAS.find(a => a.value === ideaArea)?.label || ideaArea;
    const targetMarketLabel = TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket;
    return (
        <div className="w-full h-full p-10 flex flex-col justify-between items-center text-center text-gray-800">
            <div /> 
            <div className="w-full">
                <h1 className="text-6xl font-extrabold" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.1)' }}>
                    {brandName}
                </h1>
                <h2 className="text-2xl text-gray-600 mt-4">
                    Venture Creation Report
                </h2>
                <div className="mt-8 text-left max-w-2xl mx-auto">
                     <p className="text-lg font-semibold bg-white/60 backdrop-blur-sm p-4 rounded-lg border border-gray-200 shadow-sm leading-relaxed">
                        <span className="font-bold">Area:</span> {ideaAreaLabel}<br/>
                        <span className="font-bold">Market:</span> {targetMarketLabel}<br/>
                        <span className="font-bold">Initial Challenge:</span> "{challenge}"
                        {userSolution && <>
                            <br/><span className="font-bold">Provided Solution:</span> "{userSolution}"
                        </>}
                    </p>
                </div>
                <DirectivePill directive={directive} />
            </div>
            <div className="w-full text-gray-600 text-sm">
                 <p>© {new Date().getFullYear()} Reza Kalantarinejad & Marc J Ventresca</p>
                 <p>Saïd Business School, University of Oxford</p>
            </div>
        </div>
    );
};


const Chapter: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    // This structure creates a clean, flowing document for html2canvas to process.
    // `break-before-page` is a hint for standard printing. The top margin creates visual separation.
    <section className="break-before-page pt-12">
        <h3 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-300 pb-2 mb-8">{title}</h3>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);


const PrintableReport = React.forwardRef<HTMLDivElement, PrintableReportProps>(
    ({ challenge, report, agents = [] }, ref) => {
        const {
            strategicDirective, ideaArea, targetMarket, userSolution, founders, founderDna, research, customerPersona, empathyMap, problemStatement,
            technologyScoutReport, allSolutions, allCritiques, solutionScoring, selectedSolution, ipStrategy, talentStrategy,
            valueProposition, leanCanvas, storyboard, financialPlan,
            riskAnalysis, technicalBlueprint, goToMarket, pitchDeck, strategy,
            redTeam, ethicsReport, usageMetrics, successScore, investmentMemo
        } = report;
        
        return (
            <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '210mm', background: 'white', color: 'black', fontFamily: 'Inter, sans-serif' }}>
                <div ref={ref} className="bg-white">
                    {/* Page 1: Cover. Fixed height ensures it's treated as a single page. */}
                    <div className="w-full h-[297mm] p-0">
                         <div className="relative w-full h-full bg-gray-100">
                             {financialPlan?.elevatorPitchImageB64 && (
                                <img src={`data:image/jpeg;base64,${financialPlan.elevatorPitchImageB64}`} alt="Brand Banner" className="absolute inset-0 w-full h-full object-cover" />
                            )}
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm"></div>
                            <div className="absolute inset-0">
                                <CoverPage 
                                    challenge={challenge}
                                    brandName={financialPlan?.selectedBrandName || "Innovation Report"}
                                    directive={strategicDirective}
                                    ideaArea={ideaArea}
                                    targetMarket={targetMarket}
                                    userSolution={userSolution}
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* All other content flows naturally within this padded container */}
                    <div className="p-10">
                        {pitchDeck?.executiveSummary && (
                            <Chapter title="Executive Summary">
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">{pitchDeck.executiveSummary}</p>
                            </Chapter>
                        )}

                        {investmentMemo && (
                            <Chapter title="Investment Memo">
                                <InvestmentMemoCanvas data={investmentMemo} isPrintable={true} />
                            </Chapter>
                        )}

                        {(founderDna || talentStrategy) && (
                            <Chapter title="Chapter 1: Founder & Team Strategy">
                                {founderDna && <FounderDnaCanvas analysis={founderDna} founders={founders} isPrintable={true} />}
                                {talentStrategy && <IdealCoFounderCanvas data={talentStrategy} isPrintable={true} />}
                                {talentStrategy?.teamCapabilityAnalysis && <TeamCompositionCanvas data={talentStrategy} isPrintable={true} />}
                            </Chapter>
                        )}
                        
                        {(problemStatement || customerPersona || empathyMap || research) && (
                            <Chapter title="Chapter 2: Problem Space & Customer Insights">
                                {problemStatement && <ProblemStatementCanvas data={problemStatement} isPrintable={true} />}
                                {customerPersona && <CustomerPersonaCanvas data={customerPersona} isPrintable={true} />}
                                {empathyMap && <EmpathyMapCanvas data={empathyMap} isPrintable={true} />}
                                {(research?.marketAnalysis || financialPlan?.marketSize) && <MarketAnalysisCanvas researchData={research} financialData={financialPlan} isPrintable={true} />}
                            </Chapter>
                        )}
                        
                        {(selectedSolution || valueProposition || leanCanvas) && (
                            <Chapter title="Chapter 3: Solution & Business Model">
                                {technologyScoutReport && <TechnologyScoutCanvas data={technologyScoutReport} isPrintable={true} />}
                                {solutionScoring && allSolutions && <SolutionScoringCanvas data={solutionScoring} allSolutions={allSolutions} isPrintable={true} />}
                                {selectedSolution && <SolutionSelectionCanvas data={selectedSolution} allSolutions={allSolutions} allCritiques={allCritiques} isPrintable={true} />}
                                {ipStrategy && <IpStrategyCanvas data={ipStrategy} isPrintable={true} />}
                                {valueProposition && <ValuePropositionCanvas data={valueProposition} isPrintable={true} />}
                                {leanCanvas && <LeanCanvas data={leanCanvas} isPrintable={true} />}
                            </Chapter>
                        )}

                        {storyboard && (
                            <Chapter title="Chapter 4: Customer Journey Storyboard">
                                <StoryboardReportCanvas data={storyboard} isPrintable={true} />
                            </Chapter>
                        )}
                        
                        {strategy && (
                            <Chapter title="Chapter 5: Strategic Advantages">
                                <StrategyCanvas data={strategy} isPrintable={true} />
                                {research?.competitiveLandscape && research.competitiveLandscape.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h4 className="text-2xl font-bold mb-4 text-gray-700">Initial Competitive Landscape</h4>
                                        <CompetitiveLandscapeCanvas data={research} isPrintable={true} />
                                    </div>
                                )}
                            </Chapter>
                        )}
                        
                        {goToMarket && (
                            <Chapter title="Chapter 6: Go-to-Market Strategy">
                               <GoToMarketCanvas data={goToMarket} isPrintable={true} />
                            </Chapter>
                        )}

                        {riskAnalysis && (
                            <Chapter title="Chapter 7: Risk Analysis & Mitigation">
                                <RiskAnalysisCanvas data={riskAnalysis} isPrintable={true} />
                                {research?.ethicalConsiderations && research.ethicalConsiderations.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h4 className="text-2xl font-bold mb-4 text-gray-700">Initial Ethical Considerations</h4>
                                        <EthicalConsiderationsCanvas data={research} isPrintable={true} />
                                    </div>
                                )}
                            </Chapter>
                        )}
                        
                        {technicalBlueprint && (
                            <Chapter title="Chapter 8: Operational & Technical Blueprint">
                                <TechnicalBlueprintCanvas data={technicalBlueprint} isPrintable={true} />
                            </Chapter>
                        )}
                        
                        {financialPlan && (
                            <Chapter title="Chapter 9: Financial Plan & Projections">
                                <FinancialModelerCanvas data={financialPlan} isPrintable={true} />
                            </Chapter>
                        )}

                         {redTeam && (
                             <Chapter title="Chapter 10: Red Team Analysis">
                                <RedTeamCanvas data={redTeam} isPrintable={true} />
                            </Chapter>
                        )}

                        {ethicsReport && (
                             <Chapter title="Chapter 11: Ethics & Compliance Audit">
                                <EthicsCanvas data={ethicsReport} isPrintable={true} />
                            </Chapter>
                        )}

                        {successScore && (
                             <Chapter title="Chapter 12: Venture Success Score">
                                <InnovationVennDiagram data={successScore} isPrintable={true} />
                                <div className="mt-8">
                                    <SuccessScoreCanvas data={successScore} isPrintable={true} />
                                </div>
                            </Chapter>
                        )}
                        
                        {research?.sources && research.sources.length > 0 && (
                            <Chapter title="References">
                                <ReferencesCanvas sources={research.sources} isPrintable={true} />
                            </Chapter>
                        )}

                        {usageMetrics && agents && (
                             <Chapter title="Appendix: Computational Usage">
                                <UsageMetricsCanvas agents={agents} metrics={usageMetrics} isPrintable={true} />
                            </Chapter>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

export default PrintableReport;