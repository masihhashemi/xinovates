
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AgentRole, ResearchOutput, LeanCanvasOutput, ValuePropositionCanvasOutput, StoryboardOutput, StoryboardPanel, FinancialPlanningOutput, ModelMode, CustomerPersonaOutput, EmpathyMapCanvasOutput, StrategyOutput, RiskAnalysisOutput, TechnicalArchitectOutput, GoToMarketOutput, GroundingSource, StrategicDirective, ProblemStatementOutput, IdeationOutput, AllCritiquesOutput, SolutionSelectionOutput, Critique, SolutionEnhancementOutput, ReportData, RedTeamOutput, EthicsOracleOutput, FounderDnaOutput, FounderInput, SuccessScoreOutput, FinancialProjectionYear, FinancialScenario, CashFlowModelOutput, CashFlowAssumptions, IpStrategyOutput, TechnologyResearchOutput, SolutionScoringOutput, TalentStrategyOutput, PitchDeckOutput, IdealCoFounderProfile, SuggestedFounderProfile, VentureAnalystOutput, FounderAnalysisProfile, InvestmentMemoOutput, MvpDefinition, ProblemFrame } from '../types';
import { IMAGE_GENERATION_TOKEN_COST } from "../constants";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- HELPER TYPES & FUNCTIONS ---

type Usage = { input: number; output: number; total: number };
type GeminiServiceResponse<T> = { data: T, usage: Usage };
type DeliverHistory = { problemStatement: string; solution: string; targetMarket: string; };

const parseCurrency = (value: string): number => {
    if (!value || typeof value !== 'string') return 0;
    const num = parseFloat(value.replace(/[^0-9.-]+/g,""));
    if (isNaN(num)) return 0;
    if (value.toUpperCase().includes('M')) return num * 1_000_000;
    if (value.toUpperCase().includes('K')) return num * 1_000;
    return num;
};

const formatCurrencyForPrompt = (value: number): string => {
    if (isNaN(value)) return 'N/A';
    if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
    return `$${Math.round(value)}`;
};

const getModel = (mode: ModelMode): string => {
    return mode === 'fast' ? 'gemini-2.5-flash' : 'gemini-3-pro-preview';
};


const getDirectiveInstruction = (directive: StrategicDirective): string => {
    switch (directive) {
        case 'TIME_TO_MARKET':
            return "\n\n**STRATEGIC DIRECTIVE: TIME TO MARKET.** Your primary focus is speed. All your outputs—ideas, critiques, plans, and strategies—must prioritize simplicity, rapid execution, and a fast path to a Minimum Viable Product (MVP). Scrutinize for complexity and potential delays.";
        case 'UNIQUE_VALUE_PROPOSITION':
            return "\n\n**STRATEGIC DIRECTIVE: UNIQUE VALUE PROPOSITION.** Your primary focus is innovation and defensibility. All your outputs must prioritize creating a strong, hard-to-copy competitive advantage. Favor novel ideas, technologies, and business models over simple, quick solutions.";
        case 'CAPITAL_EFFICIENCY':
            return "\n\n**STRATEGIC DIRECTIVE: CAPITAL EFFICIENCY.** Your primary focus is a lean, bootstrap-friendly approach. All your outputs must prioritize low upfront costs, minimal burn rate, and an early path to revenue. Avoid solutions that require large, long-term capital investments.";
        case 'BALANCED':
        default:
            return "\n\n**STRATEGIC DIRECTIVE: BALANCED APPROACH.** Your focus is to weigh all factors—innovation, market size, feasibility, and speed—equally. Produce a well-rounded and robust output that does not excessively prioritize one strategic goal over others.";
    }
};

const callGeminiWithSchema = async <T>(agentName: AgentRole | string, systemInstruction: string, userPrompt: string, responseSchema: any, modelMode: ModelMode, retries = 3, delayMs = 10000, temperatureOverride?: number, attemptedFallback = false): Promise<GeminiServiceResponse<T>> => {
    try {
        const config: any = {
            systemInstruction: systemInstruction,
            temperature: temperatureOverride ?? 0.7,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        };
        
        if (modelMode === 'fast') {
             config.thinkingConfig = { thinkingBudget: 0 };
        } else if (modelMode === 'creative' && temperatureOverride === undefined) {
             config.temperature = 1.0;
        }

        const modelName = getModel(modelMode);
        const response: GenerateContentResponse = await ai.models.generateContent({ model: modelName, contents: userPrompt, config });
        
        const usage: Usage = {
            input: response.usageMetadata?.promptTokenCount || 0,
            output: response.usageMetadata?.candidatesTokenCount || 0,
            total: response.usageMetadata?.totalTokenCount || 0
        };

        const jsonString = response.text.trim();
        return { data: JSON.parse(jsonString), usage };
    } catch (error: any) {
        const errorContent = ((error?.toString() || '') + JSON.stringify(error)).toLowerCase();
        const isRateLimitError = errorContent.includes("429") || errorContent.includes("503") || errorContent.includes("resource_exhausted") || errorContent.includes("quota");

        if (isRateLimitError) {
            // FALLBACK LOGIC: If we are not already using 'fast' mode, try switching to it.
            // 'fast' mode (Flash) typically has higher limits and is cheaper.
            if (modelMode !== 'fast' && !attemptedFallback) {
                console.warn(`Quota/Rate limit hit for ${agentName} on ${getModel(modelMode)}. Falling back to 'fast' model (gemini-2.5-flash).`);
                return callGeminiWithSchema(agentName, systemInstruction, userPrompt, responseSchema, 'fast', retries, delayMs, temperatureOverride, true);
            }

            if (retries > 0) {
                const isHardQuotaError = errorContent.includes('daily limit') || errorContent.includes('plan and billing');
                if (isHardQuotaError) {
                    console.error(`API call for ${agentName} failed due to a hard quota limit (e.g., daily limit). Not retrying.`, error);
                    throw new Error(`The ${agentName} agent failed due to a daily quota limit. Please check your API plan or try again tomorrow.`);
                }

                console.warn(`API call for ${agentName} failed (rate limit). Retrying in ${delayMs / 1000}s... (${retries} retries left)`);
                await delay(delayMs);
                return callGeminiWithSchema(agentName, systemInstruction, userPrompt, responseSchema, modelMode, retries - 1, delayMs * 2, temperatureOverride, attemptedFallback);
            }
        }
        
        console.error(`Gemini API call with schema for ${agentName} failed:`, error);
        throw new Error(`Failed to get a structured response from the ${agentName}.`);
    }
};

const generateImage = async (prompt: string, aspectRatio: '16:9' | '1:1' = '16:9', retries = 3, delayMs = 10000): Promise<{ imageB64: string, usage: Usage }> => {
    const usage: Usage = { input: 0, output: 0, total: IMAGE_GENERATION_TOKEN_COST };
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: aspectRatio },
        });

        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;

        if (imageBytes) {
            return { imageB64: imageBytes, usage };
        }
        
        console.warn(`Image generation returned no data for prompt: "${prompt}". This could be due to safety filters.`);
        return { imageB64: "", usage };
    } catch (error: any) {
        const errorContent = ((error?.toString() || '') + JSON.stringify(error)).toLowerCase();
        const isRateLimitError = errorContent.includes("429") || errorContent.includes("resource_exhausted") || errorContent.includes("quota");

        if (retries > 0 && isRateLimitError) {
            const isHardQuotaError = errorContent.includes('daily limit') || errorContent.includes('plan and billing');
            if (isHardQuotaError) {
                console.error(`Image generation for prompt "${prompt}" failed due to a hard quota limit. Not retrying.`, error);
                return { imageB64: "", usage }; // Fail gracefully
            }
            console.warn(`Image generation rate limit/quota hit for prompt "${prompt}". Retrying in ${delayMs / 1000}s...`);
            await delay(delayMs);
            return generateImage(prompt, aspectRatio, retries - 1, delayMs * 2);
        }
        console.error(`Image generation failed for prompt "${prompt}":`, error);
        return { imageB64: "", usage };
    }
};

// Helper for Nano Banana (gemini-2.5-flash-image) generation
// Note: This model returns images in the response parts, not via generateImages
const generateNanoBananaImage = async (prompt: string, retries = 3, delayMs = 5000): Promise<{ imageB64: string, usage: Usage }> => {
    const usage: Usage = { input: 0, output: 0, total: IMAGE_GENERATION_TOKEN_COST }; // Approximation
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt,
            // Do not set responseMimeType for nano banana when generating images
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return { imageB64: part.inlineData.data, usage };
                }
            }
        }
        
        console.warn(`Nano Banana returned no image data for prompt: "${prompt}".`);
        return { imageB64: "", usage };

    } catch (error: any) {
        const errorContent = ((error?.toString() || '') + JSON.stringify(error)).toLowerCase();
        const isRateLimitError = errorContent.includes("429") || errorContent.includes("resource_exhausted") || errorContent.includes("quota");

        if (retries > 0 && isRateLimitError) {
             console.warn(`Nano Banana rate limit for prompt "${prompt}". Retrying in ${delayMs / 1000}s...`);
             await delay(delayMs);
             return generateNanoBananaImage(prompt, retries - 1, delayMs * 2);
        }
        console.error(`Nano Banana image generation failed for prompt "${prompt}":`, error);
        return { imageB64: "", usage };
    }
};

export const emptyUsage = (): Usage => ({ input: 0, output: 0, total: 0 });
const sumUsage = (...usages: Usage[]): Usage => {
    return usages.reduce((acc, current) => ({
        input: acc.input + current.input,
        output: acc.output + current.output,
        total: acc.total + current.total,
    }), emptyUsage());
};

const extractSources = (response: GenerateContentResponse): GroundingSource[] => {
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    return groundingChunks?.map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }))
        .filter((source: any, index: number, self: any[]) => source.uri && index === self.findIndex((s: any) => s.uri === source.uri)) || [];
};

// --- Reusable Schemas ---

const problemStatementSchema = {
    type: Type.OBJECT, properties: {
        problemStatement: { type: Type.STRING, description: "The 'How Might We...' problem statement." },
        context: { type: Type.STRING, description: "Briefly explain the background of the problem." },
        userImpact: { type: Type.STRING, description: "Describe how this problem negatively affects a potential user." },
        keyInsights: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List 2-3 key insights that connect the solution to this problem." },
    }, required: ["problemStatement", "context", "userImpact", "keyInsights"],
};

const cashFlowYearSchema = {
    type: Type.OBJECT,
    properties: {
        year: { type: Type.INTEGER },
        revenue: { type: Type.NUMBER },
        cogs: { type: Type.NUMBER },
        grossProfit: { type: Type.NUMBER },
        opex: {
            type: Type.OBJECT, properties: {
                researchAndDevelopment: { type: Type.NUMBER },
                salesAndMarketing: { type: Type.NUMBER },
                generalAndAdministrative: { type: Type.NUMBER },
                total: { type: Type.NUMBER }
            }, required: ["researchAndDevelopment", "salesAndMarketing", "generalAndAdministrative", "total"]
        },
        ebitda: { type: Type.NUMBER },
        depreciation: { type: Type.NUMBER },
        ebit: { type: Type.NUMBER },
        taxes: { type: Type.NUMBER },
        nopat: { type: Type.NUMBER },
        capex: { type: Type.NUMBER },
        changeInNwc: { type: Type.NUMBER },
        fcff: { type: Type.NUMBER }
    },
    required: ["year", "revenue", "cogs", "grossProfit", "opex", "ebitda", "depreciation", "ebit", "taxes", "nopat", "capex", "changeInNwc", "fcff"]
};

