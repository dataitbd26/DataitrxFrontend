import React from 'react';
import { ICONS } from './Icons';
import { FileText } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, language }) {
  // Simple translation map for the sidebar
  const dict = {
    EN: {
      patient: 'Patient', vitals: 'Vital Signs', complaints: 'Chief Complaints',
      history: 'History Of', examination: 'On Examination', diagnosis: 'Diagnosis',
      investigations: 'Investigations', medicines: 'Medicines (Rx)', advice: 'Advice & Follow-up',
      interactions: 'Interactions', save: 'Save', print: 'Print', share: 'Share', template: 'Template'
    },
    BN: {
      patient: 'রোগী', vitals: 'শারীরিক লক্ষণ', complaints: 'প্রধান সমস্যা',
      history: 'পূর্বের ইতিহাস', examination: 'শারীরিক পরীক্ষা', diagnosis: 'রোগ নির্ণয়',
      investigations: 'পরীক্ষা-নিরীক্ষা', medicines: 'ওষুধ (Rx)', advice: 'পরামর্শ ও ফলোআপ',
      interactions: 'ড্রাগ ইন্টারেকশন', save: 'সেভ করুন', print: 'প্রিন্ট', share: 'শেয়ার', template: 'টেমপ্লেট'
    }
  };

  const t = dict[language] || dict.EN;

  const menuItems = [
    { id: 'patient', label: t.patient, icon: ICONS.Patient },
    { id: 'vitals', label: t.vitals, icon: ICONS.Vitals },
    { id: 'complaints', label: t.complaints, icon: ICONS.Complaints },
    { id: 'history', label: t.history, icon: ICONS.History },
    { id: 'examination', label: t.examination, icon: ICONS.Examination },
    { id: 'diagnosis', label: t.diagnosis, icon: ICONS.Diagnosis },
    { id: 'investigations', label: t.investigations, icon: ICONS.Investigations },
    { id: 'medicines', label: t.medicines, icon: ICONS.Medicines },
    { id: 'advice', label: t.advice, icon: ICONS.Advice },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 flex flex-col h-full shrink-0 transition-colors duration-300">
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700'
                  }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}

          <div className="mt-4 px-1">
            <button
              onClick={() => setActiveTab('interactions')}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors ${activeTab === 'interactions'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/40'
                }`}
            >
              <div className="flex items-center gap-2">
                <ICONS.Interactions size={18} />
                <span className="text-sm font-semibold">{t.interactions}</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeTab === 'interactions' ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'
                }`}>AI</span>
            </button>
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-gray-700 space-y-3 bg-white dark:bg-gray-800 transition-colors duration-300">
        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all shadow-sm">
          <ICONS.Save size={18} />
          {t.save}
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 transition-colors"
          >
            <ICONS.Print size={16} /> {t.print}
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 transition-colors">
            <FileText size={16} /> PDF
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 transition-colors">
            <ICONS.Share size={16} /> {t.share}
          </button>
          <button className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold border border-slate-200 dark:border-gray-600 hover:bg-slate-50 dark:hover:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 transition-colors">
            <ICONS.Template size={16} /> {t.template}
          </button>
        </div>
      </div>
    </aside>
  );
}