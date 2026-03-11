import React, { useState } from 'react';
import Sidebar from './../../components/Prescription/Sidebar';
import PrescriptionPreview from './../../components/Prescription/PrescriptionPreview';
import RightPanel from './../../components/Prescription/RightPanel';
import { ICONS } from './../../components/Prescription/Icons';
import axios from 'axios';

export default function CreatePrescription() {
  const [activeTab, setActiveTab] = useState('patient');
  const [language, setLanguage] = useState('EN');

  const [prescriptionData, setPrescriptionData] = useState({
    patient: { name: '', age: '', gender: '' },
    vitals: { bp: '', weight: '', pulse: '', temp: '', height: '', spo2: '' },
    complaints: [],
    complaintsText: '',
    history: [],
    historyText: '',
    examination: [],
    examinationText: '',
    diagnosis: [],
    diagnosisText: '',
    investigations: [],
    medicines: [],
    advice: [],
    adviceText: '',
    followUp: ''
  });

  const updateData = (field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✨ The function that actually sends the data
  const handleSave = async () => {
    try {
      console.log("Sending data to database:", prescriptionData);
      
      // 🔌 Replace with your actual backend URL when ready
      // await axios.post('http://localhost:5000/api/prescriptions', prescriptionData);
      
      alert("Prescription saved successfully!");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 rounded-lg shadow border border-slate-200 dark:border-gray-700 overflow-hidden font-sans transition-colors duration-300">

      {/* Inner Header */}
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-20 transition-colors duration-300">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-600 dark:text-gray-300">
            <ICONS.Menu size={20} />
          </button>
          <h1 className="font-bold text-lg text-slate-800 dark:text-gray-100">Create Prescription</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-gray-700 p-1 rounded-lg transition-colors">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${language === 'EN'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white'
                }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('BN')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${language === 'BN'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white'
                }`}
            >
              BN
            </button>
          </div>

          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-full transition-all">
            <ICONS.Close size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ✨ Passed onSave={handleSave} down to the Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          language={language} 
          onSave={handleSave} 
        />
        <PrescriptionPreview data={prescriptionData} language={language} />
        <RightPanel activeTab={activeTab} data={prescriptionData} updateData={updateData} language={language} />
      </div>
    </div>
  );
}