const cashFlowAssumptionsSchema = {
     type: Type.OBJECT, properties: {
        forecastHorizon: { type: Type.INTEGER },
        initialRevenue: { type: Type.NUMBER },
        revenueGrowthRate: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        cogsPercentage: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        opex: {
            type: Type.OBJECT, properties: {
                researchAndDevelopment: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                salesAndMarketing: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                generalAndAdministrative: { type: Type.ARRAY, items: { type: Type.NUMBER } }
            }, required: ["researchAndDevelopment", "salesAndMarketing", "generalAndAdministrative"]
        },
        taxRate: { type: Type.NUMBER },
        capexPercentage: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        depreciationPercentage: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        changeInNwcPercentage: { type: Type.NUMBER },
        discountRate: { type: Type.NUMBER },
        terminalValueMethod: { type: Type.STRING, enum: ['Gordon Growth', 'Exit Multiple'] },
        terminalGrowthRate: { type: Type.NUMBER },
        exitMultiple: { type: Type.NUMBER }
    }, required: ["forecastHorizon", "initialRevenue", "revenueGrowthRate", "cogsPercentage", "opex", "taxRate", "capexPercentage", "depreciationPercentage", "changeInNwcPercentage", "discountRate", "terminalValueMethod", "terminalGrowthRate", "exitMultiple"]
};

const cashFlowModelSchema = {
    type: Type.OBJECT,
    properties: {
        assumptions: cashFlowAssumptionsSchema,
        cashFlows: { type: Type.ARRAY, items: cashFlowYearSchema },
        terminalValue: { type: Type.NUMBER },
        enterpriseValue: { type: Type.NUMBER },
        npv: { type: Type.NUMBER },
        irr: { type: Type.NUMBER }
    },
    required: ["assumptions", "cashFlows", "terminalValue", "enterpriseValue", "npv", "irr"]
};


// --- FOUNDER DNA ---
export const runFounderDna = (founders: FounderInput[], modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<FounderDnaOutput>> => {
    const systemInstruction = `You are the ${AgentRole.FOUNDER_DNA} agent — an AI profiler specializing in startup founding teams.
You will receive a list of founders, each with a name and a description of their background, style, and motivation.
Your task is to perform a holistic analysis of the team:
1.  **Individual Profiles**: For EACH founder, provide their name, a 'Founder Type' archetype (e.g., "Visionary Strategist," "Structured Builder"), and a paragraph on their 'Strengths & Style'. The name must match the input name exactly.
2.  **Team Archetype**: Give the entire team a collective archetype name (e.g., "The Builder-Hustler Duo," "The Balanced Trio").
3.  **Team Strengths**: List the combined strengths and synergies of the team.
4.  **Potential Gaps**: Identify potential weaknesses or missing skill sets in the team composition.
5.  **Collaboration Style**: Describe the likely dynamic and how the team will work together.
Your analysis should be concise, strategic, and constructive, aiming to provide self-awareness for the founding team.` + getDirectiveInstruction(strategicDirective);

    // Update: Construct prompt using both Hard Skills (Description) and Soft Skills (Analysis Profile)
    const userPrompt = `Analyze the following founding team:\n\n` + founders.map(f => {
        let profileText = `Founder: ${f.name}\n`;
        // Hard Skills
        profileText += `Professional Background (Hard Skills): "${f.description}"\n`;
        
        // Soft Skills / Personality Analysis
        if (f.analysisProfile) {
            profileText += `Personality, Traits & Soft Skills: "${f.analysisProfile.summary}"\n`;
            if (f.analysisProfile.top_strengths && f.analysisProfile.top_strengths.length > 0) {
                profileText += `Top Strengths: ${f.analysisProfile.top_strengths.join(', ')}\n`;
            }
            if (f.analysisProfile.watchouts && f.analysisProfile.watchouts.length > 0) {
                profileText += `Potential Risks/Watchouts: ${f.analysisProfile.watchouts.join(', ')}\n`;
            }
        }
        return profileText;
    }).join('\n\n');

    const schema = {
        type: Type.OBJECT,
        properties: {
            teamArchetype: { type: Type.STRING, description: "A collective archetype name for the team." },
            teamStrengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of combined team strengths." },
            potentialGaps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of potential team weaknesses or gaps." },
            collaborationStyle: { type: Type.STRING, description: "Description of the team's likely collaboration dynamic." },
            founderProfiles: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING, description: "The founder's name, matching the input name exactly." },
                        founderType: { type: Type.STRING, description: "A short label for the founder's archetype." },
                        strengthsAndStyle: { type: Type.STRING, description: "A paragraph on their individual strengths and style." }
                    },
                    required: ["name", "founderType", "strengthsAndStyle"]
                }
            }
        },
        required: ["teamArchetype", "teamStrengths", "potentialGaps", "collaborationStyle", "founderProfiles"]
    };

    return callGeminiWithSchema(AgentRole.FOUNDER_DNA, systemInstruction, userPrompt, schema, modelMode);
};

export const runCvAnalysis = (founderName: string, cvText: string, modelMode: ModelMode): Promise<GeminiServiceResponse<{ summary: string }>> => {
    const systemInstruction = `You are an expert HR analyst and executive recruiter. Your task is to read a founder's CV/resume and write a concise, professional summary of their background, skills, and accomplishments. This summary will be used as their bio. The summary should be in the third person, well-written, and approximately 100-150 words long. Focus on the most impressive and relevant aspects of their career for a startup context.`;

    const userPrompt = `Please generate a summary for the following founder based on their CV.\n\nFounder's Name: "${founderName}"\n\nCV Text:\n--- START CV ---\n${cvText}\n--- END CV ---`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "The concise, professional summary of the founder's background." }
        },
        required: ["summary"]
    };

    return callGeminiWithSchema<{ summary: string }>("CV Analyzer", systemInstruction, userPrompt, schema, modelMode);
};


// --- DIAMOND 1: DISCOVER & DEFINE ---

export const runMarketFitAnalysis = (solutionDescription: string, ideaArea: string, targetMarket: string, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<{ challenges: ProblemStatementOutput[] }>> => {
    const systemInstruction = `You are a ${AgentRole.MARKET_FIT_ANALYST}, an expert at identifying market opportunities for new technologies and solutions. You will receive a description of a solution. Your task is to brainstorm and identify the top 3 most promising, distinct real-world problems that this solution could solve.
For each problem, you must:
1.  Frame it as an actionable 'How Might We...' statement.
2.  Provide context for the problem.
3.  Describe the impact on the user.
4.  List key insights that connect the solution to this problem.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Solution Description: "${solutionDescription}"
Area of Innovation: "${ideaArea}"
Target Market: "${targetMarket}"

Based on this, generate the top 3 problem statements this solution could address.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            challenges: {
                type: Type.ARRAY,
                items: problemStatementSchema
            }
        },
        required: ["challenges"]
    };
    return callGeminiWithSchema(AgentRole.MARKET_FIT_ANALYST, systemInstruction, userPrompt, schema, modelMode);
};

export const runChallengeGeneration = async (targetMarket: string, modelMode: ModelMode): Promise<GeminiServiceResponse<{ challenges: string[] }>> => {
    const systemInstruction = `You are a Strategic Innovation Scout acting as a market trend analyst. Your task is to identify 5 high-priority, high-impact innovation challenges currently relevant to the specified target market.
    Focus on urgent societal needs, emerging technological opportunities, or underserved market gaps. The challenges should be framed as concise, inspiring problem statements (1-2 sentences each).`;
    
    const userPrompt = `Target Market: "${targetMarket}"
    
    Generate 5 distinct, high-priority innovation challenges for this market.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            challenges: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "A list of 5 innovation challenges."
            }
        },
        required: ["challenges"]
    };

    // We can use a faster model like Flash for this quick generation task
    return callGeminiWithSchema("Challenge Generator", systemInstruction, userPrompt, schema, modelMode);
};

export const runProblemResearch = async (challenge: string, ideaArea: string, targetMarketLabel: string, modelMode: ModelMode, strategicDirective: StrategicDirective, userContext: string | null): Promise<GeminiServiceResponse<ResearchOutput>> => {
    const commonSystemInstruction = `You are the ${AgentRole.PROBLEM_RESEARCH} agent. Your focus is to conduct deep research into the PROBLEM SPACE of the user's challenge. Use Google Search to gather comprehensive data.` + getDirectiveInstruction(strategicDirective);
    
    // --- Phase 1: Broad Initial Search ---
    let researchUserPrompt = `Create a detailed research report on the problem space for the innovation challenge: "${challenge}".
This challenge is situated within the broader area of "${ideaArea}".
Your report MUST focus on the initial target market: **${targetMarketLabel}**. All analysis (market size, competitors, trends, etc.) should be specific to this region.`;

    if (userContext) {
        researchUserPrompt += `\n\n**IMPORTANT USER-PROVIDED CONTEXT:**
You MUST treat the following text as the primary source of truth. Web searches should be used to supplement this information.
--- START USER CONTEXT ---
${userContext}
--- END USER CONTEXT ---`;
    }

    researchUserPrompt += `\n\nAnalyze: Problem Summary, Target Audience (Demographics/Needs), Market Analysis (Size/Growth), Competitive Landscape (2-3 competitors with strengths/weaknesses), Technological Analysis, Trends/Opportunities, and Ethical Considerations.`;

    const makeRequest = async (prompt: string, retries = 3, delayMs = 10000): Promise<GenerateContentResponse> => {
        const agentName = `${AgentRole.PROBLEM_RESEARCH} (Web Search)`;
        const modelName = getModel(modelMode);
        try {
            return await ai.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    systemInstruction: commonSystemInstruction,
                    temperature: 0.2,
                    tools: [{ googleSearch: {} }],
                },
            });
        } catch (e: any) {
            // ... (error handling logic same as before) ...
            const errorContent = ((e?.toString() || '') + JSON.stringify(e)).toLowerCase();
            const isRateLimitError = errorContent.includes("429") || errorContent.includes("503") || errorContent.includes("resource_exhausted") || errorContent.includes("quota");

            if (retries > 0 && isRateLimitError) {
                console.warn(`API call for ${agentName} failed (rate limit). Retrying...`);
                await delay(delayMs);
                return makeRequest(prompt, retries - 1, delayMs * 2);
            }
            throw e;
        }
    };
    
    // 1. Initial Broad Search
    const initialResponse = await makeRequest(researchUserPrompt);
    let aggregatedText = initialResponse.text?.trim() || "";
    let aggregatedSources = extractSources(initialResponse);
    let totalUsage = {
        input: initialResponse.usageMetadata?.promptTokenCount || 0,
        output: initialResponse.usageMetadata?.candidatesTokenCount || 0,
        total: initialResponse.usageMetadata?.totalTokenCount || 0
    };

    // 2. Deep Research Loop (Gap Analysis & Follow-up) - Only for Quality/Creative modes
    if (modelMode !== 'fast' && aggregatedText) {
        try {
            // A. Gap Analysis
            const gapSystemInstruction = "You are a Research Director. Analyze the provided research report. Identify 3 critical gaps, vague areas, or missing data points that need deeper investigation to make this report truly comprehensive. Return a JSON array of 3 specific Google Search queries.";
            const gapUserPrompt = `Current Research Report:\n${aggregatedText.substring(0, 10000)}\n\nGenerate 3 specific follow-up search queries to fill gaps.`;
            const gapSchema = { type: Type.OBJECT, properties: { queries: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["queries"] };
            
            const gapResponse = await callGeminiWithSchema<{ queries: string[] }>("Gap Analyst", gapSystemInstruction, gapUserPrompt, gapSchema, "fast"); // Use fast model for logic
            totalUsage = sumUsage(totalUsage, gapResponse.usage);

            // B. Parallel Deep Dives
            const deepDivePromises = gapResponse.data.queries.map(q => makeRequest(`Deep dive search for: ${q}. Focus on specific data, statistics, and examples.`, 2, 5000));
            const deepDiveResults = await Promise.allSettled(deepDivePromises);

            let deepDiveContext = "";
            for (const res of deepDiveResults) {
                if (res.status === 'fulfilled' && res.value.text) {
                    deepDiveContext += `\n\n--- Additional Findings ---\n${res.value.text}`;
                    aggregatedSources = [...aggregatedSources, ...extractSources(res.value)];
                    totalUsage.input += res.value.usageMetadata?.promptTokenCount || 0;
                    totalUsage.output += res.value.usageMetadata?.candidatesTokenCount || 0;
                    totalUsage.total += res.value.usageMetadata?.totalTokenCount || 0;
                }
            }

            // C. Synthesis
            if (deepDiveContext) {
                const synthesizerSystemInstruction = "You are the Lead Researcher. Combine the 'Initial Research' and 'Deep Dive Findings' into one cohesive, masterful Deep Research Report. Ensure all original sections are preserved and enriched with new data. Do NOT output JSON, just the structured text.";
                const synthesizerPrompt = `Initial Research:\n${aggregatedText}\n\nDeep Dive Findings:\n${deepDiveContext}\n\nSynthesize the final report.`;
                
                // Using standard generateContent (no tools, just text processing)
                const synthResponse = await ai.models.generateContent({
                    model: getModel(modelMode),
                    contents: synthesizerPrompt,
                    config: { systemInstruction: synthesizerSystemInstruction }
                });
                
                if (synthResponse.text) {
                    aggregatedText = synthResponse.text;
                    totalUsage.input += synthResponse.usageMetadata?.promptTokenCount || 0;
                    totalUsage.output += synthResponse.usageMetadata?.candidatesTokenCount || 0;
                    totalUsage.total += synthResponse.usageMetadata?.totalTokenCount || 0;
                }
            }
        } catch (e) {
            console.warn("Deep research loop failed, falling back to initial research.", e);
        }
    }

    if (!aggregatedText) {
        throw new Error("Failed to get a grounded response from the Research agent.");
    }

    // --- Phase 3: Parsing ---
    const parserSystemInstruction = `You are a data parsing agent. Your task is to accurately parse the content of the research report into a structured JSON object based on the schema.`;
    const parserUserPrompt = `Please parse the content of the research report below:\n\n${aggregatedText}`;
    const researchSchema = {
        type: Type.OBJECT,
        properties: {
            problemSummary: { type: Type.STRING, description: "A concise overview of the core problem." },
            targetAudience: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, demographics: { type: Type.ARRAY, items: { type: Type.STRING } }, needs: { type: Type.ARRAY, items: { type: Type.STRING } }, }, required: ["description", "demographics", "needs"] },
            marketAnalysis: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, marketSize: { type: Type.STRING }, growthRate: { type: Type.STRING }, keySegments: { type: Type.ARRAY, items: { type: Type.STRING } }, }, required: ["summary", "marketSize", "growthRate", "keySegments"] },
            competitiveLandscape: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        description: { type: Type.STRING },
                        founders: { type: Type.STRING, description: "Key founders of the company. State 'Not found' if unavailable." },
                        foundedYear: { type: Type.INTEGER },
                        funding: { type: Type.STRING, description: "Last known funding stage and amount. State 'Not found' if unavailable." },
                        keyProduct: { type: Type.STRING },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["name", "description", "strengths", "weaknesses"]
                }
            },
            technologicalAnalysis: { type: Type.OBJECT, properties: { assessment: { type: Type.STRING }, requiredTechnologies: { type: Type.ARRAY, items: { type: Type.STRING } }, potentialChallenges: { type: Type.ARRAY, items: { type: Type.STRING } }, }, required: ["assessment", "requiredTechnologies", "potentialChallenges"] },
            trendsAndOpportunities: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { trend: { type: Type.STRING }, implication: { type: Type.STRING }, opportunity: { type: Type.STRING } }, required: ["trend", "implication", "opportunity"] } },
            ethicalConsiderations: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { aspect: { type: Type.STRING }, details: { type: Type.STRING }, mitigation: { type: Type.STRING } }, required: ["aspect", "details", "mitigation"] } }
        },
        required: ["problemSummary", "targetAudience", "marketAnalysis", "competitiveLandscape", "technologicalAnalysis", "trendsAndOpportunities", "ethicalConsiderations"]
    };

    // Use 'fast' mode for parsing to save tokens and avoid quota limits on Pro model.
    const parsedResponse = await callGeminiWithSchema<ResearchOutput>(`${AgentRole.PROBLEM_RESEARCH} (Parser)`, parserSystemInstruction, parserUserPrompt, researchSchema, 'fast');
    
    // Dedup sources
    const uniqueSources = aggregatedSources.filter((source, index, self) => 
        index === self.findIndex((s) => s.uri === source.uri)
    );

    return {
        data: { ...parsedResponse.data, sources: uniqueSources },
        usage: sumUsage(totalUsage, parsedResponse.usage)
    };
};

