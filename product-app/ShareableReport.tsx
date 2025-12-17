import React from 'react';
import { ReportData, Agent } from '../types';
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
    ElevatorPitchView,
    RedTeamCanvas,
    EthicsCanvas,
    FounderDnaCanvas,
    CompetitiveLandscapeCanvas,
    EthicalConsiderationsCanvas,
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

interface ShareableReportProps {
    challenge: string;
    report: ReportData;
    agents?: Agent[];
}

const WebSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="printable-section mb-12">
        <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">{title}</h2>
        <div className="space-y-8">
            {children}
        </div>
    </section>
);


const ShareableReport = React.forwardRef<HTMLDivElement, ShareableReportProps>(
    ({ challenge, report }, ref) => {
        const {
            strategicDirective, founders, founderDna, research, customerPersona, empathyMap, problemStatement,
            technologyScoutReport, allSolutions, allCritiques, solutionScoring, selectedSolution, ipStrategy, talentStrategy,
            valueProposition, leanCanvas, storyboard, financialPlan,
            riskAnalysis, technicalBlueprint, goToMarket, pitchDeck, strategy,
            redTeam, ethicsReport, ideaArea, targetMarket, userSolution, successScore, investmentMemo
        } = report;

        const ideaAreaLabel = IDEA_AREAS.find(a => a.value === ideaArea)?.label || ideaArea;
        const targetMarketLabel = TARGET_MARKETS.find(m => m.value === targetMarket)?.label || targetMarket;
        
        return (
            <div style={{ position: 'absolute', left: '-9999px', top: 0, background: 'white', color: 'black' }} className="w-[900px]">
                <div ref={ref}>
                    <header className="bg-gray-800 text-white p-12 text-center">
                        <h1 className="text-6xl font-extrabold" style={{ background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {financialPlan?.selectedBrandName || "Innovation Report"}
                        </h1>
                        <p className="text-xl text-gray-300 mt-4">Venture Creation Report</p>
                        <p className="mt-8 text-lg bg-gray-700 p-4 rounded-lg inline-block text-left leading-relaxed">
                            <span className="font-bold">Area:</span> {ideaAreaLabel}<br/>
                             <span className="font-bold">Market:</span> {targetMarketLabel}<br/>
                            <span className="font-bold">Initial Challenge:</span> "{challenge}"
                            {userSolution && <>
                                <br/><span className="font-bold">Provided Solution:</span> "{userSolution}"
                            </>}
                        </p>
                    </header>
                    
                    <main className="max-w-4xl mx-auto p-8">
                        {financialPlan && <ElevatorPitchView data={financialPlan} isPrintable={true} />}
                        
                        {pitchDeck?.executiveSummary && (
                            <WebSection title="Executive Summary">
                                <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg">{pitchDeck.executiveSummary}</p>
                            </WebSection>
                        )}
                        
                        {investmentMemo && (
                            <WebSection title="Investment Memo">
                                <InvestmentMemoCanvas data={investmentMemo} isPrintable={true} />
                            </WebSection>
                        )}

                        {(founderDna || talentStrategy) && (
                            <WebSection title="Founder & Team Strategy">
                                {founderDna && <FounderDnaCanvas analysis={founderDna} founders={founders} isPrintable={true} />}
                                {talentStrategy && <IdealCoFounderCanvas data={talentStrategy} isPrintable={true} />}
                                {talentStrategy?.teamCapabilityAnalysis && <TeamCompositionCanvas data={talentStrategy} isPrintable={true} />}
                            </WebSection>
                        )}

                        {(problemStatement || customerPersona || empathyMap || research) && (
                            <WebSection title="Problem Space & Customer Insights">
                                {problemStatement && <ProblemStatementCanvas data={problemStatement} isPrintable={true} />}
                                {customerPersona && <CustomerPersonaCanvas data={customerPersona} isPrintable={true} />}
                                {empathyMap && <EmpathyMapCanvas data={empathyMap} isPrintable={true} />}
                                {(research?.marketAnalysis || financialPlan?.marketSize) && <MarketAnalysisCanvas researchData={research} financialData={financialPlan} isPrintable={true} />}
                            </WebSection>
                        )}
                        
                        {(selectedSolution || valueProposition || leanCanvas) && (
                            <WebSection title="Solution & Business Model">
                                {technologyScoutReport && <TechnologyScoutCanvas data={technologyScoutReport} isPrintable={true} />}
                                {solutionScoring && <SolutionScoringCanvas data={solutionScoring} allSolutions={allSolutions} isPrintable={true} />}
                                {selectedSolution && <SolutionSelectionCanvas data={selectedSolution} allSolutions={allCritiques} isPrintable={true} />}
                                {ipStrategy && <IpStrategyCanvas data={ipStrategy} isPrintable={true} />}
                                {valueProposition && <ValuePropositionCanvas data={valueProposition} isPrintable={true} />}
                                {leanCanvas && <LeanCanvas data={leanCanvas} isPrintable={true} />}
                            </WebSection>
                        )}
                        {storyboard && (
                            <WebSection title="Customer Journey Storyboard">
                                <StoryboardReportCanvas data={storyboard} isPrintable={true} />
                            </WebSection>
                        )}
                        
                        {strategy && (
                            <WebSection title="Strategic Advantages">
                                <StrategyCanvas data={strategy} isPrintable={true} />
                                {research?.competitiveLandscape && research.competitiveLandscape.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h4 className="text-2xl font-bold mb-4 text-gray-700">Initial Competitive Landscape</h4>
                                        <CompetitiveLandscapeCanvas data={research} isPrintable={true} />
                                    </div>
                                )}
                            </WebSection>
                        )}
                        
                        {goToMarket && (
                            <WebSection title="Go-to-Market Strategy">
                               <GoToMarketCanvas data={goToMarket} isPrintable={true} />
                            </WebSection>
                        )}

                        {riskAnalysis && (
                            <WebSection title="Risk Analysis & Mitigation">
                                <RiskAnalysisCanvas data={riskAnalysis} isPrintable={true} />
                                {research?.ethicalConsiderations && research.ethicalConsiderations.length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h4 className="text-2xl font-bold mb-4 text-gray-700">Initial Ethical Considerations</h4>
                                        <EthicalConsiderationsCanvas data={research} isPrintable={true} />
                                    </div>
                                )}
                            </WebSection>
                        )}
                        
                        {technicalBlueprint && (
                            <WebSection title="Operational & Technical Blueprint">
                                <TechnicalBlueprintCanvas data={technicalBlueprint} isPrintable={true} />
                            </WebSection>
                        )}
                        
                        {financialPlan && (
                            <WebSection title="Financial Plan & Projections">
                                <FinancialModelerCanvas data={financialPlan} isPrintable={true} />
                            </WebSection>
                        )}

                         {redTeam && (
                             <WebSection title="Red Team Analysis">
                                <RedTeamCanvas data={redTeam} isPrintable={true} />
                            </WebSection>
                        )}

                        {ethicsReport && (
                             <WebSection title="Ethics & Compliance Audit">
                                <EthicsCanvas data={ethicsReport} isPrintable={true} />
                            </WebSection>
                        )}

                        {successScore && (
                             <WebSection title="Venture Success Score">
                                <InnovationVennDiagram data={successScore} isPrintable={true} />
                                <div className="mt-8">
                                    <SuccessScoreCanvas data={successScore} isPrintable={true} />
                                </div>
                            </WebSection>
                        )}
                        
                        {research?.sources && research.sources.length > 0 && (
                            <WebSection title="References">
                                <ReferencesCanvas sources={research.sources} isPrintable={true} />
                            </WebSection>
                        )}
                    </main>
                </div>
            </div>
        );
    }
);

export default ShareableReport;