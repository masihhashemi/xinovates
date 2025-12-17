import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { FinancialPlanningOutput, ModelMode, StrategicDirective, CashFlowModelOutput, CashFlowAssumptions, CashFlowYear } from '../types';
import { runCashFlowModel } from '../services/geminiService';
import { XMarkIcon, SparklesIcon, DocumentArrowDownIcon, CheckIcon, TableCellsIcon } from './Icons';
import Spinner from './Spinner';

interface CashFlowModelModalProps {
    isOpen: boolean;
    onClose: () => void;
    baseFinancialPlan: FinancialPlanningOutput;
    modelMode: ModelMode;
    strategicDirective: StrategicDirective;
    onSave: (model: CashFlowModelOutput) => void;
}

const defaultAssumptions: CashFlowAssumptions = {
    forecastHorizon: 5,
    initialRevenue: 100000,
    revenueGrowthRate: [1.5, 1.2, 1.0, 0.8, 0.6], // 150%, 120%, etc.
    cogsPercentage: [0.3, 0.28, 0.26, 0.25, 0.25],
    opex: {
        researchAndDevelopment: [0.2, 0.18, 0.15, 0.12, 0.1],
        salesAndMarketing: [0.4, 0.35, 0.3, 0.25, 0.25],
        generalAndAdministrative: [0.15, 0.12, 0.1, 0.08, 0.08],
    },
    taxRate: 0.21,
    capexPercentage: [0.1, 0.08, 0.06, 0.05, 0.05],
    depreciationPercentage: [0.15, 0.15, 0.15, 0.15, 0.15],
    changeInNwcPercentage: 0.05,
    discountRate: 0.15,
    terminalValueMethod: 'Exit Multiple',
    terminalGrowthRate: 0.03,
    exitMultiple: 5,
};

const formatCurrency = (value: number, decimals = 0): string => {
    if (isNaN(value)) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}