export const runProblemFraming = async (challenge: string, research: ResearchOutput, modelMode: ModelMode): Promise<GeminiServiceResponse<{ problemFrames: ProblemFrame[] }>> => {
    const systemInstruction = `You are a Strategic Problem Framer and Venture Analyst. The user has provided a broad innovation challenge, and we have conducted initial research.
Your task is to identify 3 DISTINCT "Problem Frames" or "Root Causes" within this broader challenge. Each frame should represent a specific angle or focus area for solving the problem.

CRITICAL REQUIREMENT: For every suggested frame, you must provide an "Evidence" anchor. You MUST cite a specific finding, statistic, or trend from the provided Research Summary to back up why this problem is real and urgent. Do not hallucinate; quote the research.

For EACH frame, you must also EVALUATE it using the R.I.C.E. framework (modified for problem validation):
1. **Reach (1-10)**: How many people are affected? (Based on Market Size research)
2. **Impact (1-10)**: How bad is the pain? (Based on User Pain points)
3. **Confidence (1-10)**: How strong is the evidence? (Based on the 'Evidence' field)
4. **Feasibility (1-10)**: How easy is it to solve with current tech? (High score = Easier/More Feasible).

Finally, assign a 'Strategic Label' to categorize the opportunity (e.g., "Quick Win", "High Risk / High Reward", "Enterprise Play", "Mass Market").`;

    const userPrompt = `Broader Challenge: "${challenge}"

Research Findings Summary:
- Problem Summary: ${research.problemSummary}
- Key Trends: ${research.trendsAndOpportunities.map(t => t.trend).join(', ')}
- Target Audience Needs: ${research.targetAudience.needs.join(', ')}
- Market Data: ${JSON.stringify(research.marketAnalysis)}

Based on this, generate 3 distinct problem frames with R.I.C.E scores and evidence citations.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            problemFrames: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        coreProblem: { type: Type.STRING, description: "A short, catchy title for this problem angle." },
                        rootCause: { type: Type.STRING, description: "The underlying reason or focus area." },
                        targetSegment: { type: Type.STRING, description: "Who is most affected by this specific angle?" },
                        rationale: { type: Type.STRING, description: "Why is this a high-potential area to solve?" },
                        evidence: { type: Type.STRING, description: "Specific data point or finding from the research that proves this problem exists." },
                        validationScores: {
                            type: Type.OBJECT,
                            properties: {
                                reach: { type: Type.NUMBER, description: "Score 1-10" },
                                impact: { type: Type.NUMBER, description: "Score 1-10" },
                                confidence: { type: Type.NUMBER, description: "Score 1-10" },
                                feasibility: { type: Type.NUMBER, description: "Score 1-10 (High = Easy)" }
                            },
                            required: ["reach", "impact", "confidence", "feasibility"]
                        },
                        strategicLabel: { type: Type.STRING, description: "Short category tag, e.g. 'Moonshot'" }
                    },
                    required: ["id", "coreProblem", "rootCause", "targetSegment", "rationale", "evidence", "validationScores", "strategicLabel"]
                }
            }
        },
        required: ["problemFrames"]
    };

    // Use temperature 0.0 for deterministic, evidence-based results
    return callGeminiWithSchema("Problem Framer", systemInstruction, userPrompt, schema, modelMode, 3, 10000, 0.0);
};

export const runCustomerPersona = async (challenge: string, research: ResearchOutput, targetMarketLabel: string, modelMode: ModelMode, strategicDirective: StrategicDirective, problemFrame?: ProblemFrame | null): Promise<GeminiServiceResponse<CustomerPersonaOutput>> => {
    const systemInstruction = `You are the ${AgentRole.CUSTOMER_PERSONA} agent. Based on the initial challenge and research, create a single, detailed customer persona representing the user most affected by the problem. The avatar prompt must be a safe-for-work, detailed description for a headshot photograph. The prompt should be concise and focus on creating a simple, photorealistic portrait. Avoid complex scenes or potentially sensitive terms.` + getDirectiveInstruction(strategicDirective);
    
    let userPrompt = `Challenge: "${challenge}"\n\nTarget Market: **${targetMarketLabel}**\n\nResearch Summary: ${JSON.stringify(research, null, 2)}`;
    
    if (problemFrame) {
        userPrompt += `\n\n**CRITICAL FOCUS:** The user has chosen to focus specifically on this aspect of the problem:
        - Core Problem: ${problemFrame.coreProblem}
        - Root Cause: ${problemFrame.rootCause}
        - Target Segment: ${problemFrame.targetSegment}
        
        Ensure the persona you generate is DIRECTLY related to this specific problem frame.`;
    }

    userPrompt += `\n\nCreate the detailed customer persona, ensuring they are representative of the target market.`;
    
    const schema = {
        type: Type.OBJECT, properties: {
            name: { type: Type.STRING }, age: { type: Type.INTEGER }, occupation: { type: Type.STRING },
            bio: { type: Type.STRING, description: "A short bio." },
            goals: { type: Type.ARRAY, items: { type: Type.STRING } },
            frustrations: { type: Type.ARRAY, items: { type: Type.STRING } },
            avatarPrompt: { type: Type.STRING, description: "SFW, simple, and concise prompt for a photorealistic headshot. E.g., 'Photorealistic headshot of a 32-year-old female architect, smiling, studio lighting'." },
        }, required: ["name", "age", "occupation", "bio", "goals", "frustrations", "avatarPrompt"],
    };
    const personaStructureResponse = await callGeminiWithSchema<Omit<CustomerPersonaOutput, 'avatarB64'>>(AgentRole.CUSTOMER_PERSONA, systemInstruction, userPrompt, schema, modelMode);
    const { imageB64, usage: imageUsage } = await generateImage(personaStructureResponse.data.avatarPrompt, '1:1');
    
    return {
        data: { ...personaStructureResponse.data, avatarB64: imageB64 },
        usage: sumUsage(personaStructureResponse.usage, imageUsage)
    };
};

export const runEmpathyMap = (challenge: string, research: ResearchOutput, persona: CustomerPersonaOutput, modelMode: ModelMode, strategicDirective: StrategicDirective, problemFrame?: ProblemFrame | null): Promise<GeminiServiceResponse<EmpathyMapCanvasOutput>> => {
    const systemInstruction = `You are the ${AgentRole.EMPATHY_MAP} agent. Based on the persona and research, create a detailed Empathy Map, filling out what the user Says, Thinks, Does, and Feels about the problem space, and summarize their Pains and Gains.` + getDirectiveInstruction(strategicDirective);
    
    let userPrompt = `Persona: ${JSON.stringify(persona, null, 2)}\n\nResearch: ${JSON.stringify(research, null, 2)}`;
    
    if (problemFrame) {
        userPrompt += `\n\n**Context:** We are focusing on the specific problem of "${problemFrame.coreProblem}" (Root cause: ${problemFrame.rootCause}). Ensure the empathy map reflects feelings towards THIS specific issue.`;
    }

    userPrompt += `\n\nPopulate the Empathy Map with 2-4 points per section.`;
    
    const listProp = { type: Type.ARRAY, items: { type: Type.STRING } };
    const schema = {
        type: Type.OBJECT, properties: {
            says: listProp, thinks: listProp, does: listProp, feels: listProp, pains: listProp, gains: listProp
        }, required: ["says", "thinks", "does", "feels", "pains", "gains"],
    };
    return callGeminiWithSchema(AgentRole.EMPATHY_MAP, systemInstruction, userPrompt, schema, modelMode);
};

export const runProblemSynthesizer = (challenge: string, research: ResearchOutput, persona: CustomerPersonaOutput, empathyMap: EmpathyMapCanvasOutput, modelMode: ModelMode, strategicDirective: StrategicDirective, problemFrame?: ProblemFrame | null): Promise<GeminiServiceResponse<ProblemStatementOutput>> => {
    const systemInstruction = `You are the ${AgentRole.PROBLEM_SYNTHESIZER} agent. Your task is to analyze all the discovery research and DEFINE a single, clear, and actionable problem statement. This statement MUST be in the 'How Might We...' format. Also provide context, user impact, and key insights.` + getDirectiveInstruction(strategicDirective);
    
    let userPrompt = `Synthesize the following into a problem statement.\n\nChallenge: "${challenge}"\n\nResearch: ${JSON.stringify(research, null, 2)}\n\nPersona: ${JSON.stringify(persona, null, 2)}\n\nEmpathy Map: ${JSON.stringify(empathyMap, null, 2)}`;
    
    if (problemFrame) {
        userPrompt += `\n\n**CRITICAL DIRECTIVE:** The user has explicitly chosen to frame the problem around: "${problemFrame.coreProblem}". 
        - Root Cause: ${problemFrame.rootCause}
        - Target Segment: ${problemFrame.targetSegment}
        
        Your 'How Might We' statement MUST be tightly focused on this chosen frame. Do not drift back to the generic challenge.`;
    }

    userPrompt += `\n\nNow, define the core problem.`;
    
    return callGeminiWithSchema(AgentRole.PROBLEM_SYNTHESIZER, systemInstruction, userPrompt, problemStatementSchema, modelMode);
};


// --- DIAMOND 2: DEVELOP ---

export const runTechnologyScout = async (problemStatement: ProblemStatementOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<TechnologyResearchOutput>> => {
    const systemInstruction = `You are the ${AgentRole.TECHNOLOGY_SCOUT}, a strategic technology intelligence analyst. Your task is to research the SOLUTION DOMAIN for the given problem statement. Use Google Search to find relevant technologies, patents, experts, and existing products. Your output must be a structured text report with citations.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Create a strategic technology intelligence report for the solution domain of the problem: "${problemStatement.problemStatement}".
Your report MUST include the following distinct sections:
1.  **Summary**: An overview of the technology landscape.
2.  **Key Technologies**: For 2-3 key technologies, provide: name, description, pros, cons, an estimated Technology Readiness Level (TRL) from 1 (basic principles) to 9 (proven in operational environment), and an Implementation Complexity (Low, Medium, High).
3.  **Emerging Trends**: List 2-3 relevant emerging trends.
4.  **Existing Solution Patterns**: Describe 1-2 common solution patterns.
5.  **Prior Art & Patent Landscape**: Identify 2-3 relevant existing patents or patent applications. For each, provide its patent ID, title, a brief summary, and a link to view it (e.g., Google Patents).
6.  **Leading Experts & Research Hubs**: Identify 1-2 leading academics, researchers, or university labs in this field. For each, provide their name, affiliation, specialization, and a link to their profile or lab page.
Cite your sources for all sections using markers like [1], [2], etc.`;

    const makeRequest = async (retries = 3, delayMs = 10000): Promise<GenerateContentResponse> => {
        const agentName = `${AgentRole.TECHNOLOGY_SCOUT} (Web Search)`;
        const modelName = getModel(modelMode);
        try {
            return await ai.models.generateContent({
                model: modelName, contents: userPrompt,
                config: { systemInstruction, temperature: 0.2, tools: [{ googleSearch: {} }] },
            });
        } catch (e) {
            console.error(`${agentName} failed during web search:`, e);
            throw new Error(`The ${agentName} agent failed during the web search phase.`);
        }
    };
    
    const researchResponse = await makeRequest();
    const researchText = researchResponse.text.trim();
    const groundingChunks = researchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks?.map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }))
        .filter((source: any, index: number, self: any[]) => source.uri && index === self.findIndex((s: any) => s.uri === source.uri)) || [];

    if (!researchText) throw new Error("Failed to get a grounded response from the Technology Scout.");
    
    const groundingUsage: Usage = {
        input: researchResponse.usageMetadata?.promptTokenCount || 0,
        output: researchResponse.usageMetadata?.candidatesTokenCount || 0,
        total: researchResponse.usageMetadata?.totalTokenCount || 0
    };

    const parserSystemInstruction = `You are a data parsing agent. Your task is to accurately parse the content of the provided technology report into a structured JSON object based on the schema.`;
    const parserUserPrompt = `Please parse the content of the technology report below:\n\n${researchText}`;
    
    const patentDetailSchema = {
        type: Type.OBJECT, properties: {
            patentId: { type: Type.STRING }, title: { type: Type.STRING },
            summary: { type: Type.STRING }, link: { type: Type.STRING }
        }, required: ["patentId", "title", "summary", "link"]
    };

    const expertDetailSchema = {
        type: Type.OBJECT, properties: {
            name: { type: Type.STRING }, affiliation: { type: Type.STRING },
            specialization: { type: Type.STRING }, link: { type: Type.STRING }
        }, required: ["name", "affiliation", "specialization", "link"]
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            keyTechnologies: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        name: { type: Type.STRING }, description: { type: Type.STRING },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                        trl: { type: Type.INTEGER, description: "Technology Readiness Level from 1 to 9" },
                        implementationComplexity: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] }
                    }, required: ["name", "description", "pros", "cons", "trl", "implementationComplexity"]
                }
            },
            emergingTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            existingSolutionPatterns: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        name: { type: Type.STRING }, description: { type: Type.STRING },
                        companiesUsingIt: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }, required: ["name", "description", "companiesUsingIt"]
                }
            },
            priorArt: { type: Type.ARRAY, items: patentDetailSchema },
            leadingExperts: { type: Type.ARRAY, items: expertDetailSchema }
        },
        required: ["summary", "keyTechnologies", "emergingTrends", "existingSolutionPatterns", "priorArt", "leadingExperts"]
    };

    // Use 'fast' mode for parsing to save tokens and avoid quota limits on Pro model.
    const parsedResponse = await callGeminiWithSchema<Omit<TechnologyResearchOutput, 'sources'>>(`${AgentRole.TECHNOLOGY_SCOUT} (Parser)`, parserSystemInstruction, parserUserPrompt, schema, 'fast');
    return {
        data: { ...parsedResponse.data, sources },
        usage: sumUsage(groundingUsage, parsedResponse.usage)
    };
};

export const runBrandNameSuggestion = (solutionDescription: string, problemStatement: string, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<{ suggestedNames: string[] }>> => {
    const systemInstruction = `You are a world-class branding expert specializing in naming tech startups. Your task is to generate 5 creative, memorable, and professional brand names based on a user's solution concept. The names should be easy to pronounce and spell. Avoid generic or overused tech tropes. Provide only the names.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `
Problem Context: "${problemStatement}"
User's Solution Idea: "${solutionDescription}"

Based on this, generate 5 brand names.
`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            suggestedNames: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        },
        required: ["suggestedNames"]
    };
    return callGeminiWithSchema<{ suggestedNames: string[] }>("Brand Namer", systemInstruction, userPrompt, schema, modelMode);
};

export const runSolutionIdeation = (problemStatement: ProblemStatementOutput, technologyResearch: TechnologyResearchOutput, modelMode: ModelMode, strategicDirective: StrategicDirective, founderDna: FounderDnaOutput | null): Promise<GeminiServiceResponse<IdeationOutput>> => {
    let systemInstruction = `You are the ${AgentRole.SOLUTION_IDEATION} agent. Your goal is to brainstorm 3 distinct, creative solutions for the given 'How Might We...' problem statement. You MUST use the provided technology research to inform your ideas, ensuring they are grounded in feasible technology and aware of existing patterns. For each solution, provide a title, a one-sentence summary, and a detailed description.`;
    let userPrompt = `Problem Statement: "${problemStatement.problemStatement}".
    
Technology & Solution Research:
${JSON.stringify(technologyResearch, null, 2)}

Based on the problem and the research, generate 3 potential solutions.`;

    if (founderDna) {
        systemInstruction += `\n\nYou MUST also tailor your solutions to the strengths and style of the founding team. The ideas should be a natural fit for this specific group.`;
        userPrompt += `\n\n**Founding Team Profile:**\n${JSON.stringify(founderDna, null, 2)}\n\nBrainstorm solutions that this specific team would be well-suited to build and lead.`;
    }

    systemInstruction += getDirectiveInstruction(strategicDirective);
    
    const schema = {
        type: Type.OBJECT, properties: {
            solutions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                id: { type: Type.INTEGER }, 
                title: { type: Type.STRING }, 
                summary: { type: Type.STRING, description: "A one-sentence summary of the solution." },
                description: { type: Type.STRING, description: "A detailed description of the solution." }
            }, required: ["id", "title", "summary", "description"] } }
        }, required: ["solutions"]
    };
    return callGeminiWithSchema(AgentRole.SOLUTION_IDEATION, systemInstruction, userPrompt, schema, modelMode);
};

export const runSolutionCritique = (solutions: IdeationOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<AllCritiquesOutput>> => {
    const systemInstruction = `You are the ${AgentRole.SOLUTION_CRITIQUE} agent, a dual-persona AI. You will critique a list of solutions from two perspectives:
1.  **Devil's Advocate**: Be pragmatic, skeptical, and risk-averse. Focus on feasibility, market risks, financial viability, and potential implementation hurdles. Your goal is to identify every possible way the solution could fail.
2.  **Steve Jobs**: Be a visionary, product-obsessed, and uncompromising on user experience. Focus on elegance, simplicity, 'wow' factor, and whether the solution is truly magical and compelling for the user. Your goal is to push for a 10x better product.

For EACH solution provided, you must provide a separate critique from BOTH personas. Each critique should include a list of weaknesses and a list of tough, probing questions.` + getDirectiveInstruction(strategicDirective);

    const userPrompt = `Critique the following solutions:\n\n${JSON.stringify(solutions, null, 2)}`;

    const critiqueSchema = {
        type: Type.OBJECT,
        properties: {
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            questions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["weaknesses", "questions"]
    };

    const schema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                solutionId: { type: Type.INTEGER },
                devilsAdvocate: critiqueSchema,
                steveJobs: critiqueSchema
            },
            required: ["solutionId", "devilsAdvocate", "steveJobs"]
        }
    };

    return callGeminiWithSchema(AgentRole.SOLUTION_CRITIQUE, systemInstruction, userPrompt, schema, modelMode);
};

export const runSolutionScoring = (problemStatement: ProblemStatementOutput, solutions: IdeationOutput, critiques: AllCritiquesOutput, modelMode: ModelMode, strategicDirective: StrategicDirective, founderDna: FounderDnaOutput | null): Promise<GeminiServiceResponse<SolutionScoringOutput>> => {
    const systemInstruction = `You are the ${AgentRole.VENTURE_ANALYST}, a sharp and decisive venture capitalist. Your task is to quantitatively score a set of solutions and provide a recommendation.
1.  **Score each solution**: For each solution, provide a score from 1 (terrible) to 10 (game-changing) across these key dimensions: Innovation, Feasibility, Market Fit, Scalability, and Capital Efficiency. If founder DNA is provided, also score on Founder-DNA-Alignment.
2.  **Define Key Advantage Metrics**: Identify 2-3 tangible, quantifiable metrics that best capture the core advantage of these solutions over the status quo (the problem context). For each metric, define its unit, state a baseline value (what exists today), and then provide a projected value for EACH solution.
3.  **Recommend**: Write a concise recommendation explaining which solution you would invest in and why, referencing your scores and the critiques.` + getDirectiveInstruction(strategicDirective);
    let userPrompt = `Problem Context: "${problemStatement.userImpact}"
Solutions: ${JSON.stringify(solutions.solutions)}
Critiques: ${JSON.stringify(critiques)}
`;
    if (founderDna) {
        userPrompt += `\nFounder DNA Profile: ${JSON.stringify(founderDna)}`;
    }
    const scoresSchema = {
        type: Type.OBJECT, properties: {
            Innovation: { type: Type.INTEGER }, Feasibility: { type: Type.INTEGER },
            MarketFit: { type: Type.INTEGER }, Scalability: { type: Type.INTEGER },
            CapitalEfficiency: { type: Type.INTEGER },
            FounderDnaAlignment: { type: Type.INTEGER, description: "Score from 1-10 on how well this solution aligns with the team's strengths. 0 if no founder DNA was provided." }
        }, required: ["Innovation", "Feasibility", "MarketFit", "Scalability", "CapitalEfficiency"]
    };
    const schema = {
        type: Type.OBJECT, properties: {
            scores: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { solutionId: { type: Type.INTEGER }, scores: scoresSchema }, required: ["solutionId", "scores"] } },
            recommendationText: { type: Type.STRING },
            recommendedSolutionId: { type: Type.INTEGER },
            keyAdvantageMetrics: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        metricName: { type: Type.STRING }, unit: { type: Type.STRING },
                        baselineValue: { type: Type.NUMBER }, isHigherBetter: { type: Type.BOOLEAN },
                        solutionValues: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { solutionId: { type: Type.INTEGER }, value: { type: Type.NUMBER } }, required: ["solutionId", "value"] } }
                    }, required: ["metricName", "unit", "baselineValue", "isHigherBetter", "solutionValues"]
                }
            }
        }, required: ["scores", "recommendationText", "recommendedSolutionId", "keyAdvantageMetrics"]
    };
    return callGeminiWithSchema(AgentRole.VENTURE_ANALYST, systemInstruction, userPrompt, schema, modelMode);
};

export const runSolutionEvolution = (ventureAnalysis: VentureAnalystOutput, solutions: IdeationOutput, critiques: AllCritiquesOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<SolutionSelectionOutput>> => {
    const systemInstruction = `You are the ${AgentRole.SOLUTION_EVOLUTION} agent, a master synthesizer and product strategist. Your task is to take a recommended solution and evolve it into something even better.
You will receive a ranked list of solutions and their critiques. The user has chosen one to move forward with, which may or may not be the one you initially recommended.
Your job is to:
1.  Take the user's selected solution as the base.
2.  Review the critiques for that solution AND the strengths of the *other* solutions.
3.  Intelligently synthesize the best elements. Can you incorporate a strength from another idea to mitigate a weakness in the chosen one?
4.  Produce an 'evolved' final solution. This isn't just a summary; it's a new, improved version.
5.  Provide a clear title, a detailed description, a justification for why this evolved version is superior, and list its final pros and cons.` + getDirectiveInstruction(strategicDirective);

    const userPrompt = `Analysis of all solutions: ${JSON.stringify(ventureAnalysis, null, 2)}
Full list of original solutions: ${JSON.stringify(solutions.solutions, null, 2)}
Full list of critiques: ${JSON.stringify(critiques, null, 2)}

The user has selected solution ID #${ventureAnalysis.recommendedSolutionId} to proceed with. Please evolve this solution based on all the available information.`;

    const schema = {
        type: Type.OBJECT, properties: {
            selectedSolutionId: { type: Type.INTEGER, description: "The ID of the original solution that was evolved." },
            solutionTitle: { type: Type.STRING, description: "The new, compelling title for the evolved solution." },
            solutionDescription: { type: Type.STRING, description: "A detailed description of the final, evolved solution." },
            justification: { type: Type.STRING, description: "Explanation of how and why the solution was evolved." },
            pros: { type: Type.ARRAY, items: { type: Type.STRING } },
            cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        }, required: ["selectedSolutionId", "solutionTitle", "solutionDescription", "justification", "pros", "cons"]
    };
    return callGeminiWithSchema(AgentRole.SOLUTION_EVOLUTION, systemInstruction, userPrompt, schema, modelMode);
};

