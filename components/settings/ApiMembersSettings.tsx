import React from 'react';
import { Button } from '../Button';
import { PlusIcon } from '../Icons';

// Mock data
const members = [
    { id: 1, name: 'Priya Sharma', email: 'priya@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Rohan Mehta', email: 'rohan@example.com', role: 'Developer', status: 'Active' },
    { id: 3, name: 'Arjun Desai', email: 'arjun@example.com', role: 'Developer', status: 'Pending' },
    { id: 4, name: 'Guest User', email: 'guest@example.com', role: 'Read-Only', status: 'Active' },
];

export const ApiMembersSettings: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">API Members</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Invite and manage members of your API groups.
                    </p>
                </div>
                <Button variant="teal" className="gap-2 w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    Invite Member
                </Button>
            </div>
            
            <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50 overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Role</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map(member => (
                            <tr key={member.id} className="border-b dark:border-slate-700/50">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{member.name}</div>
                                    <div className="text-slate-500">{member.email}</div>
                                </td>
                                <td className="px-6 py-4">{member.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                        member.status === 'Active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                    }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                     <a href="#" className="font-medium text-teal-600 dark:text-teal-500 hover:underline">Manage</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};