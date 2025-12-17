
import { SavedRun, User, UserProfile } from '../types';
import { idbService } from './indexedDbService';

const USER_SESSION_KEY = 'xinovates_currentUser';

export const storageService = {
  // User Account Management
  getUser: async (username: string): Promise<User | undefined> => {
    try {
      const user = await idbService.getUser(username);
      if (user) {
          // Backward compatibility for existing users without these fields
          if (typeof user.runCount === 'undefined') user.runCount = 0;
          if (typeof user.maxRuns === 'undefined') user.maxRuns = 5;
      }
      return user;
    } catch (e) {
      console.error("IDB getUser failed:", e);
      return undefined;
    }
  },
  getAllUsers: async (): Promise<User[]> => {
      try {
          return await idbService.getAllUsers();
      } catch (e) {
          console.error("IDB getAllUsers failed:", e);
          return [];
      }
  },
  addUser: async (user: User): Promise<boolean> => {
    try {
      const existingUser = await idbService.getUser(user.username);
      if (existingUser) {
        return false; // User already exists
      }
      await idbService.addUser(user);
      return true;
    } catch (e) {
        console.error("IDB addUser failed:", e);
        return false;
    }
  },
  updateUser: async (user: User): Promise<void> => {
      try {
          await idbService.updateUser(user);
      } catch (e) {
          console.error("IDB updateUser failed:", e);
      }
  },
  deleteUser: async (username: string): Promise<void> => {
      try {
          await idbService.deleteUser(username);
      } catch (e) {
          console.error("IDB deleteUser failed:", e);
      }
  },
  
  incrementRunCount: async (username: string): Promise<number | null> => {
      try {
          return await idbService.incrementUserRunCount(username);
      } catch (e) {
          console.error("IDB incrementRunCount failed:", e);
          return null;
      }
  },
  
  // Session Management
  getCurrentUser: (): UserProfile | null => {
    try {
        const sessionJson = localStorage.getItem(USER_SESSION_KEY) || sessionStorage.getItem(USER_SESSION_KEY);
        return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (e) {
        console.error("Could not access web storage:", e);
        return null;
    }
  },
  setCurrentUser: (userProfile: UserProfile, rememberMe: boolean): void => {
    try {
        const sessionData = JSON.stringify(userProfile);
        if (rememberMe) {
            sessionStorage.removeItem(USER_SESSION_KEY);
            localStorage.setItem(USER_SESSION_KEY, sessionData);
        } else {
            localStorage.removeItem(USER_SESSION_KEY);
            sessionStorage.setItem(USER_SESSION_KEY, sessionData);
        }
    } catch (e) {
        console.error("Could not access web storage:", e);
    }
  },
  clearCurrentUser: (): void => {
    try {
        localStorage.removeItem(USER_SESSION_KEY);
        sessionStorage.removeItem(USER_SESSION_KEY);
    } catch (e) {
        console.error("Could not access web storage:", e);
    }
  },

  // Run Management
  getRuns: async (username: string): Promise<SavedRun[]> => {
    try {
        return await idbService.getRuns(username);
    } catch (e) {
        console.error("IDB getRuns failed:", e);
        return [];
    }
  },
  saveRun: async (run: SavedRun): Promise<void> => {
    try {
        await idbService.addOrUpdateRun(run);
    } catch (e) {
        console.error("IDB saveRun failed:", e);
        alert("Failed to save run. Your browser's storage might be full or disabled.");
    }
  },
  deleteRun: async (runId: string): Promise<void> => {
    try {
        await idbService.deleteRun(runId);
    } catch(e) {
        console.error("IDB deleteRun failed:", e);
    }
  },
};
