import React from 'react';
import { Button } from '../Button';
import { PlusIcon } from '../Icons';

// Mock data
const apiGroups = [
    { id: 1, name: 'Web App Team', members: 5, createdAt: '2023-10-26' },
    { id: 2, name: 'Mobile App Devs', members: 3, createdAt: '2023-09-15' },
    { id: 3, name: 'Data Science Dept.', members: 8, createdAt: '2023-08-01' },
];

export const ApiGroupSettings: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">API Groups</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Organize members into groups to manage API access and permissions.
                    </p>
                </div>
                <Button variant="teal" className="gap-2 w-full sm:w-auto">
                    <PlusIcon className="w-5 h-5" />
                    Create New Group
                </Button>
            </div>

            <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Group Name</th>
                            <th scope="col" className="px-6 py-3">Members</th>
                            <th scope="col" className="px-6 py-3">Created At</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {apiGroups.map(group => (
                            <tr key={group.id} className="border-b dark:border-slate-700/50">
                                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{group.name}</td>
                                <td className="px-6 py-4">{group.members}</td>
                                <td className="px-6 py-4">{group.createdAt}</td>
                                <td className="px-6 py-4 text-right">
                                    <a href="#" className="font-medium text-teal-600 dark:text-teal-500 hover:underline">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};