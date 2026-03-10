import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ICONS } from './Icons';
import { CHIPS_DATA } from '../../data/chips';
import { ChipGroup } from './RightPanel';
import useLabtest from '../../Hook/useLabtest'; 
import { HiPlus } from "react-icons/hi2"; 

export default function InvestigationsPanel({ data, updateData, t, handleToggle }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dynamicTests, setDynamicTests] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { getPaginatedLabtests, createLabtest, loading } = useLabtest();
  const dropdownRef = useRef(null);

  // FETCH DYNAMIC SEARCH RESULTS
  const fetchSearchResults = useCallback(async (search) => {
    if (!search.trim()) {
      setDynamicTests([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const response = await getPaginatedLabtests({
        limit: 20, 
        search: search,
        status: 'active' // Only show active tests in the dropdown
      });
      
      if (response && response.success) {
        const testNames = response.data
          .map(test => test.testName)
          .filter(Boolean);
          
        setDynamicTests(testNames);
        setIsDropdownOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch active lab tests:", err);
    }
  }, [getPaginatedLabtests]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSearchResults(searchTerm);
    }, 500); 
    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchSearchResults]);

  const handleSelectFromDropdown = (testName) => {
    if (!data.investigations?.includes(testName)) {
      handleToggle('investigations', testName);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  /**
   * UPDATED: Sends schema-based object
   * Sends testName and sets default status to 'pending'
   */
  const handleAddNewTest = async () => {
    const trimmedName = searchTerm.trim();
    if (!trimmedName) return;

    try {
      // Sending schema-based object instead of a direct string
      await createLabtest({ 
        testName: trimmedName, 
        status: 'pending' 
      });

      // Still add it to the local UI selection so the doctor can proceed
      if (!data.investigations?.includes(trimmedName)) {
        handleToggle('investigations', trimmedName);
      }

      setSearchTerm('');
      setIsDropdownOpen(false);
    } catch (err) {
      console.error("Failed to create pending test:", err);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full relative">
      <div className="mb-4 flex items-center gap-2" ref={dropdownRef}>
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => { if (dynamicTests.length > 0) setIsDropdownOpen(true); }}
            className="w-full p-2.5 pl-9 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-sm dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-colors"
            placeholder={t.customTest || "Type custom test..."}
          />
          <ICONS.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-400" />
          
          {/* SEARCH DROPDOWN */}
          {isDropdownOpen && dynamicTests.length > 0 && (
            <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar">
              {dynamicTests.map((test, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectFromDropdown(test)}
                  className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-slate-700 dark:text-white transition-colors"
                >
                  {test}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleAddNewTest}
          disabled={!searchTerm.trim() || loading}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-700 border border-slate-200 dark:border-gray-600 rounded-lg text-slate-400 hover:text-cyan-500 hover:border-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs text-cyan-500"></span>
          ) : (
            <HiPlus className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          {t.quickPick}
        </h3>
        <ChipGroup
          items={CHIPS_DATA.investigations || []}
          selected={data.investigations}
          onToggle={(item) => handleToggle('investigations', item)}
        />
      </div>
    </div>
  );
}