export const runSolutionEnhancement = async (problem: string, solution: SolutionSelectionOutput, critique: Critique, modelMode: ModelMode, strategicDirective: StrategicDirective, onProgress: (message: string) => void): Promise<GeminiServiceResponse<SolutionEnhancementOutput>> => {
    const systemInstruction = `You are an AI Product Manager acting as a ${AgentRole.DEVILS_ADVOCATE}. You will receive a problem, a proposed solution, and a critique of that solution. Your task is to refine and enhance the solution based *only* on the critique provided. Do not introduce new ideas. Address the weaknesses and answer the tough questions.
Your output must be a refined solution title, a refined solution description, and a clear justification for the changes you made, explaining how they address the specific points in the critique.` + getDirectiveInstruction(strategicDirective);
    
    onProgress("Analyzing critique...");
    await delay(1000);

    const userPrompt = `Problem: "${problem}"
Solution Title: "${solution.solutionTitle}"
Solution Description: "${solution.solutionDescription}"

Critique to address:
- Weaknesses: ${critique.weaknesses.join(', ')}
- Questions: ${critique.questions.join(', ')}

Now, refine the solution.`;

    onProgress("Formulating refinement...");
    await delay(1000);

    const schema = {
        type: Type.OBJECT,
        properties: {
            refinedSolutionTitle: { type: Type.STRING },
            refinedSolutionDescription: { type: Type.STRING },
            justificationForChange: { type: Type.STRING }
        },
        required: ["refinedSolutionTitle", "refinedSolutionDescription", "justificationForChange"]
    };

    const response = await callGeminiWithSchema<SolutionEnhancementOutput>(AgentRole.DEVILS_ADVOCATE, systemInstruction, userPrompt, schema, modelMode);
    
    onProgress("Enhancement complete.");
    return response;
};

