import React, { useState, useEffect, useContext, useRef } from 'react';
import { ICONS } from './Icons'; // Adjust path if needed
import usePatient from '../../Hook/usePatient'; // EXACT path you requested
import { AuthContext } from '../../providers/AuthProvider'; // Adjust path if needed
import PatientSearchModal from '../../components/modal/PatientSearchModal'; // Make sure to import your modal!

export default function PatientPanel({ data, updateData }) {
  // 1. Get the dynamic branch from AuthContext
  const { branch } = useContext(AuthContext); 
  
  // 2. Initialize the hook
  const { getPatientsByBranch, error } = usePatient();
  
  // Search States
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use a ref to prevent searching when a user clicks a result to auto-fill
  const isAutoFilling = useRef(false);

  // 3. Inline Search Effect based on Name or Phone input
  useEffect(() => {
    // If we are currently auto-filling from a click, don't trigger a new search
    if (isAutoFilling.current) {
      isAutoFilling.current = false; // reset
      return;
    }

    const { name, phone } = data.patient;
    
    // Only search if name >= 3 chars or phone >= 4 chars
    const hasSearchTerm = (name && name.length >= 3) || (phone && phone.length >= 4);

    if (!hasSearchTerm) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Determine what to send to backend (prioritize phone if both exist)
    const searchTerm = phone && phone.length >= 4 ? phone : name;

    const timerId = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        if (!branch) return;

        const response = await getPatientsByBranch(branch, { 
          search: searchTerm,
          limit: 10, // Limit inline results
          page: 1
        });
        
        // Handle response mapping
        if (response?.success) {
          setSearchResults(response.data || []);
        } else if (response?.data) {
          setSearchResults(response.data);
        } else if (Array.isArray(response)) {
          setSearchResults(response);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timerId);
  }, [data.patient.name, data.patient.phone, getPatientsByBranch, branch]);

  // Handle selecting a patient from either the inline dropdown OR the modal
  const handleSelectPatient = (patient) => {
    isAutoFilling.current = true; // Flag to prevent the useEffect from re-triggering a search

    updateData('patient', {
      name: patient.fullName || patient.name || '', 
      phone: patient.phone || '',
      age: patient.age?.toString() || '', 
      gender: patient.gender || ''
    });
    
    setShowDropdown(false); 
    setIsModalOpen(false); // Ensure modal closes if selection came from there
  };

  return (
    <div className="p-4 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
      
      {/* Full Name */}
      <div className="mb-4">
        <label className="block text-sm font-semibold text-slate-700 dark:text-gray-200 mb-1.5">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.patient.name}
          onChange={(e) => updateData('patient', { ...data.patient, name: e.target.value })}
          className="w-full p-2.5 border-2 border-cyan-500 rounded-lg text-sm bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-4 focus:ring-cyan-500/20 transition-all shadow-sm"
          placeholder="Type to search..."
        />
      </div>

      {/* Age & Phone Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.patient.age}
            onChange={(e) => updateData('patient', { ...data.patient, age: e.target.value })}
            className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:border-cyan-500 outline-none transition-colors"
            placeholder=""
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
            Phone (optional)
          </label>
          <input
            type="tel"
            value={data.patient.phone || ''}
            onChange={(e) => updateData('patient', { ...data.patient, phone: e.target.value })}
            className="w-full p-2.5 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:border-cyan-500 outline-none transition-colors"
            placeholder="Type to search..."
          />
        </div>
      </div>

      {/* Gender Buttons */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">Gender</label>
        <div className="grid grid-cols-3 gap-2">
          {['Male', 'Female', 'Other'].map((g) => (
            <button
              key={g}
              onClick={() => updateData('patient', { ...data.patient, gender: g })}
              className={`py-2 text-sm rounded-lg border transition-colors ${
                data.patient.gender === g
                  ? 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-500 text-cyan-700 dark:text-cyan-400 font-semibold'
                  : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-600 text-slate-600 dark:text-gray-300 hover:border-cyan-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Manual "Select Existing" Button - Now opens the Modal */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-2.5 mb-2 bg-slate-50 hover:bg-slate-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-200 rounded-lg font-medium border border-slate-200 dark:border-gray-600 transition-colors"
      >
        <ICONS.History size={18} />
        Select Existing
      </button>

      {error && <p className="text-red-500 text-xs font-medium mb-4">{error}</p>}

      {/* --- INLINE SEARCH RESULTS --- */}
      <div className="mt-auto pt-2 min-h-[150px]">
        {showDropdown && (
          <div className="bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Header / Loading state */}
            <div className="bg-slate-50 dark:bg-gray-800/80 px-3 py-2 border-b border-slate-100 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isSearching ? 'Searching...' : 'Matched Patients'}
              </span>
              {isSearching && (
                <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              )}
            </div>

            {/* List */}
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
              {!isSearching && searchResults.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400 italic">
                  No matches found.
                </div>
              ) : (
                searchResults.map((p, index) => (
                  <div 
                    key={p._id || index}
                    onClick={() => handleSelectPatient(p)}
                    className="px-3 py-2.5 border-b border-slate-100 dark:border-gray-700 last:border-0 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 cursor-pointer transition-colors group"
                  >
                    <div className="font-bold text-sm text-slate-800 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                      {p.fullName || p.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                      {p.phone || 'No phone'} • {p.age || '-'} Yrs • {p.gender || '-'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- RENDER THE MODAL COMPONENT --- */}
      <PatientSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={handleSelectPatient} 
      />

    </div>
  );
}