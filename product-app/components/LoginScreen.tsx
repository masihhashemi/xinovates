
import React, { useState } from 'react';
import { XinovatesAvatar, KeyIcon } from './Icons';
import { storageService } from '../services/storageService';
import { hashPassword } from '../services/authService';
import Spinner from './Spinner';
import { APP_VERSION } from '../constants';
import VersionHistoryModal from './VersionHistoryModal';
import { User, UserProfile } from '../types';

interface LoginScreenProps {
    onLogin: (userProfile: UserProfile, rememberMe: boolean) => void;
    isTransitioning: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isTransitioning }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
    
    // Access Code State
    const [showCodeInput, setShowCodeInput] = useState(false);
    const [accessCode, setAccessCode] = useState('');

    // STRICT ADMIN LIST
    const ADMIN_EMAILS = [
        'rezakalantarinezhad@gmail.com',
        'masihhashemi1383@gmail.com',
        'reza.kalantarinejad@xinovates.co.uk'
    ];
    
    // Shared Admin Password
    const ADMIN_PASSWORD = 'Xinovates@1211';
    const VIP_ACCESS_CODE = 'Xinovate@#366';

    const resetForm = () => {
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        setRememberMe(true);
        setError(null);
        setIsLoading(false);
        setShowCodeInput(false);
        setAccessCode('');
    }

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        resetForm();
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        
        const usernameLower = username.toLowerCase().trim();

        // 1. Special Admin Login Logic
        // If the email is in the admin list, we check against the hardcoded ADMIN_PASSWORD.
        // If it matches, we FORCE update the user account to be 'admin' and 'active'.
        if (ADMIN_EMAILS.includes(usernameLower)) {
            const adminPasswordHash = await hashPassword(ADMIN_PASSWORD);
            const enteredPasswordHash = await hashPassword(password);

            if (enteredPasswordHash === adminPasswordHash) {
                // User entered the correct Master Admin Password
                let adminUser = await storageService.getUser(usernameLower);
                
                const updatedAdminUser: User = {
                    username: usernameLower,
                    passwordHash: adminPasswordHash,
                    authMethod: 'local',
                    role: 'admin',     // Enforce Admin Role
                    status: 'active',  // Enforce Active Status
                    displayName: adminUser?.displayName || 'Admin',
                    runCount: adminUser?.runCount || 0,
                    maxRuns: 10000     // High limit for admins
                };

                // Update or Create the record
                if (adminUser) {
                    await storageService.updateUser(updatedAdminUser);
                } else {
                    await storageService.addUser(updatedAdminUser);
                }

                // Log in immediately
                const { passwordHash, ...userProfile } = updatedAdminUser;
                onLogin(userProfile, rememberMe);
                return;
            } else {
                // Security Measure: If it's a reserved admin email but wrong admin password,
                // we BLOCK access even if they have a 'user' password stored.
                // This prevents squatters from taking the admin email addresses.
                setError("Invalid Admin Password. This email is reserved for administrators.");
                setIsLoading(false);
                return;
            }
        }

        // 2. Standard User Login Logic
        const user = await storageService.getUser(usernameLower);
        if (!user) {
            setError("User does not exist. Please sign up.");
            setIsLoading(false);
            return;
        }
        
        const enteredPasswordHash = await hashPassword(password);
        if (enteredPasswordHash !== user.passwordHash) {
            setError("Invalid password.");
            setIsLoading(false);
            return;
        }
        
        const { passwordHash, ...userProfile } = user;
        onLogin(userProfile, rememberMe);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        
        const usernameLower = username.toLowerCase().trim();

        // SECURITY: Prevent signing up with a reserved admin email using a standard password
        if (ADMIN_EMAILS.includes(usernameLower)) {
            setError("This email is reserved for administrators. Please log in directly with the Admin password.");
            return;
        }
        
        setIsLoading(true);

        if (await storageService.getUser(usernameLower)) {
            setError("Username is already taken.");
            setIsLoading(false);
            return;
        }

        const passwordHash = await hashPassword(password);
        const newUser: User = {
            username: usernameLower,
            passwordHash,
            authMethod: 'local',
            role: 'user',
            status: 'pending', // SECURITY: Force pending status
            displayName: username,
            runCount: 0,
            maxRuns: 1 
        };
        const success = await storageService.addUser(newUser);

        if (success) {
            const { passwordHash, ...userProfile } = newUser;
            onLogin(userProfile, rememberMe);
        } else {
            setError("Failed to create user. Please try again.");
            setIsLoading(false);
        }
    };
    
    const handleCodeAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        if (accessCode !== VIP_ACCESS_CODE) {
            setError("Invalid access code.");
            return;
        }

        setIsLoading(true);
        const vipUsername = 'vip_innovator';
        
        // Ensure VIP user exists locally
        let vipUser = await storageService.getUser(vipUsername);
        if (!vipUser) {
             // Create a dummy password hash
             const passwordHash = await hashPassword(VIP_ACCESS_CODE);
             const newVipUser: User = {
                username: vipUsername,
                passwordHash,
                authMethod: 'local',
                role: 'user',
                status: 'active',
                displayName: 'VIP Access',
                runCount: 0,
                maxRuns: 99999 // Unlimited
             };
             await storageService.addUser(newVipUser);
             vipUser = newVipUser;
        }
        
        const { passwordHash, ...userProfile } = vipUser;
        onLogin(userProfile, false); 
    };

    const formTitle = isLoginView ? 'Login to Your Venture' : 'Create a New Profile';
    const formSubtitle = isLoginView 
        ? 'Enter your credentials to access your saved innovation runs.' 
        : 'Sign up to save your innovation runs and track your progress.';
        
    const isFormDisabled = isLoading || isTransitioning;

    return (
        <div className="min-h-screen flex flex-col p-4">
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-4">
                        <XinovatesAvatar className="w-16 h-16" />
                        <h1 className="text-5xl sm:text-6xl font-bold">
                           <span className="text-transparent bg-clip-text logo-text-x-grad">X</span>
                           <span className="text-white">inovates</span>
                        </h1>
                    </div>
                    <p className="mt-3 text-lg text-gray-400">Your AI Co-Founder for turning ideas into ventures.</p>
                    <button onClick={() => setShowVersionHistoryModal(true)} className="mt-2 text-sm text-gray-500 hover:text-gray-300 hover:underline transition-colors">v{APP_VERSION}</button>
                </div>
                
                <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border themed-border">
                    <form onSubmit={isLoginView ? handleLogin : handleSignUp}>
                        <h2 className="text-2xl font-semibold text-white mb-2 text-center">{formTitle}</h2>
                        <p className="text-gray-400 text-sm mb-6 text-center">{formSubtitle}</p>
                        
                        {error && <p className="bg-red-900/50 border border-red-500/50 text-red-300 text-sm text-center p-3 rounded-lg mb-4">{error}</p>}

                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                                {isLoginView ? 'Username or Email' : 'Username'}
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g., innovator24"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                                required
                                disabled={isFormDisabled}
                                aria-label="Username"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                                required
                                disabled={isFormDisabled}
                                aria-label="Password"
                            />
                        </div>

                        {!isLoginView && (
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none transition-all duration-300 text-gray-200 placeholder-gray-500"
                                    required
                                    disabled={isFormDisabled}
                                    aria-label="Confirm Password"
                                />
                            </div>
                        )}
                        
                        <div className="my-6">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isFormDisabled}
                                    className="h-4 w-4 rounded border-gray-500 bg-gray-700 text-blue-500 themed-focus-ring focus:ring-offset-gray-800"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-300">Stay logged in</span>
                            </label>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isFormDisabled || !username.trim() || !password.trim()}
                            className="w-full px-8 py-3 primary-button text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        >
                            {isLoading && !isTransitioning ? <Spinner/> : (isLoginView ? 'Login' : 'Sign Up')}
                        </button>
                    </form>

                    <div className="mt-6 flex flex-col items-center gap-4 border-t border-gray-700 pt-6">
                        {!showCodeInput ? (
                            <button
                                type="button"
                                onClick={() => setShowCodeInput(true)}
                                disabled={isFormDisabled}
                                className="w-full max-w-[320px] px-8 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <KeyIcon className="w-4 h-4" />
                                Have an Access Code?
                            </button>
                        ) : (
                            <form onSubmit={handleCodeAccess} className="w-full max-w-[320px] animate-fade-in">
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value)}
                                        placeholder="Enter Access Code"
                                        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 themed-focus-ring focus:outline-none text-white placeholder-gray-500 text-sm"
                                        disabled={isFormDisabled}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isFormDisabled || !accessCode.trim()}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors"
                                    >
                                        Go
                                    </button>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setShowCodeInput(false)} 
                                    className="text-xs text-gray-500 mt-2 hover:text-gray-300 block w-full text-center"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        {isLoginView ? "Don't have a profile?" : "Already have a profile?"}
                        <button type="button" onClick={toggleView} disabled={isFormDisabled} className="font-semibold text-blue-400 hover:text-blue-300 ml-2 focus:outline-none disabled:opacity-50">
                            {isLoginView ? 'Sign Up' : 'Login'}
                        </button>
                    </p>
                </div>
            </main>
             <footer className="w-full text-center py-4 text-gray-500 text-xs flex-shrink-0">
                <p>© {new Date().getFullYear()} Reza Kalantarinejad & Marc J Ventresca</p>
                <p>Saïd Business School, University of Oxford</p>
            </footer>
            {showVersionHistoryModal && <VersionHistoryModal onClose={() => setShowVersionHistoryModal(false)} />}
        </div>
    );
};

export default LoginScreen;
