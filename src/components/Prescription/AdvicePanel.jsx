import React from 'react';
import { CHIPS_DATA } from '../../data/chips'; // Adjust path
import { TextArea, ChipGroup } from './RightPanel'; // Import from shared file

export default function AdvicePanel({ data, updateData, t, handleToggle }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <div className="mb-4">
        <TextArea
          value={data.adviceText}
          onChange={(val) => updateData('adviceText', val)}
          placeholder={t.typeDetails}
        />
      </div>

      <div className="mb-6 flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t.quickPick}</h3>
        <ChipGroup
          items={CHIPS_DATA.advice || []}
          selected={data.advice}
          onToggle={(item) => handleToggle('advice', item)}
        />
      </div>

      <div className="border-t border-slate-100 dark:border-gray-700 pt-6 transition-colors">
        <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t.followUp}</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={data.followUp}
            onChange={(e) => updateData('followUp', e.target.value)}
            className="flex-1 p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
            placeholder="e.g. 7 Days"
          />
          <div className="flex gap-1 flex-wrap">
            {['3 Days', '7 Days', '1 Month'].map(d => (
              <button
                key={d}
                onClick={() => updateData('followUp', d)}
                className="px-3 py-2 bg-slate-50 dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-xs font-medium hover:bg-slate-100 dark:hover:bg-gray-600 dark:text-gray-200 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}