// --- DIAMOND 2: DELIVER ---
export const runIpStrategyAnalysis = (solutionDescription: string, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<IpStrategyOutput>> => {
    const systemInstruction = `You are the ${AgentRole.IP_STRATEGIST}, an AI specializing in intellectual property analysis for technology startups. Your task is to analyze a given solution and provide a strategic IP assessment. Use Google Search for a high-level prior art search.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Analyze the following solution for its intellectual property potential: "${solutionDescription}".
Your output must be a structured text report with citations. The report should include:
1.  **Patentability Score**: An estimated score from 1 (not patentable) to 10 (highly patentable), with a brief reasoning.
2.  **Prior Art Summary**: A summary of 2-3 of the most relevant existing patents, products, or papers found via web search. Include titles and links.
3.  **Freedom to Operate (FTO) Signal**: A 'Green', 'Yellow', or 'Red' signal indicating the estimated risk of infringing on existing patents, with reasoning.
4.  **IP Strategy Recommendation**: A high-level recommendation (e.g., pursue utility patent, rely on trade secrets, focus on defensive publication).`;

    const makeRequest = async () => {
        const modelName = getModel(modelMode);
        return await ai.models.generateContent({
            model: modelName, contents: userPrompt,
            config: { systemInstruction, temperature: 0.2, tools: [{ googleSearch: {} }] },
        });
    };

    const runAndParse = async (): Promise<GeminiServiceResponse<IpStrategyOutput>> => {
        const response = await makeRequest();
        const researchText = response.text.trim();
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const sources: GroundingSource[] = groundingChunks?.map((chunk: any) => ({ uri: chunk.web.uri, title: chunk.web.title }))
            .filter((source: any, index: number, self: any[]) => source.uri && index === self.findIndex((s: any) => s.uri === source.uri)) || [];

        const groundingUsage: Usage = {
            input: response.usageMetadata?.promptTokenCount || 0,
            output: response.usageMetadata?.candidatesTokenCount || 0,
            total: response.usageMetadata?.totalTokenCount || 0
        };

        const parserSystemInstruction = "You are a data parsing agent. Convert the provided IP strategy report into a structured JSON object.";
        const parserUserPrompt = `Parse the following report:\n\n---START REPORT---\n${researchText}\n---END REPORT---`;
        const schema = {
            type: Type.OBJECT,
            properties: {
                patentabilityScore: { type: Type.INTEGER },
                patentabilityReasoning: { type: Type.STRING },
                priorArtSummary: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, link: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["title", "link", "summary"] } },
                freedomToOperateSignal: { type: Type.STRING, enum: ['Green', 'Yellow', 'Red'] },
                freedomToOperateReasoning: { type: Type.STRING },
                ipStrategyRecommendation: { type: Type.STRING }
            },
            required: ["patentabilityScore", "patentabilityReasoning", "priorArtSummary", "freedomToOperateSignal", "freedomToOperateReasoning", "ipStrategyRecommendation"]
        };

        const parsedResponse = await callGeminiWithSchema<Omit<IpStrategyOutput, 'sources'>>(AgentRole.IP_STRATEGIST, parserSystemInstruction, parserUserPrompt, schema, modelMode);
        return {
            data: { ...parsedResponse.data, sources },
            usage: sumUsage(groundingUsage, parsedResponse.usage)
        };
    };

    return runAndParse();
};

export const runTalentStrategy = (solution: SolutionSelectionOutput, founderDna: FounderDnaOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<TalentStrategyOutput>> => {
    const systemInstruction = `You are the ${AgentRole.TALENT_STRATEGIST}, an expert in startup team composition and organizational design. Your task is to analyze the venture's solution and the existing founder DNA to devise a comprehensive talent strategy.
1.  **Ideal Co-Founders**: Based on the solution and the gaps in the current team, define 2-3 ideal co-founder profiles needed for success. For each profile, provide a role title, an archetype (e.g., "The Growth Hacker," "The Deep Tech Scientist"), key responsibilities, required skills, and the complementary traits that would balance the existing team.
2.  **Team Capability Analysis**: Score the 'Current Team' and the 'Ideal Team' (with the new co-founders) from 1-10 across key dimensions: Technical Expertise, Product Vision, Sales & Marketing, Operational Excellence, Fundraising Ability, and Industry Network. Provide a justification for each score.
3.  **Summary**: Write a brief summary of your overall talent strategy.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture Solution: "${solution.solutionTitle}" - ${solution.solutionDescription}
Existing Founder DNA: ${JSON.stringify(founderDna)}

Please generate the talent strategy.`;
    const teamCapabilityScoreSchema = {
        type: Type.OBJECT, properties: {
            dimension: { type: Type.STRING, enum: ['Technical Expertise', 'Product Vision', 'Sales & Marketing', 'Operational Excellence', 'Fundraising Ability', 'Industry Network'] },
            score: { type: Type.INTEGER },
            justification: { type: Type.STRING }
        }, required: ["dimension", "score", "justification"]
    };
    const schema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING },
            idealCoFounders: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        roleTitle: { type: Type.STRING }, archetype: { type: Type.STRING },
                        keyResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        requiredSkillsAndExperience: { type: Type.ARRAY, items: { type: Type.STRING } },
                        complementaryTraits: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }, required: ["roleTitle", "archetype", "keyResponsibilities", "requiredSkillsAndExperience", "complementaryTraits"]
                }
            },
            teamCapabilityAnalysis: {
                type: Type.OBJECT, properties: {
                    currentTeam: { type: Type.ARRAY, items: teamCapabilityScoreSchema },
                    idealTeam: { type: Type.ARRAY, items: teamCapabilityScoreSchema }
                }, required: ["currentTeam", "idealTeam"]
            }
        },
        required: ["summary", "idealCoFounders", "teamCapabilityAnalysis"]
    };
    return callGeminiWithSchema(AgentRole.TALENT_STRATEGIST, systemInstruction, userPrompt, schema, modelMode);
};