const AssumptionInput: React.FC<{label: string, value: number, onChange: (val: number) => void, isPercent?: boolean}> = ({ label, value, onChange, isPercent = false }) => (
    <div>
        <label className="block text-xs text-gray-400 mb-1">{label}</label>
        <div className="relative">
            <input
                type="number"
                step="any"
                value={isPercent ? (value * 100).toFixed(1) : value}
                onChange={(e) => {
                    const num = parseFloat(e.target.value);
                    if (!isNaN(num)) {
                        onChange(isPercent ? num / 100 : num);
                    }
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white focus:ring-2 themed-focus-ring focus:outline-none"
            />
            {isPercent && <span className="absolute right-2 top-2 text-gray-400 text-sm">%</span>}
        </div>
    </div>
);

const CashFlowModelModal: React.FC<CashFlowModelModalProps> = ({ isOpen, onClose, baseFinancialPlan, modelMode, strategicDirective, onSave }) => {
    const [assumptions, setAssumptions] = useState<CashFlowAssumptions>(defaultAssumptions);
    const [modelOutput, setModelOutput] = useState<CashFlowModelOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && baseFinancialPlan.cashFlowModel) {
            setAssumptions(baseFinancialPlan.cashFlowModel.assumptions);
            setModelOutput(baseFinancialPlan.cashFlowModel);
        } else if (isOpen) {
             setAssumptions(defaultAssumptions);
             setModelOutput(null);
        }
    }, [isOpen, baseFinancialPlan]);

    const handleAssumptionChange = <T extends keyof CashFlowAssumptions>(field: T, value: CashFlowAssumptions[T]) => {
        setAssumptions(prev => ({ ...prev, [field]: value }));
    };
    
    const handleArrayAssumptionChange = (field: 'revenueGrowthRate' | 'cogsPercentage' | 'capexPercentage' | 'depreciationPercentage', index: number, value: number) => {
        const newArray = [...assumptions[field]];
        newArray[index] = value;
        handleAssumptionChange(field, newArray);
    };

    const handleOpexAssumptionChange = (field: keyof CashFlowAssumptions['opex'], index: number, value: number) => {
        const newOpex = { ...assumptions.opex };
        const newArray = [...newOpex[field]];
        newArray[index] = value;
        newOpex[field] = newArray;
        handleAssumptionChange('opex', newOpex);
    };

    const handleRunModel = useCallback(async (isSuggestion = false) => {
        setIsLoading(true);
        setError(null);
        try {
            const history = {
                problemStatement: "Venture Financial Modeling",
                solution: baseFinancialPlan.elevatorPitch,
                targetMarket: "Global"
            };
            const result = await runCashFlowModel(history, baseFinancialPlan, assumptions, modelMode, strategicDirective);
            if (isSuggestion) {
                setAssumptions(result.data.assumptions);
                setModelOutput(result.data); // Also update the model when suggesting
            } else {
                setModelOutput(result.data);
            }
        } catch (e) {
            console.error("Failed to run cash flow model:", e);
            setError(e instanceof Error ? e.message : "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [assumptions, baseFinancialPlan, modelMode, strategicDirective]);
    
    const handleExportXlsx = () => {
        if (!modelOutput) return;

        // 1. Inputs Sheet
        const inputsData = [
            ['Assumption', 'Value'],
            ['Forecast Horizon (Years)', modelOutput.assumptions.forecastHorizon],
            ['Initial Revenue', modelOutput.assumptions.initialRevenue],
            ['Tax Rate', modelOutput.assumptions.taxRate],
            ['Change in NWC (% of Revenue Growth)', modelOutput.assumptions.changeInNwcPercentage],
            ['Discount Rate (WACC)', modelOutput.assumptions.discountRate],
            ['Terminal Value Method', modelOutput.assumptions.terminalValueMethod],
            ['Terminal Growth Rate', modelOutput.assumptions.terminalValueMethod === 'Gordon Growth' ? modelOutput.assumptions.terminalGrowthRate : 'N/A'],
            ['Exit Multiple', modelOutput.assumptions.terminalValueMethod === 'Exit Multiple' ? modelOutput.assumptions.exitMultiple : 'N/A'],
            [],
            ['Yearly Assumptions', 'Y1', 'Y2', 'Y3', 'Y4', 'Y5'],
            ['Revenue Growth Rate', ...modelOutput.assumptions.revenueGrowthRate],
            ['COGS (% of Revenue)', ...modelOutput.assumptions.cogsPercentage],
            ['R&D (% of Revenue)', ...modelOutput.assumptions.opex.researchAndDevelopment],
            ['S&M (% of Revenue)', ...modelOutput.assumptions.opex.salesAndMarketing],
            ['G&A (% of Revenue)', ...modelOutput.assumptions.opex.generalAndAdministrative],
            ['CAPEX (% of Revenue)', ...modelOutput.assumptions.capexPercentage],
            ['Depreciation (% of CAPEX)', ...modelOutput.assumptions.depreciationPercentage],
        ];
        const inputs_ws = XLSX.utils.aoa_to_sheet(inputsData);

        // 2. Calculations Sheet with Formulas
        const calc_ws = XLSX.utils.aoa_to_sheet([["Metric", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"]]);
        const data = modelOutput.cashFlows;
        const rows = [
            "Revenue", "COGS", "Gross Profit", "R&D", "S&M", "G&A", "Total OPEX", "EBITDA", "Depreciation", "EBIT", "Taxes", "NOPAT",
            "Add: Depreciation", "Less: CAPEX", "Less: Change in NWC", "Free Cash Flow to Firm (FCFF)", "PV of FCFF"
        ];
        rows.forEach((row, i) => XLSX.utils.sheet_add_aoa(calc_ws, [[row]], { origin: `A${i + 2}` }));

        for (let i = 0; i < data.length; i++) {
            const col = String.fromCharCode(66 + i); // B, C, D...
            XLSX.utils.sheet_add_aoa(calc_ws, [
                [{ v: data[i].revenue, f: i === 0 ? "Inputs!B3" : `${String.fromCharCode(66+i-1)}2*(1+Inputs!${col}$12)`, t: 'n' }],
                [{ v: data[i].cogs, f: `${col}2*Inputs!${col}$13`, t: 'n' }],
                [{ v: data[i].grossProfit, f: `${col}2-${col}3`, t: 'n' }],
                [{ v: data[i].opex.researchAndDevelopment, f: `${col}2*Inputs!${col}$14`, t: 'n' }],
                [{ v: data[i].opex.salesAndMarketing, f: `${col}2*Inputs!${col}$15`, t: 'n' }],
                [{ v: data[i].opex.generalAndAdministrative, f: `${col}2*Inputs!${col}$16`, t: 'n' }],
                [{ v: data[i].opex.total, f: `SUM(${col}5:${col}7)`, t: 'n' }],
                [{ v: data[i].ebitda, f: `${col}4-${col}8`, t: 'n' }],
                [{ v: data[i].depreciation, f: `${col}10`, t: 'n' }],
                [{ v: data[i].ebit, f: `${col}9-${col}10`, t: 'n' }],
                [{ v: data[i].taxes, f: `MAX(0, ${col}11*Inputs!B4)`, t: 'n' }],
                [{ v: data[i].nopat, f: `${col}11-${col}12`, t: 'n' }],
                [{ v: data[i].depreciation, f: `${col}10`, t: 'n' }],
                [{ v: data[i].capex, f: `${col}2*Inputs!${col}$17`, t: 'n' }],
                [{ v: data[i].changeInNwc, f: i === 0 ? `(${col}2-Inputs!B3)*Inputs!B5` : `(${col}2-${String.fromCharCode(66+i-1)}2)*Inputs!B5`, t: 'n' }],
                [{ v: data[i].fcff, f: `${col}13+${col}14-${col}15-${col}16`, t: 'n' }],
                [{ v: data[i].fcff / Math.pow(1 + assumptions.discountRate, i + 1), f: `${col}17/(1+Inputs!B6)^${i+1}`, t: 'n' }]
            ], { origin: `${col}2` });
        }
        
        const valuationData = [
            [],
            ["Valuation Metrics"],
            ["Terminal Value", {v: modelOutput.terminalValue, f: `(F17*(1+Inputs!B8))/(Inputs!B6-Inputs!B8)`, t: 'n'}],
            ["PV of Terminal Value", {v: modelOutput.terminalValue / Math.pow(1 + assumptions.discountRate, 5), f: `B21/(1+Inputs!B6)^5`, t: 'n'}],
            ["Enterprise Value", {v: modelOutput.enterpriseValue, f: `SUM(B18:F18)+B22`, t: 'n'}],
            ["NPV", {v: modelOutput.npv, f: 'B23-Inputs!B3', t: 'n'}], // Simplified NPV for display
            ["IRR", {v: modelOutput.irr, f: `IRR(H2:M2)`, t: 'n'}],
        ];

        const irrRange = [-assumptions.initialRevenue, ...modelOutput.cashFlows.map(cf => cf.fcff)];
        XLSX.utils.sheet_add_aoa(calc_ws, [irrRange], { origin: 'H2'});

        XLSX.utils.sheet_add_aoa(calc_ws, valuationData, { origin: 'A19' });
        
        // 3. Dashboard Sheet
        const dashboard_ws = XLSX.utils.aoa_to_sheet([
            ['Xinovates Cash Flow Model: ' + baseFinancialPlan.selectedBrandName],
            [],
            ['Key Outputs'],
            ['Enterprise Value', modelOutput.enterpriseValue],
            ['Net Present Value (NPV)', modelOutput.npv],
            ['Internal Rate of Return (IRR)', modelOutput.irr],
        ]);
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, dashboard_ws, "Dashboard");
        XLSX.utils.book_append_sheet(wb, calc_ws, "Calculations");
        XLSX.utils.book_append_sheet(wb, inputs_ws, "Inputs");
        
        XLSX.writeFile(wb, `${baseFinancialPlan.selectedBrandName}_Cash_Flow_Model.xlsx`);
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-fade-in" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <TableCellsIcon className="w-6 h-6 text-blue-400"/>
                        <h2 className="text-xl font-bold text-white">Interactive Cash Flow Model</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><XMarkIcon className="w-8 h-8"/></button>
                </header>
                
                <div className="flex flex-grow overflow-hidden">
                    {/* Assumptions Panel */}
                    <aside className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto space-y-4">
                        <h3 className="font-semibold text-lg text-gray-200">Assumptions</h3>
                        <div className="space-y-3">
                            <AssumptionInput label="Initial Revenue" value={assumptions.initialRevenue} onChange={v => handleAssumptionChange('initialRevenue', v)} />
                            <AssumptionInput label="Discount Rate (WACC)" value={assumptions.discountRate} onChange={v => handleAssumptionChange('discountRate', v)} isPercent />
                            <AssumptionInput label="Tax Rate" value={assumptions.taxRate} onChange={v => handleAssumptionChange('taxRate', v)} isPercent />
                            
                            <div className="pt-2">
                                <label className="block text-xs text-gray-400 mb-1">Terminal Value</label>
                                <select value={assumptions.terminalValueMethod} onChange={e => handleAssumptionChange('terminalValueMethod', e.target.value as any)} className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-sm text-white focus:ring-2 themed-focus-ring focus:outline-none">
                                    <option>Exit Multiple</option>
                                    <option>Gordon Growth</option>
                                </select>
                            </div>
                            {assumptions.terminalValueMethod === 'Exit Multiple' ? (
                                <AssumptionInput label="Exit Multiple (x EBITDA)" value={assumptions.exitMultiple} onChange={v => handleAssumptionChange('exitMultiple', v)} />
                            ) : (
                                <AssumptionInput label="Terminal Growth Rate" value={assumptions.terminalGrowthRate} onChange={v => handleAssumptionChange('terminalGrowthRate', v)} isPercent />
                            )}
                            
                            {[...Array(assumptions.forecastHorizon)].map((_, i) => (
                                <div key={i} className="p-3 bg-gray-900/50 rounded-lg">
                                    <h4 className="font-semibold text-gray-300 mb-2">Year {i+1}</h4>
                                    <div className="space-y-2">
                                        <AssumptionInput label="Revenue Growth" value={assumptions.revenueGrowthRate[i]} onChange={v => handleArrayAssumptionChange('revenueGrowthRate', i, v)} isPercent/>
                                        <AssumptionInput label="COGS %" value={assumptions.cogsPercentage[i]} onChange={v => handleArrayAssumptionChange('cogsPercentage', i, v)} isPercent/>
                                        <AssumptionInput label="R&D %" value={assumptions.opex.researchAndDevelopment[i]} onChange={v => handleOpexAssumptionChange('researchAndDevelopment', i, v)} isPercent/>
                                        <AssumptionInput label="S&M %" value={assumptions.opex.salesAndMarketing[i]} onChange={v => handleOpexAssumptionChange('salesAndMarketing', i, v)} isPercent/>
                                        <AssumptionInput label="G&A %" value={assumptions.opex.generalAndAdministrative[i]} onChange={v => handleOpexAssumptionChange('generalAndAdministrative', i, v)} isPercent/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content Panel */}
                    <main className="w-2/3 p-6 overflow-y-auto bg-black/20">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg text-gray-200">Model Output</h3>
                            <div className="flex gap-2">
                                <button onClick={() => handleRunModel(true)} disabled={isLoading} className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50">
                                    {isLoading ? <Spinner/> : <SparklesIcon className="w-4 h-4"/>} AI Suggestions
                                </button>
                                <button onClick={() => handleRunModel(false)} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 text-sm primary-button text-white font-bold rounded-lg disabled:opacity-50">
                                    {isLoading ? <Spinner/> : <TableCellsIcon className="w-4 h-4"/>} Run Model
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-center my-4">{error}</p>}
                        
                        {!modelOutput && !isLoading && <p className="text-gray-500 text-center mt-12">Enter your assumptions and click "Run Model" to see the output.</p>}
                        
                        {isLoading && <div className="flex justify-center items-center h-full"><Spinner /></div>}

                        {modelOutput && (
                            <div className="animate-fade-in space-y-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">Enterprise Value</p>
                                        <p className="text-2xl font-bold text-green-400">{formatCurrency(modelOutput.enterpriseValue)}</p>
                                    </div>
                                    <div className="bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">NPV</p>
                                        <p className="text-2xl font-bold text-blue-400">{formatCurrency(modelOutput.npv)}</p>
                                    </div>
                                    <div className="bg-gray-900/50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-400">IRR</p>
                                        <p className="text-2xl font-bold text-purple-400">{(modelOutput.irr * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-900/50 text-xs text-gray-400 uppercase">
                                            <tr>
                                                <th className="p-2">Metric</th>
                                                {modelOutput.cashFlows.map(cf => <th key={cf.year} className="p-2 text-right">Year {cf.year}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-300">
                                            {[
                                                { label: 'Revenue', key: 'revenue', isBold: true, isCurrency: true },
                                                { label: 'COGS', key: 'cogs', isCurrency: true },
                                                { label: 'Gross Profit', key: 'grossProfit', isBold: true, isCurrency: true },
                                                { label: 'R&D', key: 'researchAndDevelopment', isOpex: true, isCurrency: true },
                                                { label: 'S&M', key: 'salesAndMarketing', isOpex: true, isCurrency: true },
                                                { label: 'G&A', key: 'generalAndAdministrative', isOpex: true, isCurrency: true },
                                                { label: 'Total OPEX', key: 'total', isOpex: true, isBold: true, isCurrency: true },
                                                { label: 'EBITDA', key: 'ebitda', isBold: true, isCurrency: true },
                                                { label: 'Depreciation', key: 'depreciation', isCurrency: true },
                                                { label: 'EBIT', key: 'ebit', isBold: true, isCurrency: true },
                                                { label: 'Taxes', key: 'taxes', isCurrency: true },
                                                { label: 'NOPAT', key: 'nopat', isBold: true, isCurrency: true },
                                                { label: 'FCFF', key: 'fcff', isBold: true, isCurrency: true, isHighlighted: true },
                                            ].map(row => (
                                                <tr key={row.label} className={`border-t border-gray-700/50 ${row.isBold ? 'font-semibold' : ''} ${row.isHighlighted ? 'bg-blue-500/10' : ''}`}>
                                                    <td className="p-2">{row.label}</td>
                                                    {modelOutput.cashFlows.map(cf => {
                                                        let value: number;
                                                        if ('isOpex' in row && row.isOpex) {
                                                            const opexKey = row.key as keyof typeof cf.opex;
                                                            value = cf.opex[opexKey];
                                                        } else {
                                                            const cfKey = row.key as keyof CashFlowYear;
                                                            value = cf[cfKey] as number;
                                                        }
                                                        return (
                                                            <td key={cf.year} className="p-2 text-right font-mono">
                                                                {formatCurrency(value)}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
                <footer className="p-4 border-t border-gray-700 flex-shrink-0 flex justify-end items-center gap-4">
                    <button onClick={handleExportXlsx} disabled={!modelOutput} className="flex items-center gap-2 px-4 py-2 text-sm bg-green-700 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50">
                        <DocumentArrowDownIcon className="w-5 h-5"/> Export XLSX
                    </button>
                    <button onClick={() => modelOutput && onSave(modelOutput)} disabled={!modelOutput} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                        <CheckIcon className="w-5 h-5"/> Save and Close
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CashFlowModelModal;