import React from 'react';
import { ICONS } from '../../components/Prescription/Icons';
import { CHIPS_DATA } from '../../data/chips';

// Import your newly separated panels (Adjust paths as needed!)
import PatientPanel from './PatientPanel';
import VitalsPanel from './VitalsPanel';
import InvestigationsPanel from './InvestigationsPanel';
import MedicinesPanel from './MedicinesPanel';
import AdvicePanel from './AdvicePanel';
import InteractionsPanel from './InteractionsPanel';

// Shared Components used in the RightPanel (and inside some sub-panels)
export const ChipGroup = ({ items, selected = [], onToggle }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => {
      const isSelected = selected.includes(item);
      return (
        <button
          key={item}
          onClick={() => onToggle(item)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isSelected
            ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
            : 'bg-white dark:bg-gray-700 text-slate-600 dark:text-gray-300 border-slate-200 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
        >
          {item}
        </button>
      );
    })}
  </div>
);

export const TextArea = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full h-32 p-3 text-sm border border-slate-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none bg-slate-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
  />
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center gap-2 text-cyan-700 dark:text-cyan-400 bg-white dark:bg-gray-800 sticky top-0 z-10 transition-colors duration-300">
    <Icon size={20} />
    <h2 className="font-bold text-slate-800 dark:text-gray-100">{title}</h2>
  </div>
);

export default function RightPanel({ activeTab, data, updateData, language }) {
  // Translation Dictionary
  const dict = {
    EN: {
      fullName: 'Full Name', phone: 'Phone Number', age: 'Age', gender: 'Gender', select: 'Select', male: 'Male', female: 'Female', other: 'Other',
      newPatient: 'Save Patient', recentPatients: 'Recent / Matched Patients', noPatients: 'No recent patients found', searching: 'Searching...', searchResult: 'Search Results',
      weight: 'Weight (kg)', pulse: 'Pulse (bpm)', temp: 'Temp (°F)', height: 'Height (cm)',
      typeDetails: 'Type details...', quickPick: 'Quick Pick', customTest: 'Type custom test...',
      medName: 'Medicine Name (e.g. Napa)', duration: 'Duration', instruction: 'Instruction', addMed: 'Add Medicine',
      addedMeds: 'Added Medicines', noMeds: 'No medicines added yet', suggestions: 'Quick Suggestions',
      followUp: 'Follow Up', check: 'Check Interactions', checking: 'Checking...'
    },
    BN: {
      fullName: 'সম্পূর্ণ নাম', phone: 'ফোন নম্বর', age: 'বয়স', gender: 'লিঙ্গ', select: 'নির্বাচন করুন', male: 'পুরুষ', female: 'মহিলা', other: 'অন্যান্য',
      newPatient: 'রোগী সেভ করুন', recentPatients: 'সাম্প্রতিক / মিলে যাওয়া রোগী', noPatients: 'কোনো সাম্প্রতিক রোগী নেই', searching: 'খোঁজা হচ্ছে...', searchResult: 'অনুসন্ধানের ফলাফল',
      weight: 'ওজন (kg)', pulse: 'নাড়ি (bpm)', temp: 'তাপমাত্রা (°F)', height: 'উচ্চতা (cm)',
      typeDetails: 'বিস্তারিত লিখুন...', quickPick: 'কুইক পিক', customTest: 'টেস্টের নাম লিখুন...',
      medName: 'ওষুধের নাম (যেমন: নাপা)', duration: 'সময়কাল', instruction: 'নির্দেশনা', addMed: 'ওষুধ যোগ করুন',
      addedMeds: 'যোগ করা ওষুধ', noMeds: 'কোনো ওষুধ যোগ করা হয়নি', suggestions: 'পরামর্শ',
      followUp: 'ফলোআপ', check: 'ইন্টারঅ্যাকশন চেক করুন', checking: 'চেক করা হচ্ছে...'
    }
  };
  const t = dict[language] || dict.EN;

  const handleToggle = (field, value) => {
    const current = data[field] || [];
    const updated = current.includes(value)
      ? current.filter(i => i !== value)
      : [...current, value];
    updateData(field, updated);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patient':
        return <PatientPanel data={data} updateData={updateData} t={t} />;
      
      case 'vitals':
        return <VitalsPanel data={data} updateData={updateData} t={t} />;
      
      case 'investigations':
        return <InvestigationsPanel data={data} updateData={updateData} t={t} handleToggle={handleToggle} />;
      
      case 'medicines':
        return <MedicinesPanel data={data} updateData={updateData} t={t} />;
      
      case 'advice':
        return <AdvicePanel data={data} updateData={updateData} t={t} handleToggle={handleToggle} />;
      
      case 'interactions':
        return <InteractionsPanel data={data} t={t} />;
      
      // Grouping these together because they share the exact same Text + Chips layout
      case 'complaints':
      case 'history':
      case 'examination':
      case 'diagnosis':
        return (
          <div className="p-4 flex flex-col h-full">
            <div className="mb-4">
              <TextArea
                value={data[`${activeTab}Text`]}
                onChange={(val) => updateData(`${activeTab}Text`, val)}
                placeholder={t.typeDetails}
              />
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">{t.quickPick}</h3>
              <ChipGroup
                items={CHIPS_DATA[activeTab] || []}
                selected={data[activeTab]}
                onToggle={(item) => handleToggle(activeTab, item)}
              />
            </div>
          </div>
        );

      default:
        return <div className="p-4 text-slate-500">Select a tab</div>;
    }
  };

  const getIcon = () => {
    if (activeTab === 'interactions') return ICONS.Interactions;
    const key = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    return ICONS[key] || ICONS.Patient;
  };

  return (
    <aside className="w-96 bg-white dark:bg-gray-800 border-l border-slate-200 dark:border-gray-700 flex flex-col h-full shrink-0 shadow-xl shadow-slate-200/50 dark:shadow-none z-10 transition-colors duration-300">
      <SectionHeader
        icon={getIcon()}
        title={dict[language][activeTab] || activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </aside>
  );
}