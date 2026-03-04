import React, { useState } from 'react';
import { useDoctorProfileList } from '../../Hook/useDoctorProfileList';
import DoctorProfileFormModal from '../../components/DoctorProfile/DoctorProfileFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'; 

const Profile = () => {
  const [branchFilter, setBranchFilter] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Used to manage the input state before applying filter
  
  const { 
    profiles, 
    loading, 
    error, 
    pagination, 
    handlePageChange,
    refetch,
    deleteProfile
  } = useDoctorProfileList(1, 10, branchFilter);

  // Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handlers for Form
  const handleAddClick = () => {
    setSelectedProfile(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (profile) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  // Handlers for Delete
  const handleDeleteClick = (profile) => {
    setProfileToDelete(profile);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    
    setIsDeleting(true);
    const result = await deleteProfile(profileToDelete._id);
    setIsDeleting(false);
    
    if (result.success) {
      setIsDeleteModalOpen(false);
      setProfileToDelete(null);
    } else {
      alert(`Error deleting: ${result.error}`);
    }
  };

  // Handler for Branch Filter
  const handleApplyFilter = () => {
    setBranchFilter(searchInput);
    handlePageChange(1); // Reset to page 1 on new filter
  };

  const handleClearFilter = () => {
    setSearchInput('');
    setBranchFilter('');
    handlePageChange(1);
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin: Doctor Profiles</h1>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Filter by Branch..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm w-full md:w-48"
          />
          <button 
            onClick={handleApplyFilter}
            className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-2 rounded shadow-sm hover:bg-gray-200 transition text-sm"
          >
            Search
          </button>
          {branchFilter && (
            <button 
              onClick={handleClearFilter}
              className="text-red-500 hover:text-red-700 text-sm font-medium px-2"
            >
              Clear
            </button>
          )}

          <button 
            onClick={handleAddClick}
            className="bg-blue-600 whitespace-nowrap text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition font-medium text-sm ml-2"
          >
            + Add Doctor
          </button>
        </div>
      </div>
      
      {loading && <p className="text-gray-500 mb-4">Loading profiles...</p>}
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      
      {!loading && !error && profiles.length === 0 && (
        <p className="text-gray-500 bg-gray-50 p-4 rounded text-center border">No doctor profiles found.</p>
      )}

      {!loading && !error && profiles.length > 0 && (
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Doctor Name</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">BMDC Reg.</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Department</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Branch</th>
                  <th className="p-3 text-left border-b font-semibold text-gray-700">Fee</th>
                  <th className="p-3 text-center border-b font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map((profile) => (
                  <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 border-b text-gray-800 font-medium">{profile.fullName}</td>
                    <td className="p-3 border-b text-gray-600">{profile.bmdcRegNumber}</td>
                    <td className="p-3 border-b text-gray-600">{profile.department}</td>
                    <td className="p-3 border-b text-gray-600">{profile.branch}</td>
                    <td className="p-3 border-b text-gray-800 font-medium">৳{profile.consultancyFee}</td>
                    <td className="p-3 border-b text-center space-x-2">
                      <button 
                        onClick={() => handleEditClick(profile)}
                        className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(profile)}
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

          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-600">
                Page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
                {' '} ({pagination.totalItems} total doctors)
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

      {/* Reusable Form Modal */}
      <DoctorProfileFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        profile={selectedProfile}
        onSuccess={refetch}
      />

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={profileToDelete?.fullName || 'this doctor profile'}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Profile;