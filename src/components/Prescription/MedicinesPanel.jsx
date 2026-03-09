import React, { useState } from 'react';
import { ICONS } from './Icons'; // Adjust path
import { CHIPS_DATA } from '../../data/chips'; // Adjust path

export default function MedicinesPanel({ data, updateData, t }) {
  const [medInput, setMedInput] = useState({ name: '', dosage: '1-0-1', duration: '5 days', instruction: 'After meal' });

  const handleAddMedicine = () => {
    if (!medInput.name) return;
    updateData('medicines', [...data.medicines, medInput]);
    setMedInput({ name: '', dosage: '1-0-1', duration: '5 days', instruction: 'After meal' });
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="bg-slate-50 dark:bg-gray-700 p-4 rounded-lg border border-slate-200 dark:border-gray-600 mb-6 space-y-3 transition-colors">
        <input
          type="text"
          value={medInput.name}
          onChange={(e) => setMedInput({ ...medInput, name: e.target.value })}
          className="w-full p-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded text-sm dark:text-white focus:ring-1 focus:ring-cyan-500 outline-none font-medium transition-colors"
          placeholder={t.medName}
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={medInput.dosage}
            onChange={(e) => setMedInput({ ...medInput, dosage: e.target.value })}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded text-xs dark:text-white outline-none transition-colors"
            placeholder="1-0-1"
          />
          <input
            type="text"
            value={medInput.duration}
            onChange={(e) => setMedInput({ ...medInput, duration: e.target.value })}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded text-xs dark:text-white outline-none transition-colors"
            placeholder={t.duration}
          />
          <input
            type="text"
            value={medInput.instruction}
            onChange={(e) => setMedInput({ ...medInput, instruction: e.target.value })}
            className="w-full p-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded text-xs dark:text-white outline-none transition-colors"
            placeholder={t.instruction}
          />
        </div>
        <button
          onClick={handleAddMedicine}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-2 rounded text-sm font-semibold transition-colors"
        >
          {t.addMed}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">{t.addedMeds}</h3>
          <span className="text-xs text-slate-400 dark:text-gray-500">{data.medicines.length} items</span>
        </div>

        {data.medicines.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-gray-600 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-200 dark:border-gray-700">
            <ICONS.Pill size={32} className="mb-2 opacity-50" />
            <p className="text-xs">{t.noMeds}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {data.medicines.map((med, idx) => (
              <div key={idx} className="flex justify-between items-start p-3 bg-white dark:bg-gray-700 border border-slate-100 dark:border-gray-600 rounded-lg shadow-sm group transition-colors">
                <div>
                  <div className="font-bold text-slate-800 dark:text-gray-100 text-sm">{med.name}</div>
                  <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">{med.dosage} • {med.duration} • {med.instruction}</div>
                </div>
                <button
                  onClick={() => {
                    const newMeds = [...data.medicines];
                    newMeds.splice(idx, 1);
                    updateData('medicines', newMeds);
                  }}
                  className="text-slate-300 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <ICONS.Delete size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mt-6 mb-3">{t.suggestions}</h3>
        <div className="flex flex-wrap gap-2">
          {(CHIPS_DATA.medicines || []).map(med => (
            <button
              key={med}
              onClick={() => setMedInput({ ...medInput, name: med })}
              className="px-3 py-1.5 bg-slate-50 dark:bg-gray-700 hover:bg-slate-100 dark:hover:bg-gray-600 border border-slate-200 dark:border-gray-600 rounded-full text-xs text-slate-600 dark:text-gray-300 transition-colors"
            >
              {med}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}