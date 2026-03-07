import React from 'react';

const PrescriptionTemplate = () => {
    return (
        <div className="p-4 md:p-6 bg-slate-50 dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-gray-100">Prescription Templates</h1>
                        <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Manage and create reusable prescription templates.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-slate-200 dark:border-gray-700 p-6">
                    <div className="text-center py-12">
                        <p className="text-slate-500 dark:text-gray-400">Prescription Templates coming soon.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionTemplate;
