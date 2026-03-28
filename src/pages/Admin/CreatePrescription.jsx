import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './../../components/Prescription/Sidebar';
import PrescriptionPreview from './../../components/Prescription/PrescriptionPreview';
import RightPanel from './../../components/Prescription/RightPanel';
import { ICONS } from './../../components/Prescription/Icons';

// Hooks and context
import usePrescription from '../../Hook/usePrescription';
import useChamber from '../../Hook/useChamber';
import useDoctorProfile from '../../Hook/useDoctorProfile';
import { AuthContext } from '../../providers/AuthProvider';
import usePatient from '../../Hook/usePatient';

// Import the new PDF utility
import { generatePrescriptionPdf } from '../../components/utils/generatePrescriptionPdf';

export default function CreatePrescription() {
  const [activeTab, setActiveTab] = useState('patient');
  const [language, setLanguage] = useState('EN');
  const [isExporting, setIsExporting] = useState(false); // State for PDF loading

  const { branch, user } = useContext(AuthContext);
  const { createPrescription, loading: isSaving } = usePrescription();
  const { getChambersByBranch } = useChamber();
  const { getProfilesByBranch } = useDoctorProfile();

  const [chambers, setChambers] = useState([]);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const [prescriptionData, setPrescriptionData] = useState({
    patient: { name: '', age: '', gender: '', phone: '' },
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

  useEffect(() => {
    const fetchHeaderData = async () => {
      if (!branch) return;
      try {
        const [profileRes, chamberRes] = await Promise.all([
          getProfilesByBranch(branch, { page: 1, limit: 1 }),
          getChambersByBranch(branch, { page: 1, limit: 50 })
        ]);

        if (profileRes?.data && profileRes.data.length > 0) {
          setDoctorProfile(profileRes.data[0]);
        }

        if (chamberRes?.data && chamberRes.data.length > 0) {
          setChambers(chamberRes.data);
          setSelectedChamber(chamberRes.data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch data for prescription header:", err);
      }
    };

    fetchHeaderData();
  }, [branch, getProfilesByBranch, getChambersByBranch]);

  const updateData = (field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    const { name, patientId } = prescriptionData.patient;
    if (!prescriptionData.patient.name) {
      alert("Patient name is required!");
      return;
    }

    const finalDoctorId = doctorProfile?._id || user?._id || user?.id;

    if (!branch || !finalDoctorId) {
      alert("Doctor or Branch information is missing. Please log in again.");
      return;
    }

    try {
      const payload = {
        ...prescriptionData,
        branch: branch,
        patientId: patientId,
        doctorId: finalDoctorId,
        chamberId: selectedChamber?._id || null,
        status: 'Completed'
      };

      await createPrescription(payload);
      alert("Prescription saved successfully!");
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert(error || "Failed to save prescription.");
    }
  };

  // ✨ NEW: Handle Native Print
  const handlePrint = () => {
    window.print();
  };

  // ✨ NEW: Handle PDF Export
  const handleExportPdf = async () => {
    setIsExporting(true);
    // The ID matches the wrapper div in your PrescriptionPreview component
    await generatePrescriptionPdf('prescription-preview', prescriptionData.patient.name);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 rounded-lg shadow border border-slate-200 dark:border-gray-700 overflow-hidden font-sans transition-colors duration-300">

      {/* ✨ ADDED print:hidden so the header disappears when printing */}
      <header className="h-14 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-20 transition-colors duration-300 print:hidden">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-600 dark:text-gray-300">
            <ICONS.Menu size={20} />
          </button>
          <h1 className="font-bold text-lg text-slate-800 dark:text-gray-100">Create Prescription</h1>
        </div>

        <div className="flex items-center gap-3">
          {chambers.length > 0 && (
            <select
              className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={selectedChamber?._id || ''}
              onChange={(e) => {
                const selected = chambers.find(c => c._id === e.target.value);
                setSelectedChamber(selected);
              }}
            >
              {chambers.map(chamber => (
                <option key={chamber._id} value={chamber._id}>
                  {chamber.chamberName}
                </option>
              ))}
            </select>
          )}

          <div className="flex bg-slate-100 dark:bg-gray-700 p-1 rounded-lg transition-colors ml-2">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${language === 'EN'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white'
                }`}
            >EN</button>
            <button
              onClick={() => setLanguage('BN')}
              className={`px-3 py-1 text-xs font-bold rounded transition-all ${language === 'BN'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-500 dark:text-gray-300 hover:text-slate-700 dark:hover:text-white'
                }`}
            >BN</button>
          </div>

          <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-full transition-all">
            <ICONS.Close size={20} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* ✨ Passed handlePrint and handleExportPdf to Sidebar */}
      <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          onSave={handleSave}
          onPrint={handlePrint}
          onExportPdf={handleExportPdf}
          
         
          prescriptionData={prescriptionData}
          doctorProfile={doctorProfile}
          selectedChamber={selectedChamber}
        />

        {isSaving && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm print:hidden">
            <span className="text-cyan-600 font-bold flex items-center gap-2">
              <span className="loading loading-spinner loading-md"></span> Saving Prescription...
            </span>
          </div>
        )}

        {isExporting && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm print:hidden">
            <span className="text-cyan-600 font-bold flex items-center gap-2">
              <span className="loading loading-spinner loading-md"></span> Generating PDF...
            </span>
          </div>
        )}

        <PrescriptionPreview
          data={prescriptionData}
          language={language}
          doctor={doctorProfile}
          chamber={selectedChamber}
        />

        <RightPanel activeTab={activeTab} data={prescriptionData} updateData={updateData} language={language} />
      </div>
    </div>
  );
}