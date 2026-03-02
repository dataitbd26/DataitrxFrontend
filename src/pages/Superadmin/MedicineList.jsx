import React, { useState } from 'react';
import { useMedicineList } from '../../Hook/useMedicineList';
import { useMedicineCompanies } from '../../Hook/useMedicineCompanies';
import MedicineFormModal from '../../components/Medicine/MedicineFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import Pagination from '../../components/common/Pagination'; 
import ModernDropdown from '../../components/common/ModernDropdown'; // 🔥 Import the new Dropdown

const MedicineList = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [limit, setLimit] = useState(10); 
  
  const { 
    medicines, 
    loading, 
    error, 
    pagination, 
    handlePageChange,
    refetch,
    deleteMedicine 
  } = useMedicineList(1, limit, selectedFilter); 

  // Retrieves all unique companies to feed into our modern dropdown
  const { companies } = useMedicineCompanies();

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers
  const handleAddClick = () => { setSelectedMedicine(null); setIsModalOpen(true); };
  const handleEditClick = (medicine) => { setSelectedMedicine(medicine); setIsModalOpen(true); };
  const handleDeleteClick = (medicine) => { setMedicineToDelete(medicine); setIsDeleteModalOpen(true); };

  const confirmDelete = async () => {
    if (!medicineToDelete) return;
    setIsDeleting(true);
    const result = await deleteMedicine(medicineToDelete._id);
    setIsDeleting(false);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setMedicineToDelete(null);
    } else {
      alert(`Error deleting: ${result.error}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin: Medicine List</h1>
        
        <button 
          onClick={handleAddClick}
          className="bg-blue-600 whitespace-nowrap text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm w-full lg:w-auto"
        >
          + Add New Medicine
        </button>
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center gap-5">
        
        {/* Items Per Page Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">Show:</label>
          <select 
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm outline-none cursor-pointer hover:border-blue-400 transition"
          >
            <option value={10}>10 Items</option>
            <option value={20}>20 Items</option>
            <option value={30}>30 Items</option>
          </select>
        </div>

        {/* 🔥 MODERN DROPDOWN FILTER 🔥 */}
        <div className="flex items-center gap-3 flex-grow lg:flex-grow-0 z-40">
          <label className="text-sm text-gray-600 font-medium whitespace-nowrap">Filter by Manufacturer:</label>
          
          <ModernDropdown 
            options={companies} 
            value={selectedFilter} 
            onChange={setSelectedFilter} 
            placeholder="All Manufacturers"
          />
        </div>

        {/* Clear Filter Indicator */}
        {selectedFilter && (
          <button 
            onClick={() => setSelectedFilter('')}
            className="text-red-500 hover:text-red-700 text-sm font-medium transition flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filter
          </button>
        )}
      </div>
      
      {/* Loading & Error States */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p className="font-semibold">Error retrieving data:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {!loading && !error && medicines.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 p-12 rounded-xl text-center">
          <p className="text-gray-500 text-lg font-medium">No medicines found.</p>
          {selectedFilter && <p className="text-sm text-gray-400 mt-2">No results for <span className="font-semibold text-gray-600">"{selectedFilter}"</span>.</p>}
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && medicines.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left border-b border-gray-100 font-semibold text-gray-700 text-sm">Brand Name</th>
                  <th className="p-4 text-left border-b border-gray-100 font-semibold text-gray-700 text-sm">Generic Name</th>
                  <th className="p-4 text-left border-b border-gray-100 font-semibold text-gray-700 text-sm">Manufacturer</th>
                  <th className="p-4 text-left border-b border-gray-100 font-semibold text-gray-700 text-sm">Strength</th>
                  <th className="p-4 text-left border-b border-gray-100 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="p-4 text-center border-b border-gray-100 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {medicines.map((med) => (
                  <tr key={med._id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-gray-800 font-medium text-sm">{med.brandName || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm">{med.genericName || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm">{med.manufacturer || '-'}</td>
                    <td className="p-4 text-gray-600 text-sm">{med.strength || '-'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                        med.status === 'final' ? 'bg-green-100 text-green-700' : 
                        med.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {med.status || 'final'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEditClick(med)} className="text-blue-500 hover:text-blue-700 transition" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDeleteClick(med)} className="text-red-400 hover:text-red-600 transition" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination 
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals */}
      <MedicineFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} medicine={selectedMedicine} onSuccess={refetch} />
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} itemName={medicineToDelete?.brandName || medicineToDelete?.genericName || 'this item'} isDeleting={isDeleting} />
    </div>
  );
};

export default MedicineList;