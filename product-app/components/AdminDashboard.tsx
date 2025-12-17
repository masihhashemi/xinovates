
import React, { useEffect, useState } from 'react';
import { User, UserStatus } from '../types';
import { storageService } from '../services/storageService';
import { XMarkIcon, ShieldCheckIcon, UsersIcon, CheckCircleIcon, TrashIcon, ExclamationTriangleIcon } from './Icons';

interface AdminDashboardProps {
    onClose: () => void;
    currentUser: User | null; // Pass full User object if possible, or just username
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose, currentUser }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        const allUsers = await storageService.getAllUsers();
        setUsers(allUsers);
        setIsLoading(false);
    };

    const handleToggleStatus = async (user: User) => {
        const newStatus: UserStatus = user.status === 'active' ? 'pending' : 'active';
        const updatedUser: User = { ...user, status: newStatus };
        await storageService.updateUser(updatedUser);
        setUsers(prev => prev.map(u => u.username === user.username ? updatedUser : u));
    };

    const handleUpdateQuota = async (user: User, newMax: number) => {
        const updatedUser: User = { ...user, maxRuns: newMax };
        await storageService.updateUser(updatedUser);
        setUsers(prev => prev.map(u => u.username === user.username ? updatedUser : u));
    };

    const handleDeleteUser = async (username: string) => {
        if (confirm(`Are you sure you want to delete user ${username}? This action cannot be undone.`)) {
            await storageService.deleteUser(username);
            setUsers(prev => prev.filter(u => u.username !== username));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col animate-fade-in"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-900/50 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="w-6 h-6 text-yellow-400" />
                        <h2 className="text-xl font-bold text-white">Admin Dashboard</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6"/>
                    </button>
                </header>

                <div className="p-6 overflow-y-auto flex-grow bg-black/20 text-gray-300">
                    <div className="mb-4 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-semibold text-white">User Management</h3>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-10">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto rounded-lg border border-gray-700">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-gray-700/50 text-xs uppercase text-gray-200">
                                    <tr>
                                        <th className="px-4 py-3">Username / Display Name</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Usage</th>
                                        <th className="px-4 py-3">Quota (Max Runs)</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {users.map(user => (
                                        <tr key={user.username} className="hover:bg-gray-700/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-white">{user.displayName}</div>
                                                <div className="text-xs text-gray-500">{user.username}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.status === 'active' ? (
                                                    <span className="flex items-center gap-1 text-green-400">
                                                        <CheckCircleIcon className="w-4 h-4" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-yellow-400">
                                                        <ExclamationTriangleIcon className="w-4 h-4" /> Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.runCount} Runs
                                            </td>
                                            <td className="px-4 py-3">
                                                <input 
                                                    type="number" 
                                                    value={user.maxRuns} 
                                                    onChange={(e) => handleUpdateQuota(user, parseInt(e.target.value))}
                                                    className="w-20 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-white focus:outline-none focus:border-blue-500"
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.role !== 'admin' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleToggleStatus(user)}
                                                                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                                                                    user.status === 'active' 
                                                                        ? 'bg-yellow-600/80 hover:bg-yellow-600 text-white' 
                                                                        : 'bg-green-600/80 hover:bg-green-600 text-white'
                                                                }`}
                                                            >
                                                                {user.status === 'active' ? 'Suspend' : 'Approve'}
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDeleteUser(user.username)}
                                                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
