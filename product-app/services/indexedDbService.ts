
import { SavedRun, User, AgentTimingData } from '../types';

const DB_NAME = 'XinovatesDB';
const DB_VERSION = 2;
const USERS_STORE = 'users';
const RUNS_STORE = 'runs';
const AGENT_TIMINGS_STORE = 'agentTimings';

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        if (db) {
            return resolve(db);
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', request.error);
            reject('IndexedDB error');
        };

        request.onsuccess = (event) => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const tempDb = request.result;
            if (!tempDb.objectStoreNames.contains(USERS_STORE)) {
                tempDb.createObjectStore(USERS_STORE, { keyPath: 'username' });
            }
            if (!tempDb.objectStoreNames.contains(RUNS_STORE)) {
                const runsStore = tempDb.createObjectStore(RUNS_STORE, { keyPath: 'id' });
                runsStore.createIndex('by_username', 'username', { unique: false });
            }
            if (!tempDb.objectStoreNames.contains(AGENT_TIMINGS_STORE)) {
                tempDb.createObjectStore(AGENT_TIMINGS_STORE, { keyPath: 'id' });
            }
        };
    });
};

export const idbService = {
    getUser: async (username: string): Promise<User | undefined> => {
        const db = await openDB();
        const store = db.transaction(USERS_STORE, 'readonly').objectStore(USERS_STORE);
        return new Promise((resolve, reject) => {
            const request = store.get(username.toLowerCase());
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    getAllUsers: async (): Promise<User[]> => {
        const db = await openDB();
        const store = db.transaction(USERS_STORE, 'readonly').objectStore(USERS_STORE);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    addUser: async (user: User): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(USERS_STORE, 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        store.add({ ...user, username: user.username.toLowerCase() });
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    updateUser: async (user: User): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(USERS_STORE, 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        store.put(user);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
    
    deleteUser: async (username: string): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(USERS_STORE, 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        store.delete(username.toLowerCase());
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
    
    incrementUserRunCount: async (username: string): Promise<number> => {
        const db = await openDB();
        const tx = db.transaction(USERS_STORE, 'readwrite');
        const store = tx.objectStore(USERS_STORE);
        const lowerUsername = username.toLowerCase();

        return new Promise((resolve, reject) => {
            const request = store.get(lowerUsername);
            request.onsuccess = () => {
                const user: User = request.result;
                if (!user) {
                    reject('User not found');
                    return;
                }
                
                // Initialize if missing (backward compatibility)
                if (typeof user.runCount === 'undefined') user.runCount = 0;
                if (typeof user.maxRuns === 'undefined') user.maxRuns = 5;

                // SECURITY: Enforce limit inside the transaction
                // Admins (maxRuns >= 10000) usually bypass this practically, 
                // but checking ensures robustness.
                if (user.runCount >= user.maxRuns) {
                    // Abort transaction implicitly by calling reject without putting
                    reject('Quota exceeded');
                    return; 
                }

                user.runCount += 1;
                const putRequest = store.put(user);
                putRequest.onsuccess = () => resolve(user.runCount);
                putRequest.onerror = () => reject(putRequest.error);
            };
            request.onerror = () => reject(request.error);
        });
    },
    
    getRuns: async (username: string): Promise<SavedRun[]> => {
        const db = await openDB();
        const store = db.transaction(RUNS_STORE, 'readonly').objectStore(RUNS_STORE);
        const index = store.index('by_username');
        return new Promise((resolve, reject) => {
            const request = index.getAll(username);
            request.onsuccess = () => {
                // Sort by savedAt descending
                const sortedRuns = request.result.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
                resolve(sortedRuns);
            };
            request.onerror = () => reject(request.error);
        });
    },
    
    addOrUpdateRun: async (run: SavedRun): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(RUNS_STORE, 'readwrite');
        const store = tx.objectStore(RUNS_STORE);
        store.put(run); // put will add or update
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },
    
    deleteRun: async (runId: string): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(RUNS_STORE, 'readwrite');
        const store = tx.objectStore(RUNS_STORE);
        store.delete(runId);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    // Agent Timing Methods
    getAgentTiming: async (id: string): Promise<AgentTimingData | undefined> => {
        const db = await openDB();
        const store = db.transaction(AGENT_TIMINGS_STORE, 'readonly').objectStore(AGENT_TIMINGS_STORE);
        return new Promise((resolve, reject) => {
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    getAllAgentTimings: async (): Promise<AgentTimingData[]> => {
        const db = await openDB();
        const store = db.transaction(AGENT_TIMINGS_STORE, 'readonly').objectStore(AGENT_TIMINGS_STORE);
        return new Promise((resolve, reject) => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    updateAgentTiming: async (data: AgentTimingData): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(AGENT_TIMINGS_STORE, 'readwrite');
        const store = tx.objectStore(AGENT_TIMINGS_STORE);
        store.put(data);
        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    },

    clearStore: async (storeName: string): Promise<void> => {
        const db = await openDB();
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
         return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
};

// Eagerly open the DB on module load.
openDB().catch(err => console.error("Failed to open IndexedDB on startup:", err));
