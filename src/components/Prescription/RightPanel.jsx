import React, { useState } from 'react';
import { ICONS } from '../../components/Prescription/Icons';
import { CHIPS_DATA } from '../../data/chips';
import { checkInteractions } from '../../services/gemini';

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="p-4 border-b border-slate-100 dark:border-gray-700 flex items-center gap-2 text-cyan-700 dark:text-cyan-400 bg-white dark:bg-gray-800 sticky top-0 z-10 transition-colors duration-300">
    <Icon size={20} />
    <h2 className="font-bold text-slate-800 dark:text-gray-100">{title}</h2>
  </div>
);

const ChipGroup = ({ items, selected = [], onToggle }) => (
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

const TextArea = ({ value, onChange, placeholder }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full h-32 p-3 text-sm border border-slate-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none resize-none bg-slate-50 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors"
  />
);

export default function RightPanel({ activeTab, data, updateData, language }) {
  const [medInput, setMedInput] = useState({ name: '', dosage: '1-0-1', duration: '5 days', instruction: 'After meal' });
  const [interactionResult, setInteractionResult] = useState('');
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(false);

  // Translation Dictionary
  const dict = {
    EN: {
      fullName: 'Full Name', age: 'Age', gender: 'Gender', select: 'Select', male: 'Male', female: 'Female', other: 'Other',
      newPatient: 'New Patient', recentPatients: 'Recent Patients', noPatients: 'No recent patients found',
      weight: 'Weight (kg)', pulse: 'Pulse (bpm)', temp: 'Temp (°F)', height: 'Height (cm)',
      typeDetails: 'Type details...', quickPick: 'Quick Pick', customTest: 'Type custom test...',
      medName: 'Medicine Name (e.g. Napa)', duration: 'Duration', instruction: 'Instruction', addMed: 'Add Medicine',
      addedMeds: 'Added Medicines', noMeds: 'No medicines added yet', suggestions: 'Quick Suggestions',
      followUp: 'Follow Up', check: 'Check Interactions', checking: 'Checking...'
    },
    BN: {
      fullName: 'সম্পূর্ণ নাম', age: 'বয়স', gender: 'লিঙ্গ', select: 'নির্বাচন করুন', male: 'পুরুষ', female: 'মহিলা', other: 'অন্যান্য',
      newPatient: 'নতুন রোগী', recentPatients: 'সাম্প্রতিক রোগী', noPatients: 'কোনো সাম্প্রতিক রোগী নেই',
      weight: 'ওজন (kg)', pulse: 'নাড়ি (bpm)', temp: 'তাপমাত্রা (°F)', height: 'উচ্চতা (cm)',
      typeDetails: 'বিস্তারিত লিখুন...', quickPick: 'কুইক পিক', customTest: 'টেস্টের নাম লিখুন...',
      medName: 'ওষুধের নাম (যেমন: নাপা)', duration: 'সময়কাল', instruction: 'নির্দেশনা', addMed: 'ওষুধ যোগ করুন',
      addedMeds: 'যোগ করা ওষুধ', noMeds: 'কোনো ওষুধ যোগ করা হয়নি', suggestions: 'পরামর্শ',
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

  const handleAddMedicine = () => {
    if (!medInput.name) return;
    updateData('medicines', [...data.medicines, medInput]);
    setMedInput({ name: '', dosage: '1-0-1', duration: '5 days', instruction: 'After meal' });
  };

  const handleCheckInteractions = async () => {
    setIsLoadingInteractions(true);
    setInteractionResult('');
    const result = await checkInteractions(data.medicines, data.patient);
    setInteractionResult(result);
    setIsLoadingInteractions(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patient':
        return (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.fullName}</label>
                <input
                  type="text"
                  value={data.patient.name}
                  onChange={(e) => updateData('patient', { ...data.patient, name: e.target.value })}
                  className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.age}</label>
                  <input
                    type="text"
                    value={data.patient.age}
                    onChange={(e) => updateData('patient', { ...data.patient, age: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
                    placeholder="30 Y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-gray-400 mb-1.5">{t.gender}</label>
                  <select
                    value={data.patient.gender}
                    onChange={(e) => updateData('patient', { ...data.patient, gender: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
                  >
                    <option value="">{t.select}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-sm font-medium text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700 transition-all group">
              <ICONS.Plus size={18} className="group-hover:scale-110 transition-transform" />
              {t.newPatient}
            </button>

            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-4">{t.recentPatients}</h3>
              <div className="flex flex-col items-center justify-center py-12 text-slate-300 dark:text-gray-500 bg-slate-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-slate-200 dark:border-gray-700">
                <ICONS.History size={32} className="mb-2 opacity-50" />
                <p className="text-xs">{t.noPatients}</p>
              </div>
            </div>
          </div>
        );

      case 'vitals':
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

      case 'investigations':
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

      case 'medicines':
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

      case 'advice':
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

      case 'interactions':
        return (
          <div className="p-4 flex flex-col h-full">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 rounded-lg p-4 mb-6 transition-colors">
              <div className="flex items-start gap-3">
                <ICONS.Info className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-amber-800 dark:text-amber-500 mb-1">Drug Interaction Checker</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-200/70 leading-relaxed">
                    This AI-powered tool checks for potential interactions between prescribed medicines and patient's existing conditions.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
              <div>
                <h3 className="text-xs font-bold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2">Prescription Medicines ({data.medicines.length})</h3>
                {data.medicines.length === 0 ? (
                  <div className="text-xs text-slate-400 dark:text-gray-500 italic p-4 border border-dashed border-slate-200 dark:border-gray-700 rounded-lg text-center">
                    {t.noMeds}
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {data.medicines.map((m, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-gray-300 flex items-center gap-2">
                        <ICONS.Pill size={14} className="text-slate-400 dark:text-gray-500" />
                        {m.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {interactionResult && (
                <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg shadow-sm transition-colors">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-gray-100 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <ICONS.ShieldAlert size={14} className="text-amber-500" />
                    Analysis Result
                  </h3>
                  <div className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {interactionResult}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckInteractions}
              disabled={isLoadingInteractions || data.medicines.length === 0}
              className={`w-full py-3 rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-auto ${isLoadingInteractions || data.medicines.length === 0
                ? 'bg-slate-100 dark:bg-gray-700 text-slate-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
            >
              {isLoadingInteractions ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.checking}
                </>
              ) : (
                <>
                  <ICONS.ShieldAlert size={18} />
                  {t.check}
                </>
              )}
            </button>
          </div>
        );

      default:
        return <div className="p-4">Select a tab</div>;
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
        // Automatically translate the section title if it matches a dictionary key
        title={dict[language][activeTab] || activeTab.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </div>
    </aside>
  );
}