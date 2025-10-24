import React from 'react';
import { Button } from '../Button';
import { CreditCardIcon, DownloadIcon } from '../Icons';

// Mock Data
const billingHistory = [
    { id: 'inv_12345', date: 'Oct 1, 2023', amount: '$50.00', status: 'Paid' },
    { id: 'inv_12344', date: 'Sep 1, 2023', amount: '$50.00', status: 'Paid' },
    { id: 'inv_12343', date: 'Aug 1, 2023', amount: '$50.00', status: 'Paid' },
];

export const ApiBillingSettings: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto p-8 md:p-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-10">API Billing</h1>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200">Current Plan</h2>
                    <p className="text-2xl font-bold text-teal-500 mt-2">Pro API Plan</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Up to 10M tokens / month</p>
                    <Button variant="secondary" className="w-full mt-4">Manage Plan</Button>
                </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-200">Current Usage</h2>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">1,254,830 tokens</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Your plan resets on Nov 1, 2023</p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                        <div className="bg-teal-500 h-2.5 rounded-full" style={{width: '12.5%'}}></div>
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Payment Method</h2>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <CreditCardIcon className="w-6 h-6 text-slate-500" />
                        <div>
                            <p className="font-medium">Visa ending in 1234</p>
                            <p className="text-sm text-slate-500">Expires 12/2025</p>
                        </div>
                    </div>
                    <Button variant="secondary" className="w-full sm:w-auto">Update</Button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Billing History</h2>
                 <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Invoice</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {billingHistory.map(invoice => (
                                <tr key={invoice.id} className="border-b dark:border-slate-700/50">
                                    <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{invoice.id}</td>
                                    <td className="px-6 py-4">{invoice.date}</td>
                                    <td className="px-6 py-4">{invoice.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="gap-1.5">
                                            <DownloadIcon className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};