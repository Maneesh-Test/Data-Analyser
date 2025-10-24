import React from 'react';
import { Button } from '../Button';
import { ChevronDownIcon, BarChart2Icon } from '../Icons';

// Mock Data
const kpiData = [
    { label: 'Total Requests', value: '1.25M', change: '+12.5%', isPositive: true },
    { label: 'Errors', value: '0.12%', change: '-2.1%', isPositive: true },
    { label: 'Avg. Latency', value: '128ms', change: '+5.3%', isPositive: false },
    { label: 'Successful Requests', value: '99.88%', change: '+2.1%', isPositive: true },
];

const modelUsageData = [
    { name: 'Gemini 2.5 Pro', requests: 450000, percentage: '36%' },
    { name: 'Gemini 2.5 Flash', requests: 625000, percentage: '50%' },
    { name: 'GPT-4o', requests: 125000, percentage: '10%' },
    { name: 'Claude 3.5 Sonnet', requests: 50000, percentage: '4%' },
];

export const ApiUsageSettings: React.FC = () => {
    return (
        <div className="max-w-6xl mx-auto p-8 md:p-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Usage Metrics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Monitor your API usage and performance.
                    </p>
                </div>
                <Button variant="secondary" className="gap-2 w-full sm:w-auto">
                    <span>Last 30 Days</span>
                    <ChevronDownIcon className="w-4 h-4" />
                </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {kpiData.map(kpi => (
                    <div key={kpi.label} className="bg-white dark:bg-slate-800/30 p-5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                        <p className="text-sm text-slate-500 dark:text-slate-400">{kpi.label}</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-1">{kpi.value}</p>
                        <p className={`text-xs mt-1 font-medium ${kpi.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>{kpi.change}</p>
                    </div>
                ))}
            </div>

            {/* Main Chart */}
            <div className="bg-white dark:bg-slate-800/30 p-6 rounded-lg border border-slate-200 dark:border-slate-700/50 mb-10">
                <h2 className="text-lg font-semibold mb-4">Total Requests</h2>
                <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500">
                    <BarChart2Icon className="w-12 h-12" />
                    <span className="ml-4">Chart visualization would be here</span>
                </div>
            </div>

            {/* Model Usage Breakdown */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Usage by Model</h2>
                <div className="bg-white dark:bg-slate-800/30 rounded-lg border border-slate-200 dark:border-slate-700/50">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-slate-500 dark:text-slate-400 uppercase">
                            <tr>
                                <th className="p-4">Model</th>
                                <th className="p-4 text-right">Requests</th>
                                <th className="p-4 text-right">Percentage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {modelUsageData.map(model => (
                                <tr key={model.name} className="border-t border-slate-200 dark:border-slate-700/50">
                                    <td className="p-4 font-medium">{model.name}</td>
                                    <td className="p-4 text-right font-mono">{model.requests.toLocaleString()}</td>
                                    <td className="p-4 text-right">{model.percentage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};