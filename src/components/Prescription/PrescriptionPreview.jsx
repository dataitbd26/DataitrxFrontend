import React from 'react';

export default function PrescriptionPreview({ data, language }) {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Translation Dictionary for the printed paper
  const dict = {
    EN: {
      name: 'Name', age: 'Age', gender: 'Gender', date: 'Date',
      vitals: 'Vitals', complaints: 'Chief Complaints', history: 'History',
      examination: 'On Examination', diagnosis: 'Diagnosis', investigations: 'Investigations',
      advice: 'Advice', followUp: 'Follow Up', reviewAfter: 'Review after',
      nextVisit: 'Next Visit', signature: 'Signature',
      placeholderRx: 'Add medicines from the right panel',
      placeholderInfo: 'Vital signs, chief complaint, history, examination, diagnosis & investigations will appear here'
    },
    BN: {
      name: 'নাম', age: 'বয়স', gender: 'লিঙ্গ', date: 'তারিখ',
      vitals: 'শারীরিক লক্ষণ', complaints: 'প্রধান সমস্যা', history: 'পূর্বের ইতিহাস',
      examination: 'শারীরিক পরীক্ষা', diagnosis: 'রোগ নির্ণয়', investigations: 'পরীক্ষা-নিরীক্ষা',
      advice: 'পরামর্শ', followUp: 'ফলোআপ', reviewAfter: 'সাক্ষাৎ',
      nextVisit: 'পরবর্তী সাক্ষাৎ', signature: 'স্বাক্ষর',
      placeholderRx: 'ডান দিকের প্যানেল থেকে ওষুধ যোগ করুন',
      placeholderInfo: 'শারীরিক লক্ষণ, প্রধান সমস্যা, ইতিহাস, পরীক্ষা ও রোগ নির্ণয় এখানে প্রদর্শিত হবে'
    }
  };
  const t = dict[language] || dict.EN;

  return (
    <div className="bg-slate-100 dark:bg-gray-900 flex-1 overflow-y-auto p-4 md:p-8 flex justify-center print:p-0 print:bg-white custom-scrollbar transition-colors duration-300">
      {/* The Paper itself - Force light mode styling so it always looks like a document */}
      <div id="prescription-preview" className="bg-white w-full max-w-[210mm] min-h-[297mm] shadow-lg p-10 flex flex-col relative print:shadow-none print:w-full print:h-full text-slate-900 mx-auto">

        {/* Header / Logo Area */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-lg uppercase text-xs font-bold text-slate-400 tracking-wider">
              LOGO
            </div>
            <div>
              <div className="h-5 w-48 bg-slate-100 rounded mb-2"></div>
              <div className="h-3 w-64 bg-slate-50 rounded"></div>
            </div>
          </div>
          <div className="text-right">
            <div className="h-4 w-32 bg-slate-100 rounded mb-1 ml-auto"></div>
            <div className="h-3 w-40 bg-slate-50 rounded ml-auto"></div>
          </div>
        </div>

        {/* Patient Info Bar */}
        <div className="border-y-2 border-slate-800 py-3 mb-6">
          <div className="grid grid-cols-4 gap-4 text-sm font-bold text-slate-900">
            <div className="flex gap-1 items-baseline">
              {t.name}: <span className="font-normal ml-1 border-b border-dotted border-slate-400 grow min-w-[50px]">{data.patient.name}</span>
            </div>
            <div className="flex gap-1 items-baseline">
              {t.age}: <span className="font-normal ml-1 border-b border-dotted border-slate-400 grow min-w-[30px]">{data.patient.age}</span>
            </div>
            <div className="flex gap-1 items-baseline">
              {t.gender}: <span className="font-normal ml-1 border-b border-dotted border-slate-400 grow min-w-[30px]">{data.patient.gender}</span>
            </div>
            <div className="flex gap-1 items-baseline justify-end">
              {t.date}: <span className="font-normal ml-1 text-slate-600">{today}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-8">
          {/* Left Column */}
          <div className="w-1/3 border-r border-slate-200 pr-6 flex flex-col gap-6">

            {/* Vitals */}
            {(data.vitals.bp || data.vitals.weight || data.vitals.pulse || data.vitals.temp) && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.vitals}</h4>
                <div className="space-y-1 text-slate-700">
                  {data.vitals.bp && <div>BP: {data.vitals.bp} mmHg</div>}
                  {data.vitals.pulse && <div>Pulse: {data.vitals.pulse} bpm</div>}
                  {data.vitals.temp && <div>Temp: {data.vitals.temp} °F</div>}
                  {data.vitals.weight && <div>Weight: {data.vitals.weight} kg</div>}
                  {data.vitals.height && <div>Height: {data.vitals.height} cm</div>}
                  {data.vitals.spo2 && <div>SpO2: {data.vitals.spo2} %</div>}
                </div>
              </div>
            )}

            {/* Chief Complaints */}
            {data.complaints.length > 0 && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.complaints}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {data.complaints.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            )}

            {/* History */}
            {data.history.length > 0 && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.history}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {data.history.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            )}

            {/* On Examination */}
            {data.examination.length > 0 && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.examination}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {data.examination.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </div>
            )}

            {/* Diagnosis */}
            {data.diagnosis.length > 0 && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.diagnosis}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {data.diagnosis.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </div>
            )}

            {/* Investigations */}
            {data.investigations.length > 0 && (
              <div className="text-sm">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.investigations}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                  {data.investigations.map((inv, i) => <li key={i}>{inv}</li>)}
                </ul>
              </div>
            )}

            {/* Placeholder if empty */}
            {!data.vitals.bp && data.complaints.length === 0 && data.history.length === 0 && data.examination.length === 0 && data.diagnosis.length === 0 && data.investigations.length === 0 && (
              <div className="text-xs text-slate-400 italic leading-relaxed mt-10">
                {t.placeholderInfo}
              </div>
            )}
          </div>

          {/* Right Column: Rx, Advice */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-serif font-bold text-slate-900">Rx</span>
            </div>

            {/* Medicines List */}
            {data.medicines.length > 0 ? (
              <div className="space-y-6 mb-8">
                {data.medicines.map((med, index) => (
                  <div key={index} className="text-sm text-slate-800">
                    <div className="font-bold text-base">{index + 1}. {med.name}</div>
                    <div className="text-slate-600 ml-4 mt-1">
                      {med.dosage} • {med.duration} • {med.instruction}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400 italic mb-8">
                {t.placeholderRx}
              </div>
            )}

            {/* Advice */}
            {data.advice.length > 0 && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="font-bold text-slate-900 mb-3 uppercase text-xs tracking-wider">{t.advice}</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  {data.advice.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            )}

            {/* Follow Up */}
            {data.followUp && (
              <div className="mt-6">
                <h4 className="font-bold text-slate-900 mb-2 uppercase text-xs tracking-wider">{t.followUp}</h4>
                <p className="text-slate-700">{t.reviewAfter} {data.followUp}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-slate-200 pt-8 flex justify-between items-end">
          <div className="text-sm font-bold flex items-baseline gap-2">
            {t.nextVisit}: <span className="w-32 border-b border-slate-400 inline-block"></span>
          </div>
          <div className="text-right">
            <div className="w-40 border-b border-slate-400 mb-2"></div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{t.signature}</div>
          </div>
        </div>
      </div>
    </div>
  );
}