export const runTalentScout = async (profile: IdealCoFounderProfile, solution: SolutionSelectionOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<SuggestedFounderProfile[]>> => {
    const systemInstruction = `You are an AI Talent Scout. Your task is to find 3 real-world examples of professionals who fit an ideal co-founder profile for a specific startup. Use Google Search to find public information (like LinkedIn profiles).
For each suggested candidate, provide their name, current role and company, a link to their public profile, and a brief justification for why they are a good fit.
IMPORTANT: This is for inspirational and research purposes only. Do not generate contact information. Focus on publicly available professional profiles.` + getDirectiveInstruction(strategicDirective);

    const userPrompt = `Startup Solution: "${solution.solutionTitle}"
Ideal Co-Founder Profile to find:
- Role Title: ${profile.roleTitle}
- Archetype: ${profile.archetype}
- Key Responsibilities: ${profile.keyResponsibilities.join(', ')}
- Required Skills: ${profile.requiredSkillsAndExperience.join(', ')}

Find 3 real-world examples.`;
    
    const makeRequest = async () => {
         const modelName = getModel(modelMode);
         return await ai.models.generateContent({
            model: modelName, contents: userPrompt,
            config: { systemInstruction, temperature: 0.5, tools: [{ googleSearch: {} }] },
        });
    }
    
    const response = await makeRequest();
    const researchText = response.text;
    const groundingUsage: Usage = {
        input: response.usageMetadata?.promptTokenCount || 0,
        output: response.usageMetadata?.candidatesTokenCount || 0,
        total: response.usageMetadata?.totalTokenCount || 0
    };

    const parserSystemInstruction = "You are a data parsing agent. Convert the provided text list of candidates into a structured JSON array.";
    const parserUserPrompt = `Parse the following text into a JSON array of suggested candidates:\n\n${researchText}`;

    const schema = {
        type: Type.ARRAY, items: {
            type: Type.OBJECT, properties: {
                name: { type: Type.STRING },
                currentRole: { type: Type.STRING },
                company: { type: Type.STRING },
                profileUrl: { type: Type.STRING },
                justification: { type: Type.STRING }
            }, required: ["name", "currentRole", "company", "profileUrl", "justification"]
        }
    };
    
    const parsedResponse = await callGeminiWithSchema<SuggestedFounderProfile[]>("Talent Scout Parser", parserSystemInstruction, parserUserPrompt, schema, modelMode);
    
    return {
        data: parsedResponse.data,
        usage: sumUsage(groundingUsage, parsedResponse.usage)
    };
};


export const runValueProposition = (history: DeliverHistory, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<ValuePropositionCanvasOutput>> => {
    const systemInstruction = `You are the ${AgentRole.VALUE_PROPOSITION} agent. Your task is to complete the Value Proposition Canvas. Based on the solution, identify the Customer Jobs, their Pains, and their Gains. Then, map the solution's features as Products & Services, Pain Relievers, and Gain Creators.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Problem: "${history.problemStatement}"\nSolution: "${history.solution}"\n\nComplete the Value Proposition Canvas with 2-4 points per section.`;
    const listProp = { type: Type.ARRAY, items: { type: Type.STRING } };
    const schema = {
        type: Type.OBJECT,
        properties: {
            customer: { type: Type.OBJECT, properties: { gains: listProp, pains: listProp, customerJobs: listProp }, required: ["gains", "pains", "customerJobs"] },
            valueMap: { type: Type.OBJECT, properties: { gainCreators: listProp, painRelievers: listProp, productsAndServices: listProp }, required: ["gainCreators", "painRelievers", "productsAndServices"] }
        },
        required: ["customer", "valueMap"]
    };
    return callGeminiWithSchema(AgentRole.VALUE_PROPOSITION, systemInstruction, userPrompt, schema, modelMode);
};

export const runLeanCanvas = (history: DeliverHistory, vpc: ValuePropositionCanvasOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<LeanCanvasOutput>> => {
    const systemInstruction = `You are the ${AgentRole.LEAN_CANVAS} agent. Fill out all 9 sections of the Lean Canvas based on the provided information. Be concise and strategic.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Problem: "${history.problemStatement}"\nSolution: "${history.solution}"\n\nValue Proposition Canvas: ${JSON.stringify(vpc, null, 2)}\n\nFill out the Lean Canvas. Provide 1-3 points for each section.`;
    const listProp = { type: Type.ARRAY, items: { type: Type.STRING } };
    const schema = {
        type: Type.OBJECT,
        properties: {
            problem: listProp, solution: listProp, keyMetrics: listProp, uniqueValueProposition: listProp,
            unfairAdvantage: listProp, channels: listProp, customerSegments: listProp, costStructure: listProp, revenueStreams: listProp
        },
        required: ["problem", "solution", "keyMetrics", "uniqueValueProposition", "unfairAdvantage", "channels", "customerSegments", "costStructure", "revenueStreams"]
    };
    return callGeminiWithSchema(AgentRole.LEAN_CANVAS, systemInstruction, userPrompt, schema, modelMode);
};

export const runStoryboarding = async (history: DeliverHistory, persona: CustomerPersonaOutput, vpc: ValuePropositionCanvasOutput, leanCanvas: LeanCanvasOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<StoryboardOutput>> => {
    const systemInstruction = `You are the ${AgentRole.STORYBOARDING} agent. Create a 5-panel storyboard that tells the customer's journey. For each panel, provide the panel number, a scene description, narration, and a detailed, SFW image prompt for an image generation model. The prompts should describe a visually interesting scene in a consistent style (e.g., 'digital art illustration', 'photorealistic'). The story must follow this arc:
1.  **The Problem**: Show the persona struggling with the problem.
2.  **The Discovery**: The persona discovers your solution.
3.  **The "Aha!" Moment**: The persona uses the solution for the first time and experiences its core value.
4.  **The New Reality**: Show the positive outcome and new state after using the solution.
5.  **The Advocate**: The persona shares their positive experience with others.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Persona: ${persona.name}, a ${persona.occupation}.\nProblem: "${history.problemStatement}"\nSolution: "${history.solution}"\n\nCreate the 5-panel storyboard.`;
    const panelSchema = {
        type: Type.OBJECT, properties: {
            panel: { type: Type.INTEGER },
            scene: { type: Type.STRING },
            narration: { type: Type.STRING },
            imagePrompt: { type: Type.STRING }
        }, required: ["panel", "scene", "narration", "imagePrompt"]
    };
    const schema = {
        type: Type.OBJECT, properties: {
            title: { type: Type.STRING },
            panels: { type: Type.ARRAY, items: panelSchema }
        }, required: ["title", "panels"]
    };
    const storyboardResponse = await callGeminiWithSchema<Omit<StoryboardOutput, 'panels'> & { panels: Omit<StoryboardPanel, 'imageB64'>[] }>(AgentRole.STORYBOARDING, systemInstruction, userPrompt, schema, modelMode);

    let totalImageUsage = emptyUsage();
    const panelsWithImages = await Promise.all(storyboardResponse.data.panels.map(async (panel) => {
        const { imageB64, usage } = await generateImage(panel.imagePrompt);
        totalImageUsage = sumUsage(totalImageUsage, usage);
        return { ...panel, imageB64 };
    }));

    return {
        data: { ...storyboardResponse.data, panels: panelsWithImages },
        usage: sumUsage(storyboardResponse.usage, totalImageUsage)
    };
};

export const runFinancialModeler = async (history: DeliverHistory, leanCanvas: LeanCanvasOutput, modelMode: ModelMode, strategicDirective: StrategicDirective, brandName?: string | null): Promise<GeminiServiceResponse<FinancialPlanningOutput>> => {
    const systemInstruction = `You are the ${AgentRole.FINANCIAL_MODELER}, an AI acting as a startup CFO and branding expert. Your task is to create a high-level financial and branding plan.
1.  **Brand Names**: Suggest 5 creative, memorable, and professional brand names.
2.  **Elevator Pitch**: Write a compelling, concise one-paragraph elevator pitch.
3.  **Image Prompt**: Create a detailed, SFW prompt for an abstract, visually stunning 16:9 background image that represents the brand essence.
4.  **Cost Breakdown**: Identify the top 5-7 major annual cost categories and estimate their costs in USD.
5.  **Market Size**: Estimate the TAM, SAM, and SOM in USD, and cite a reference for your calculation methodology.
6.  **Cash Flow Model**: Generate a complete 5-year cash flow model, including all assumptions and final valuation metrics (Enterprise Value, NPV, IRR).` + getDirectiveInstruction(strategicDirective);
    
    const userPrompt = `Venture Context:\n- Problem: ${history.problemStatement}\n- Solution: ${history.solution}\n- Target Market: ${history.targetMarket}\n- Lean Canvas: ${JSON.stringify(leanCanvas, null, 2)}\n\nNow, generate the full financial and branding plan.`;
    
    const schema = {
        type: Type.OBJECT,
        properties: {
            suggestedBrandNames: { type: Type.ARRAY, items: { type: Type.STRING } },
            elevatorPitch: { type: Type.STRING },
            elevatorPitchImagePrompt: { type: Type.STRING },
            costBreakdown: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, description: { type: Type.STRING }, estimatedAnnualCost: { type: Type.STRING } }, required: ["category", "description", "estimatedAnnualCost"] } },
            marketSize: { type: Type.OBJECT, properties: { potentialAddressableMarket: { type: Type.STRING }, totalAddressableMarket: { type: Type.STRING }, serviceableAvailableMarket: { type: Type.STRING }, serviceableObtainableMarket: { type: Type.STRING }, calculationReference: { type: Type.STRING } }, required: ["potentialAddressableMarket", "totalAddressableMarket", "serviceableAvailableMarket", "serviceableObtainableMarket", "calculationReference"] },
            cashFlowModel: cashFlowModelSchema,
        },
        required: ["suggestedBrandNames", "elevatorPitch", "elevatorPitchImagePrompt", "costBreakdown", "marketSize", "cashFlowModel"]
    };

    const financialResponse = await callGeminiWithSchema<Omit<FinancialPlanningOutput, 'selectedBrandName' | 'elevatorPitchImageB64'>>(AgentRole.FINANCIAL_MODELER, systemInstruction, userPrompt, schema, modelMode);
    
    const { imageB64, usage: imageUsage } = await generateImage(financialResponse.data.elevatorPitchImagePrompt, '16:9');
    
    return {
        data: {
            ...financialResponse.data,
            selectedBrandName: brandName || financialResponse.data.suggestedBrandNames[0] || "InnovateX",
            elevatorPitchImageB64: imageB64
        },
        usage: sumUsage(financialResponse.usage, imageUsage)
    };
};

export const runStrategy = (history: DeliverHistory, leanCanvas: LeanCanvasOutput, research: ResearchOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<StrategyOutput>> => {
    const systemInstruction = `You are the ${AgentRole.STRATEGY} agent. Conduct a SWOT analysis and analyze the competitive landscape to define the venture's Unfair Advantage.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture: "${history.solution}"\n\nLean Canvas: ${JSON.stringify(leanCanvas, null, 2)}\n\nInitial Research: ${JSON.stringify(research, null, 2)}\n\nProvide the strategic analysis.`;
    const swotSchema = {
        type: Type.OBJECT, properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            opportunities: { type: Type.ARRAY, items: { type: Type.STRING } }, threats: { type: Type.ARRAY, items: { type: Type.STRING } }
        }, required: ["strengths", "weaknesses", "opportunities", "threats"]
    };
    const schema = {
        type: Type.OBJECT, properties: {
            swotAnalysis: swotSchema,
            unfairAdvantage: { type: Type.STRING },
            competitors: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                name: { type: Type.STRING }, description: { type: Type.STRING }, keyProduct: { type: Type.STRING },
                businessModel: { type: Type.STRING }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, differentiationOpportunity: { type: Type.STRING }
            }, required: ["name", "description", "keyProduct", "businessModel", "strengths", "weaknesses", "differentiationOpportunity"] } }
        }, required: ["swotAnalysis", "unfairAdvantage", "competitors"]
    };
    return callGeminiWithSchema(AgentRole.STRATEGY, systemInstruction, userPrompt, schema, modelMode);
};

export const runRiskAnalysis = (history: DeliverHistory, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<RiskAnalysisOutput>> => {
    const systemInstruction = `You are the ${AgentRole.RISK_ANALYSIS} agent. Identify potential Market, Financial, Technical, and Operational risks. For each risk, assess its Likelihood and Impact (Low, Medium, High) and propose a mitigation strategy.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture: "${history.solution}"\n\nIdentify the key risks and their mitigations.`;
    const riskSchema = {
        type: Type.OBJECT, properties: {
            risk: { type: Type.STRING },
            category: { type: Type.STRING, enum: ['Market', 'Financial', 'Technical', 'Operational'] },
            likelihood: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            impact: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
            mitigation: { type: Type.STRING }
        }, required: ["risk", "category", "likelihood", "impact", "mitigation"]
    };
    const schema = {
        type: Type.OBJECT, properties: {
            riskSummary: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: riskSchema }
        }, required: ["riskSummary", "risks"]
    };
    return callGeminiWithSchema(AgentRole.RISK_ANALYSIS, systemInstruction, userPrompt, schema, modelMode);
};

