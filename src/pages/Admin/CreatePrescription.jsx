import React, { useState, useEffect, useContext } from 'react';
import Sidebar from './../../components/Prescription/Sidebar';
import PrescriptionPreview from './../../components/Prescription/PrescriptionPreview';
import RightPanel from './../../components/Prescription/RightPanel';
import { ICONS } from './../../components/Prescription/Icons';
import { useLocation } from 'react-router-dom';

// Hooks and context
import usePrescription from '../../Hook/usePrescription';
import useChamber from '../../Hook/useChamber';
import useDoctorProfile from '../../Hook/useDoctorProfile';
import { AuthContext } from '../../providers/AuthProvider';
import usePatient from '../../Hook/usePatient';

// Import the new PDF utility and Modal
import { generatePrescriptionPdf } from '../../components/utils/generatePrescriptionPdf';
import AppointmentViewModal from '../../components/modal/AppointmentViewModal'; // 👈 IMPORTED MODAL

export default function CreatePrescription() {
  const location = useLocation(); 
  const incomingAppointment = location.state?.appointmentData; 

  const [activeTab, setActiveTab] = useState('patient');
  const [language, setLanguage] = useState('EN');
  const [isExporting, setIsExporting] = useState(false); 
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // 👈 MODAL STATE

  const { branch, user } = useContext(AuthContext);
  const { createPrescription, loading: isSaving } = usePrescription();
  const { getChambersByBranch } = useChamber();
  const { getProfilesByBranch } = useDoctorProfile();

  const [chambers, setChambers] = useState([]);
  const [selectedChamber, setSelectedChamber] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);

  const [prescriptionData, setPrescriptionData] = useState({
    patient: { name: '', age: '', gender: '', phone: '', patientId: '' }, 
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

  // 👇 PRE-CHECKUP CONDITIONALS 👇
  const targetAppointmentId = incomingAppointment?._id;
  const hasPreCheckup = Boolean(incomingAppointment?.preCheckupId);

  useEffect(() => {
    if (incomingAppointment) {
      const pId = incomingAppointment.patientId;
      const checkup = incomingAppointment.preCheckupId;

      setPrescriptionData(prev => ({
        ...prev,
        patient: {
          name: pId?.fullName || '',
          age: pId?.age || '',
          gender: pId?.gender || '',
          phone: pId?.phone || '',
          patientId: pId?._id || ''
        },
        vitals: {
          bp: checkup?.examination?.vitals?.bp || prev.vitals.bp,
          weight: checkup?.examination?.vitals?.weight || prev.vitals.weight,
          pulse: checkup?.examination?.vitals?.pulse || prev.vitals.pulse,
          temp: checkup?.examination?.vitals?.temperature || prev.vitals.temp,
          height: checkup?.examination?.vitals?.height || prev.vitals.height,
          spo2: prev.vitals.spo2
        },
        complaints: checkup?.chiefComplaints 
            ? checkup.chiefComplaints.map(c => c.complaint) 
            : prev.complaints
      }));
    }
  }, [incomingAppointment]);

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

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    await generatePrescriptionPdf('prescription-preview', prescriptionData.patient.name);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800 rounded-lg shadow border border-slate-200 dark:border-gray-700 overflow-hidden font-sans transition-colors duration-300">

      <header className="h-14 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0 z-20 transition-colors duration-300 print:hidden">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-full transition-colors text-slate-600 dark:text-gray-300">
            <ICONS.Menu size={20} />
          </button>
          <h1 className="font-bold text-lg text-slate-800 dark:text-gray-100">Create Prescription</h1>
        </div>

        <div className="flex items-center gap-3">
          
          {/* ✨ CONDITIONALLY RENDERED BUTTON ✨ */}
          {hasPreCheckup && (
            <button
              type="button"
              onClick={() => setIsViewModalOpen(true)}
              className="mr-2 px-4 py-1.5 bg-[#0891B2] hover:bg-[#067a96] text-white font-bold text-sm rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              View Pre-Checkup
            </button>
          )}

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

      {/* ✨ RENDER MODAL HERE ✨ */}
      <AppointmentViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        appointmentId={targetAppointmentId}
      />
    </div>
  );
}