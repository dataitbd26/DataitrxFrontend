import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './../../components/Prescription/Sidebar';
import PrescriptionPreview from './../../components/Prescription/PrescriptionPreview';
import RightPanel from './../../components/Prescription/RightPanel';
import { ICONS } from './../../components/Prescription/Icons';

// ✨ Import the hooks and context
import usePrescription from '../../Hook/usePrescription';
import useChamber from '../../Hook/useChamber';
import useDoctorProfile from '../../Hook/useDoctorProfile';
import { AuthContext } from '../../providers/AuthProvider';
import usePatient from '../../Hook/usePatient';

console.log("usePatient Hook Imported:", usePatient); // Debugging line to confirm import

export default function CreatePrescription() {
  const [activeTab, setActiveTab] = useState('patient');
  const [language, setLanguage] = useState('EN');

  // ✨ Get the branch and user (doctor) from AuthContext
  const { branch, user } = useContext(AuthContext);

  // ✨ Initialize the custom hooks
  const { createPrescription, loading: isSaving } = usePrescription();
  const { getChambersByBranch } = useChamber();
  const { getProfilesByBranch } = useDoctorProfile();

  // ✨ States for Dynamic Header & Routing
  const [chambers, setChambers] = useState([]);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const [prescriptionData, setPrescriptionData] = useState({
    patient: { name: '', age: '', gender: '', phone: '',  },
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

  // ✨ Fetch Doctor Profile and Chambers on Mount
  useEffect(() => {
    const fetchHeaderData = async () => {
      if (!branch) return;
      
      try {
        // Fire both requests concurrently for better performance
        const [profileRes, chamberRes] = await Promise.all([
          getProfilesByBranch(branch, { page: 1, limit: 1 }),
          getChambersByBranch(branch, { page: 1, limit: 50 })
        ]);

        // 1. Set Doctor Profile
        if (profileRes?.data && profileRes.data.length > 0) {
          setDoctorProfile(profileRes.data[0]); 
        }

        // 2. Set Chambers and default to the first one
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

  // ✨ The updated function that sends the data via the hook
  const handleSave = async () => {
    const { name, patientId } = prescriptionData.patient;
    if (!prescriptionData.patient.name) {
      alert("Patient name is required!");
      return;
    }

    // Safely extract the Doctor ID from either the fetched profile or the auth user
    const finalDoctorId = doctorProfile?._id || user?._id || user?.id;

    if (!branch || !finalDoctorId) {
      alert("Doctor or Branch information is missing. Please log in again.");
      return;
    }

    try {
      // ✨ FIX: Generate a unique prescriptionId to satisfy MongoDB's unique index
      // const uniquePrescriptionId = `RX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Construct the payload mapping exactly to your Mongoose schema
      const payload = {
        ...prescriptionData,
        // prescriptionId: uniquePrescriptionId, // ✨ Attached the unique ID here
        branch: branch,
        patientId: patientId,
        doctorId: finalDoctorId, // ✨ Safely attached the Doctor ID
        chamberId: selectedChamber?._id || null, // ✨ Attach the specific Chamber ID
        status: 'Completed' 
      };

      console.log("Sending data to backend:", payload);

      // 🔌 Call the post method from your hook
      await createPrescription(payload);

      alert("Prescription saved successfully!");

      // Optional: Clear the form or redirect the user here

    } catch (error) {
      console.error("Error saving prescription:", error);
      alert(error || "Failed to save prescription.");
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
          
          {/* ✨ Chamber Selector Dropdown */}
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
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          language={language}
          onSave={handleSave}
        />

        {/* Optional: Add a loading overlay while saving */}
        {isSaving && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <span className="text-cyan-600 font-bold flex items-center gap-2">
               <span className="loading loading-spinner loading-md"></span> Saving Prescription...
            </span>
          </div>
        )}

        {/* ✨ Pass the fetched doctor and chamber down to the preview */}
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