export const runTechnicalBlueprint = (history: DeliverHistory, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<TechnicalArchitectOutput>> => {
    const systemInstruction = `You are the ${AgentRole.TECHNICAL_BLUEPRINT} agent. Your task is to create a strategic product and technical plan.
1.  **Architecture Overview**: Briefly describe the high-level architecture.
2.  **Tech Stack**: Recommend a technology stack for each layer (Frontend, Backend, etc.).
3.  **MVP Definition**: Create a detailed definition of the Minimum Viable Product (MVP). This MUST include a concise summary of its purpose, a bulleted list of the absolute core features, and a list of key metrics to validate the MVP's success.
4.  **Product Roadmap**: Create a phased roadmap (MVP, V1, V2). For each phase, define the strategic goals and list the key features to be built. The MVP features in the roadmap should align with your MVP definition.
5.  **Roadmap Visualization**: Generate a Mermaid.js 'gantt' chart diagram to visualize this roadmap.
6.  **AI Core Specification**: If relevant, describe the AI approach.
7.  **Validation Strategy**: Outline how to validate the product at different stages.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Solution: "${history.solution}"\n\nProvide the strategic product and technical blueprint. Ensure the Mermaid.js code for the Gantt chart is valid and correctly represents the phased roadmap.`;
    
    const productRoadmapPhaseSchema = {
        type: Type.OBJECT, properties: {
            phase: { type: Type.STRING, enum: ['MVP (0-3 months)', 'V1 (3-6 months)', 'V2 (6-12 months)'] },
            strategicGoals: { type: Type.ARRAY, items: { type: Type.STRING } },
            features: { type: Type.ARRAY, items: { type: Type.STRING } }
        }, required: ["phase", "strategicGoals", "features"]
    };

    const mvpDefinitionSchema = {
        type: Type.OBJECT,
        properties: {
            summary: { type: Type.STRING, description: "A concise summary of the MVP's purpose and target user." },
            coreFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A bulleted list of the absolute essential features for the MVP." },
            successMetrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key metrics to validate the MVP's success (e.g., 'User retention rate > 20% after 1 week')." }
        },
        required: ["summary", "coreFeatures", "successMetrics"]
    };

    const schema = {
        type: Type.OBJECT,
        properties: {
            architectureOverview: { type: Type.STRING },
            techStack: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { layer: { type: Type.STRING, enum: ['Frontend', 'Backend', 'Database', 'Cloud/Hosting', 'Key Libraries'] }, technology: { type: Type.STRING }, reason: { type: Type.STRING } }, required: ["layer", "technology", "reason"] } },
            mvpDefinition: mvpDefinitionSchema,
            productRoadmap: { type: Type.ARRAY, items: productRoadmapPhaseSchema },
            productRoadmapMermaidCode: { type: Type.STRING, description: "Mermaid.js code for a 'gantt' chart to visualize the product roadmap." },
            aiCoreSpecification: { type: Type.OBJECT, properties: { approach: { type: Type.STRING }, reasoning: { type: Type.STRING } }, required: ["approach", "reasoning"] },
            validationStrategy: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phase: { type: Type.STRING }, objective: { type: Type.STRING }, methodology: { type: Type.STRING } }, required: ["phase", "objective", "methodology"] } }
        },
        required: ["architectureOverview", "techStack", "mvpDefinition", "productRoadmap", "productRoadmapMermaidCode", "aiCoreSpecification", "validationStrategy"]
    };

    return callGeminiWithSchema(AgentRole.TECHNICAL_BLUEPRINT, systemInstruction, userPrompt, schema, modelMode);
};

export const runGoToMarket = (history: DeliverHistory, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<GoToMarketOutput>> => {
    const systemInstruction = `You are the ${AgentRole.GO_TO_MARKET} agent. Create a comprehensive Go-to-Market strategy, including launch summary, target channels, key messaging, timelines, ad copy, content calendar, expansion roadmap, and a customer journey map.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture: "${history.solution}" targeting ${history.targetMarket}.\n\nDevelop the GTM strategy. The market expansion roadmap mermaid code must be a valid 'graph TD' diagram.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            launchStrategySummary: { type: Type.STRING },
            initialTargetCustomer: { type: Type.OBJECT, properties: { segment: { type: Type.STRING }, justification: { type: Type.STRING } }, required: ["segment", "justification"] },
            impactMetrics: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, target: { type: Type.STRING }, measurementMethod: { type: Type.STRING } }, required: ["metric", "target", "measurementMethod"] } },
            targetChannels: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { channel: { type: Type.STRING }, strategy: { type: Type.STRING }, kpis: { type: Type.STRING } }, required: ["channel", "strategy", "kpis"] } },
            keyMessaging: { type: Type.OBJECT, properties: { slogan: { type: Type.STRING }, messagePoints: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["slogan", "messagePoints"] },
            launchTimeline: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phase: { type: Type.STRING, enum: ['Pre-Launch', 'Beta Launch', 'Public Launch'] }, activities: { type: Type.ARRAY, items: { type: Type.STRING } }, duration: { type: Type.STRING } }, required: ["phase", "activities", "duration"] } },
            sampleAdCopy: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { channel: { type: Type.STRING }, headline: { type: Type.STRING }, body: { type: Type.STRING } }, required: ["channel", "headline", "body"] } },
            contentCalendar: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { week: { type: Type.STRING }, theme: { type: Type.STRING }, samplePost: { type: Type.STRING } }, required: ["week", "theme", "samplePost"] } },
            marketExpansionRoadmap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { market: { type: Type.STRING }, timeframe: { type: Type.STRING }, justification: { type: Type.STRING }, strategicGoals: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["market", "timeframe", "justification", "strategicGoals"] } },
            expansionRoadmapMermaidCode: { type: Type.STRING, description: "Mermaid.js code for a 'graph TD' timeline diagram." },
            customerJourneyMap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { stageName: { type: Type.STRING, enum: ['Awareness', 'Consideration', 'Purchase', 'Service', 'Loyalty'] }, customerGoals: { type: Type.ARRAY, items: { type: Type.STRING } }, touchpoints: { type: Type.ARRAY, items: { type: Type.STRING } }, customerExperience: { type: Type.STRING } }, required: ["stageName", "customerGoals", "touchpoints", "customerExperience"] } }
        },
        required: ["launchStrategySummary", "initialTargetCustomer", "impactMetrics", "targetChannels", "keyMessaging", "launchTimeline", "sampleAdCopy", "contentCalendar", "marketExpansionRoadmap", "expansionRoadmapMermaidCode", "customerJourneyMap"]
    };
    return callGeminiWithSchema(AgentRole.GO_TO_MARKET, systemInstruction, userPrompt, schema, modelMode);
};

export const runPitchDeck = async (report: ReportData, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<PitchDeckOutput>> => {
    const systemInstruction = `You are the ${AgentRole.PITCH_DECK} agent, a world-class venture capitalist and startup pitch coach.
Your task is to synthesize the provided venture report into a strictly structured, investor-ready 10-slide pitch deck (based on the Sequoia/Y Combinator standard).

**Crucial:**
1. Populate each slide with specific details, data, and evidence found in the provided report. Do not use generic placeholders.
2. For EVERY slide, write a detailed 'imagePrompt' that describes a visually compelling, professional image to accompany the slide content. The style should be modern, minimalist, and suitable for a high-stakes presentation.

**Structure Requirements:**
1. **Title Slide**: Venture Name, Tagline, and Vision. Image: Abstract, visionary representation of the core concept.
2. **The Problem**: Define the pain point and who has it. Image: A scene depicting the user's struggle or the magnitude of the problem.
3. **The Solution**: Describe the product and value prop. Image: A sleek product mockup or a diagram of the solution in action.
4. **Why Now?**: Trends and timing. Image: A metaphorical representation of momentum, timing, or a trend wave.
5. **Market Size**: TAM, SAM, SOM. Image: A visualized market map or growth chart concept.
6. **Competition**: The landscape and your Unfair Advantage. Image: A chessboard, race track, or positioning matrix concept.
7.  **Product**: Key features and Roadmap. Image: A feature highlight or a roadmap timeline visualization.
8.  **Business Model**: How you make money. Image: An ecosystem diagram or a value exchange illustration.
9.  **The Team**: Founder superpowers and gaps. Image: A dynamic team silhouette or collaboration concept.
10. **Financials & Ask**: Projections and funding request. Image: An upward trending financial graph or a rocket taking off.

Also, write a powerful 2-3 sentence Executive Summary.` + getDirectiveInstruction(strategicDirective);

    const userPrompt = `Venture Data Report:
${JSON.stringify(report, null, 2)}

Create the 10-slide pitch deck following the strict structure defined in the system instructions.`;

    const slideContentSchema = {
        type: Type.OBJECT, properties: {
            heading: { type: Type.STRING },
            points: { type: Type.ARRAY, items: { type: Type.STRING } }
        }, required: ["heading", "points"]
    };
    const schema = {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            slides: {
                type: Type.ARRAY, items: {
                    type: Type.OBJECT, properties: {
                        slideNumber: { type: Type.INTEGER },
                        title: { type: Type.STRING },
                        content: { type: Type.ARRAY, items: slideContentSchema },
                        imagePrompt: { type: Type.STRING, description: "A detailed prompt for generating a background or accompanying image for this slide." }
                    }, required: ["slideNumber", "title", "content", "imagePrompt"]
                }
            }
        },
        required: ["executiveSummary", "slides"]
    };
    
    // 1. Generate text structure with prompts
    const deckResponse = await callGeminiWithSchema<PitchDeckOutput>(AgentRole.PITCH_DECK, systemInstruction, userPrompt, schema, modelMode);
    
    // 2. Generate images for all slides in parallel using Nano Banana
    let totalImageUsage = emptyUsage();
    
    const slidesWithImages = await Promise.all(deckResponse.data.slides.map(async (slide) => {
        const { imageB64, usage } = await generateNanoBananaImage(slide.imagePrompt);
        totalImageUsage = sumUsage(totalImageUsage, usage);
        return { ...slide, imageB64 };
    }));

    return {
        data: { ...deckResponse.data, slides: slidesWithImages },
        usage: sumUsage(deckResponse.usage, totalImageUsage)
    };
};

export const runInvestmentMemo = (report: ReportData, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<InvestmentMemoOutput>> => {
    const systemInstruction = `You are the ${AgentRole.INVESTMENT_MEMO} agent, a Venture Capital analyst. Your task is to synthesize the provided venture plan into a professional, structured investment memorandum suitable for a VC investment committee. Be concise, analytical, and objective.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture Plan Data:\n${JSON.stringify(report, null, 2)}\n\nGenerate the investment memo.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            executiveSummary: { type: Type.STRING },
            problemAndSolution: { type: Type.OBJECT, properties: { problem: { type: Type.STRING }, solution: { type: Type.STRING } }, required: ["problem", "solution"] },
            marketOpportunity: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, marketSize: { type: Type.STRING } }, required: ["summary", "marketSize"] },
            product: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, unfairAdvantage: { type: Type.STRING } }, required: ["description", "unfairAdvantage"] },
            team: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, strengths: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["summary", "strengths"] },
            goToMarketStrategy: { type: Type.OBJECT, properties: { summary: { type: Type.STRING } }, required: ["summary"] },
            financialsSummary: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, keyProjections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { metric: { type: Type.STRING }, value: { type: Type.STRING } }, required: ["metric", "value"] } } }, required: ["summary", "keyProjections"] },
            dealAndAsk: { type: Type.OBJECT, properties: { ask: { type: Type.STRING }, useOfFunds: { type: Type.STRING } }, required: ["ask", "useOfFunds"] },
            investmentThesis: { type: Type.ARRAY, items: { type: Type.STRING } },
            keyRisks: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["executiveSummary", "problemAndSolution", "marketOpportunity", "product", "team", "goToMarketStrategy", "financialsSummary", "dealAndAsk", "investmentThesis", "keyRisks"]
    };
    return callGeminiWithSchema(AgentRole.INVESTMENT_MEMO, systemInstruction, userPrompt, schema, modelMode);
};

// --- POST-ANALYSIS AGENTS ---

