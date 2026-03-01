import React, { useState } from 'react';
import { useMedicineList } from '../../Hook/useMedicineList';
import { useMedicineCompanies } from '../../Hook/useMedicineCompanies';
import MedicineFormModal from '../../components/Medicine/MedicineFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'; // New Import

const MedicineList = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  
  const { 
    medicines, 
    loading, 
    error, 
    pagination, 
    handlePageChange,
    refetch,
    deleteMedicine // <--- Pulling delete function from hook
  } = useMedicineList(1, 10, selectedFilter);

  const { companies } = useMedicineCompanies();

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [medicineToDelete, setMedicineToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers for Create/Edit
  const handleAddClick = () => {
    setSelectedMedicine(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  // Handlers for Delete
  const handleDeleteClick = (medicine) => {
    setMedicineToDelete(medicine);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!medicineToDelete) return;
    
    setIsDeleting(true);
    const result = await deleteMedicine(medicineToDelete._id);
    setIsDeleting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setMedicineToDelete(null);
    } else {
      alert(`Error deleting: ${result.error}`); // Fallback error handling
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin: Medicine List</h1>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Company Filter */}
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full md:w-48 text-sm"
          >
            <option value="">All Manufacturers</option>
            {companies.map(company => (
              <option key={company.id} value={company.name}>{company.name}</option>
            ))}
          </select>

          <button 
            onClick={handleAddClick}
            className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-medium text-sm"
          >
            + Add Medicine
          </button>
        </div>
      </div>
      
      {loading && <p className="text-gray-500 mb-4">Loading medicines...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {!loading && !error && medicines.length === 0 && (
        <p className="text-gray-500 bg-gray-50 p-4 rounded text-center border">No medicines found.</p>
      )}

      {!loading && !error && medicines.length > 0 && (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Brand Name</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Generic Name</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Manufacturer</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Strength</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Status</th>
                  <th className="p-3 text-center border-b font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((med) => (
                  <tr key={med._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b text-gray-800">{med.brandName || '-'}</td>
                    <td className="p-3 border-b text-gray-800">{med.genericName || '-'}</td>
                    <td className="p-3 border-b text-gray-600">{med.manufacturer || '-'}</td>
                    <td className="p-3 border-b text-gray-600">{med.strength || '-'}</td>
                    <td className="p-3 border-b">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        med.status === 'final' ? 'bg-green-100 text-green-800' : 
                        med.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {med.status || 'final'}
                      </span>
                    </td>
                    <td className="p-3 border-b text-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(med)}
                        className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      {/* Delete Button Added Here */}
                      <button 
                        onClick={() => handleDeleteClick(med)}
                        className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!selectedFilter && pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      <MedicineFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medicine={selectedMedicine}
        onSuccess={refetch}
      />

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={medicineToDelete?.brandName || medicineToDelete?.genericName || 'this item'}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default MedicineList;