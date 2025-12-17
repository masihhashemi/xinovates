import { idbService } from './indexedDbService';
import { AgentRole, ModelMode, AgentTimingData } from '../types';

const AGENT_TIMINGS_STORE = 'agentTimings';

export const timingService = {
    recordAgentTime: async (role: AgentRole, modelMode: ModelMode, durationSeconds: number): Promise<void> => {
        try {
            const id = `${modelMode}-${role}`;
            const existingData = await idbService.getAgentTiming(id);
            
            if (existingData) {
                const newData: AgentTimingData = {
                    ...existingData,
                    totalDurationSeconds: existingData.totalDurationSeconds + durationSeconds,
                    runCount: existingData.runCount + 1,
                };
                await idbService.updateAgentTiming(newData);
            } else {
                const newData: AgentTimingData = {
                    id,
                    modelMode,
                    role,
                    totalDurationSeconds: durationSeconds,
                    runCount: 1,
                };
                await idbService.updateAgentTiming(newData);
            }
        } catch (e) {
            console.error("Failed to record agent timing:", e);
        }
    },

    getAverageTimePerAgent: async (modelMode: ModelMode): Promise<number | null> => {
        try {
            const allTimings = await idbService.getAllAgentTimings();
            const relevantTimings = allTimings.filter(t => t.modelMode === modelMode);
            
            if (relevantTimings.length === 0) {
                return null;
            }

            const totalDuration = relevantTimings.reduce((acc, t) => acc + t.totalDurationSeconds, 0);
            const totalRuns = relevantTimings.reduce((acc, t) => acc + t.runCount, 0);

            if (totalRuns === 0) {
                return null;
            }

            return totalDuration / totalRuns;
        } catch (e) {
            console.error("Failed to get average agent time:", e);
            return null;
        }
    },
    
    clearAllTimings: async (): Promise<void> => {
        try {
            await idbService.clearStore(AGENT_TIMINGS_STORE);
        } catch (e) {
            console.error("Failed to clear timings:", e);
        }
    }
};