export const runRedTeamAnalysis = (report: ReportData, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<RedTeamOutput>> => {
    const systemInstruction = `You are a Red Team agent, a ruthless competitive strategist. Your goal is to simulate a well-funded competitor and devise a strategy to crush the user's venture. Analyze the provided venture plan, identify its weaknesses, and create a multi-pronged counter-attack.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture Plan to attack:\n${JSON.stringify(report, null, 2)}\n\nNow, define your competitor profile and counter-strategy.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            competitorProfile: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["name", "description"] },
            counterStrategySummary: { type: Type.STRING },
            keyVulnerabilitiesExploited: { type: Type.ARRAY, items: { type: Type.STRING } },
            productFlank: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING }, features: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["strategy", "features"] },
            marketingBlitz: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING }, tactics: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ["strategy", "tactics"] },
            pricingPressure: { type: Type.OBJECT, properties: { strategy: { type: Type.STRING }, details: { type: Type.STRING } }, required: ["strategy", "details"] }
        },
        required: ["competitorProfile", "counterStrategySummary", "keyVulnerabilitiesExploited", "productFlank", "marketingBlitz", "pricingPressure"]
    };
    return callGeminiWithSchema("Red Team", systemInstruction, userPrompt, schema, modelMode);
};

export const runEthicsAnalysis = (report: ReportData, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<EthicsOracleOutput>> => {
    const systemInstruction = `You are the ${AgentRole.ETHICS_ORACLE}. Your task is to perform an ethics and compliance audit on the provided venture plan. Score the venture's risk as 'Green', 'Yellow', or 'Red' across key dimensions, provide explanations, and offer actionable recommendations. If you find a severe, unavoidable ethical issue, include a 'Red Flag Warning'.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture Plan to audit:\n${JSON.stringify(report, null, 2)}\n\nPerform the ethics audit.`;
    const scoreSchema = {
        type: Type.OBJECT, properties: {
            dimension: { type: Type.STRING, enum: ['Data Privacy & Security', 'Bias & Fairness', 'Environmental Sustainability', 'Social Equity & Inclusion', 'Regulatory Compliance Risk'] },
            score: { type: Type.STRING, enum: ['Green', 'Yellow', 'Red'] },
            explanation: { type: Type.STRING }
        }, required: ["dimension", "score", "explanation"]
    };
    const schema = {
        type: Type.OBJECT,
        properties: {
            scores: { type: Type.ARRAY, items: scoreSchema },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            redFlagWarning: { type: Type.STRING, description: "Only include this field if a critical, un-mitigatable ethical flaw is discovered." }
        },
        required: ["scores", "recommendations"]
    };
    return callGeminiWithSchema(AgentRole.ETHICS_ORACLE, systemInstruction, userPrompt, schema, modelMode);
};

export const runSuccessScoring = (report: ReportData, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<SuccessScoreOutput>> => {
    const systemInstruction = `You are the ${AgentRole.SUCCESS_SCORE_ANALYSIS}, acting as a seasoned venture capitalist. Your task is to provide a predictive success score for the entire venture plan.
1.  **Overall Score**: Provide a score out of 1000.
2.  **Score Justification**: Explain your reasoning for the overall score.
3.  **Score Level**: Categorize the score as 'Low', 'Medium', 'High', or 'Excellent'.
4.  **Pillar Scores**: Score the venture from 1-100 on four pillars: Desirability (market need), Feasibility (can it be built), Viability (business sense), and Impact Integrity (ethical/ESG). Provide a summary for each.
5.  **Strengths & Improvements**: List the key strengths and areas for improvement.
6.  **Recommendations**: Provide actionable recommendations for the founders.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Analyze the following complete venture plan and provide a success score.\n\n${JSON.stringify(report, null, 2)}`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            overallScore: { type: Type.INTEGER },
            scoreJustification: { type: Type.STRING },
            scoreLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Excellent'] },
            pillarScores: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: {
                pillar: { type: Type.STRING, enum: ['Desirability', 'Feasibility', 'Viability', 'Impact Integrity'] },
                score: { type: Type.INTEGER },
                summary: { type: Type.STRING }
            }, required: ["pillar", "score", "summary"] } },
            keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["overallScore", "scoreJustification", "scoreLevel", "pillarScores", "keyStrengths", "areasForImprovement", "recommendations"]
    };
    return callGeminiWithSchema(AgentRole.SUCCESS_SCORE_ANALYSIS, systemInstruction, userPrompt, schema, modelMode);
};

export const runFinancialScenarioModeling = (history: DeliverHistory, financialPlan: FinancialPlanningOutput, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<FinancialScenario[]>> => {
    const systemInstruction = `You are a financial analyst specializing in scenario modeling for startups. You will be given a base financial model. Your task is to generate two alternative scenarios: 'Best Case' and 'Worst Case'.
For each scenario:
1.  **State the Scenario Type**.
2.  **Summarize Assumptions**: Briefly explain the key assumption changes you made for this scenario (e.g., "Assumes faster market adoption and lower customer acquisition costs").
3.  **Generate a New Cash Flow Model**: Recalculate the entire 5-year cash flow model based on these new assumptions. The structure must match the original model exactly.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Base Venture & Financials:\n- Problem: ${history.problemStatement}\n- Solution: ${history.solution}\n- Base Cash Flow Model: ${JSON.stringify(financialPlan.cashFlowModel)}\n\nGenerate the 'Best Case' and 'Worst Case' scenarios.`;
    const schema = {
        type: Type.ARRAY, items: {
            type: Type.OBJECT, properties: {
                scenarioType: { type: Type.STRING, enum: ['Best Case', 'Worst Case'] },
                summaryOfAssumptions: { type: Type.STRING },
                cashFlowModel: cashFlowModelSchema
            }, required: ["scenarioType", "summaryOfAssumptions", "cashFlowModel"]
        }
    };
    return callGeminiWithSchema("Financial Scenario Modeler", systemInstruction, userPrompt, schema, modelMode);
};

export const runVideoGeneration = async (storyboard: StoryboardOutput, modelMode: ModelMode, onProgress: (message: string) => void, signal: AbortSignal): Promise<GeminiServiceResponse<{ videoUrl: string }>> => {
    onProgress("Initializing video generation...");
    let operation;
    try {
        const aiWithKey = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Create a short video based on this storyboard: ${storyboard.title}. The story is: ${storyboard.panels.map(p => p.narration).join('. ')}. Style should be: ${storyboard.panels[0].imagePrompt}.`;
        
        const model = modelMode === 'fast' ? 'veo-3.1-fast-generate-preview' : 'veo-3.1-generate-preview';
        
        operation = await aiWithKey.models.generateVideos({
            model: model,
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        onProgress("Video generation started. This may take a few minutes...");
        
        while (!operation.done) {
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await aiWithKey.operations.getVideosOperation({ operation: operation });
            onProgress(`Checking status... (State: ${operation.state})`);
        }

        if (operation.error) {
            throw new Error(`Video generation failed: ${operation.error.message}`);
        }

    } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') {
            onProgress("Video generation cancelled.");
        } else {
            console.error("Video generation failed:", e);
            onProgress("An error occurred during video generation.");
        }
        throw e;
    }

    onProgress("Video generated successfully.");
    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
        throw new Error("Video generation completed, but no download link was found.");
    }
    
    // In this context, we don't have usage stats for video, so we return empty.
    return { data: { videoUrl: downloadLink }, usage: emptyUsage() };
};

export const runFounderResearch = (founderName: string, modelMode: ModelMode): Promise<GeminiServiceResponse<{ summary: string | null }>> => {
    const systemInstruction = `You are a research assistant. Your task is to find professional information about a person online using Google Search and summarize it in a concise paragraph. Focus on their career, expertise, and accomplishments. If no relevant professional information is found, state that clearly.`;
    const userPrompt = `Find professional information about "${founderName}" and provide a summary.`;
    
    const runAndParse = async (): Promise<GeminiServiceResponse<{ summary: string | null }>> => {
         const modelName = getModel(modelMode);
         const response = await ai.models.generateContent({
            model: modelName, contents: userPrompt,
            config: { systemInstruction, temperature: 0.2, tools: [{ googleSearch: {} }] },
        });

        const text = response.text.trim();
        const usage: Usage = {
            input: response.usageMetadata?.promptTokenCount || 0,
            output: response.usageMetadata?.candidatesTokenCount || 0,
            total: response.usageMetadata?.totalTokenCount || 0
        };

        const summary = text.toLowerCase().includes("no professional information found") || text.toLowerCase().includes("could not find any professional information") ? null : text;
        return { data: { summary }, usage };
    };

    return runAndParse();
};

export const runFounderReportAnalysis = (founderName: string, reportText: string, modelMode: ModelMode): Promise<GeminiServiceResponse<FounderAnalysisProfile>> => {
    const systemInstruction = `You are an expert organizational psychologist and VC talent partner. Your task is to analyze a personality or strengths report for a startup founder.
Based on the text, you must:
1.  **Score Capabilities**: Rate the founder from 0.0 to 1.0 on four key startup capability clusters: 'vision_opportunity' (strategic thinking, market sense), 'execution_delivery' (getting things done, operational skill), 'people_culture' (leadership, team building), and 'depth_rigor' (analytical skill, deep thinking).
2.  **Score Role Fit**: Rate the founder's fit from 0.0 to 1.0 for five key startup roles: CEO, CTO, COO, CPO, and Head of People.
3.  **Write a Headline**: A short, powerful summary of the founder's archetype (e.g., "The Visionary Product-Led Founder").
4.  **Write a Summary**: A concise paragraph summarizing their profile.
5.  **List Top Strengths**: Identify their top 3-4 most prominent strengths.
6.  **List Watchouts**: Identify 2-3 potential risks or areas for development.
7.  **Give Advice**: Provide one piece of actionable advice for the founder.`
    const userPrompt = `Analyze the following report for the founder named "${founderName}":\n\n--- REPORT START ---\n${reportText}\n--- REPORT END ---`;

    const scoresSchema = { type: Type.NUMBER, description: "A score from 0.0 (low) to 1.0 (high)" };
    const schema = {
        type: Type.OBJECT, properties: {
            founder_name: { type: Type.STRING },
            capability_scores: { type: Type.OBJECT, properties: {
                vision_opportunity: scoresSchema, execution_delivery: scoresSchema,
                people_culture: scoresSchema, depth_rigor: scoresSchema
            }, required: ["vision_opportunity", "execution_delivery", "people_culture", "depth_rigor"]},
            role_fit: { type: Type.OBJECT, properties: {
                CEO: scoresSchema, CTO: scoresSchema, COO: scoresSchema,
                CPO: scoresSchema, Head_of_People: scoresSchema
            }, required: ["CEO", "CTO", "COO", "CPO", "Head_of_People"]},
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            top_strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            watchouts: { type: Type.ARRAY, items: { type: Type.STRING } },
            advice: { type: Type.STRING }
        }, required: ["founder_name", "capability_scores", "role_fit", "headline", "summary", "top_strengths", "watchouts", "advice"]
    };

    return callGeminiWithSchema("Founder Report Analyzer", systemInstruction, userPrompt, schema, modelMode);
};

// --- INTERACTIVE COMPONENTS ---
export const runCashFlowModel = (history: DeliverHistory, financialPlan: FinancialPlanningOutput, assumptions: CashFlowAssumptions, modelMode: ModelMode, strategicDirective: StrategicDirective): Promise<GeminiServiceResponse<CashFlowModelOutput>> => {
    const systemInstruction = `You are an AI financial modeler. You will receive a set of financial assumptions. Your task is to generate a complete 5-year cash flow model and calculate the final valuation metrics (Enterprise Value, NPV, IRR). Do not change the assumptions; simply perform the calculations based on the inputs provided.` + getDirectiveInstruction(strategicDirective);
    const userPrompt = `Venture Context:\n- Problem: ${history.problemStatement}\n- Solution: ${financialPlan.elevatorPitch}\n\nFinancial Assumptions:\n${JSON.stringify(assumptions, null, 2)}\n\nNow, generate the cash flow model and valuation based *only* on these assumptions.`;

    return callGeminiWithSchema<CashFlowModelOutput>("Cash Flow Modeler", systemInstruction, userPrompt, cashFlowModelSchema, modelMode);
};
