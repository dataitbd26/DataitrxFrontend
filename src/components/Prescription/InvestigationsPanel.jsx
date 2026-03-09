import React from 'react';
import { ICONS } from './Icons'; // Adjust path
import { CHIPS_DATA } from '../../data/chips'; // Adjust path
import { ChipGroup } from './RightPanel'; // Import from shared file

export default function InvestigationsPanel({ data, updateData, t, handleToggle }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4 relative">
        <input
          type="text"
          className="w-full p-2.5 pl-9 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
          placeholder={t.customTest}
        />
        <ICONS.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t.quickPick}</h3>
        <ChipGroup
          items={CHIPS_DATA.investigations || []}
          selected={data.investigations}
          onToggle={(item) => handleToggle('investigations', item)}
        />
      </div>
    </div>
  );
}