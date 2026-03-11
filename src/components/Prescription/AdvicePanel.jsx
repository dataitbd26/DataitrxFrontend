import React, { useState } from 'react';
import { CHIPS_DATA } from '../../data/chips'; // Adjust path

export default function AdvicePanel({ data, updateData, t, handleToggle }) {
  // Track which input is active to show quick picks
  const [activeField, setActiveField] = useState(null);

  // Fallback chips just in case CHIPS_DATA.advice is empty/undefined
  const adviceChips = CHIPS_DATA?.advice || [
    'Rest', 'Drink fluids', 'Avoid oily food', 'Light diet', 'Exercise',
    'Monitor BP', 'Avoid cold water', 'Take rest for 3 days',
    'Follow up if symptoms persist', 'Avoid smoking'
  ];

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {/* Advice Text Area */}
      <div className="mb-6">
        <textarea
          value={data.adviceText || ''}
          onFocus={() => setActiveField('advice')}
          onBlur={() => setActiveField(null)}
          onChange={(e) => updateData('adviceText', e.target.value)}
          placeholder={t.typeDetails || "Lifestyle advice, dietary recommendations..."}
          className="w-full h-32 p-3 text-sm border border-slate-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none bg-slate-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
        />

        {/* Show Chips ONLY when Advice text area is active */}
        {activeField === 'advice' && (
          <div className="mt-3">
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              {t.quickPick || 'Quick Pick'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {adviceChips.map((item) => {
                const isSelected = data.advice?.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent textarea blur
                      handleToggle('advice', item);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Follow-up Section */}
      <div className="border-t border-dashed border-slate-200 dark:border-gray-700 pt-6 transition-colors">
        <label className="block text-sm text-slate-600 dark:text-gray-300 mb-2">
          {t.followUp }
        </label>

        <div className="flex flex-col gap-3">
          
          {/* Follow Up Input */}
          <div
            className={`flex items-center border bg-white dark:bg-gray-700 rounded-xl overflow-hidden transition-all ${
              activeField === 'followUp'
                ? 'border-sky-400 ring-2 ring-sky-100 dark:ring-sky-900'
                : 'border-slate-300 dark:border-gray-600'
            }`}
          >
            <input
              type="number"
              value={data.followUp || ''}
              onFocus={() => setActiveField('followUp')}
              onBlur={() => setActiveField(null)}
              onChange={(e) => updateData('followUp', e.target.value)}
              className="w-full p-2.5 bg-transparent text-sm text-slate-700 dark:text-white outline-none"
              placeholder="Value"
            />

            {/* NEW: Unit Selector */}
            <select
              value={data.followUpUnit || 'days'}
              onChange={(e) => updateData('followUpUnit', e.target.value)}
              className="bg-transparent text-sm px-2 outline-none text-slate-600 dark:text-gray-200"
            >
              <option value="days">Days</option>
              <option value="months">Months</option>
            </select>

            {/* Stepper Icons */}
            <div className="flex flex-col justify-center border-l border-slate-200 dark:border-gray-600 bg-slate-50 dark:bg-gray-600 px-1.5 py-1 min-h-[40px]">
              <svg className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
              </svg>
              <svg className="w-3.5 h-3.5 text-slate-500 cursor-pointer hover:text-slate-800 dark:hover:text-slate-200 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Quick Pick Buttons */}
          {activeField === 'followUp' && (
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 3, unit: 'days', label: '3 days' },
                { value: 7, unit: 'days', label: '7 days' },
                { value: 14, unit: 'days', label: '14 days' },
                { value: 30, unit: 'days', label: '30 days' },
                { value: 1, unit: 'months', label: '1 month' },
                { value: 3, unit: 'months', label: '3 months' }
              ].map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    updateData('followUp', d.value);
                    updateData('followUpUnit', d.unit);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-full text-xs text-slate-600 dark:text-gray-300 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}