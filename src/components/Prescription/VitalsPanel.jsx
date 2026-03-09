import React from 'react';

export default function VitalsPanel({ data, updateData, t }) {
  return (
    <div className="p-4 space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">BP (mmHg)</label>
          <input
            type="text"
            value={data.vitals.bp}
            onChange={(e) => updateData('vitals', { ...data.vitals, bp: e.target.value })}
            className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
            placeholder="120/80"
          />
          <div className="flex gap-2 mt-2">
            {['120/80', '110/70', '130/90'].map(bp => (
              <button key={bp} onClick={() => updateData('vitals', { ...data.vitals, bp })} className="text-xs px-2 py-1 bg-slate-100 dark:bg-gray-700 rounded hover:bg-slate-200 dark:hover:bg-gray-600 text-slate-600 dark:text-gray-300 transition-colors">{bp}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.weight}</label>
          <input
            type="number"
            value={data.vitals.weight}
            onChange={(e) => updateData('vitals', { ...data.vitals, weight: e.target.value })}
            className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
            placeholder="70"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.pulse}</label>
            <input
              type="number"
              value={data.vitals.pulse}
              onChange={(e) => updateData('vitals', { ...data.vitals, pulse: e.target.value })}
              className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
              placeholder="72"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.temp}</label>
            <input
              type="number"
              value={data.vitals.temp}
              onChange={(e) => updateData('vitals', { ...data.vitals, temp: e.target.value })}
              className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
              placeholder="98.6"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.height}</label>
            <input
              type="number"
              value={data.vitals.height}
              onChange={(e) => updateData('vitals', { ...data.vitals, height: e.target.value })}
              className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
              placeholder="170"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">SpO2 (%)</label>
            <input
              type="number"
              value={data.vitals.spo2}
              onChange={(e) => updateData('vitals', { ...data.vitals, spo2: e.target.value })}
              className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
              placeholder="98"
            />
          </div>
        </div>
      </div>
    </div>
  );
}