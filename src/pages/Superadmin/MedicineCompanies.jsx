import React, { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiPencilSquare, HiTrash, HiMagnifyingGlass, HiCheck, HiXMark, HiMinus } from "react-icons/hi2";
import useMedicineManufacturer from '../../Hook/useMedicineManufacturer';
import MedicineCompanyFormModal from '../../components/modal/MedicineManufacturerFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import Pagination from '../../components/common/Pagination';
import SectionTitle from '../../components/common/SectionTitle';

const MedicineCompanies = () => {
  // Filters & Pagination State
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  
  // Data State
  const [companies, setCompanies] = useState([]);
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1 });

  // Hook Destructuring
  const { 
    getAllMedicineManufacturers, 
    getMedicineManufacturersByStatus, 
    removeMedicineManufacturer, 
    loading: compLoading, 
    error: compError 
  } = useMedicineManufacturer();

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Companies
  const fetchCompaniesData = useCallback(async () => {
    try {
      let response;
      if (statusFilter) {
        response = await getMedicineManufacturersByStatus(statusFilter, {
          page,
          limit,
          search: searchTerm || undefined
        });
      } else {
        response = await getAllMedicineManufacturers({
          page,
          limit,
          search: searchTerm || undefined
        });
      }
      
      if (response) {
        setCompanies(response.data || []);
        setPaginationData({
          currentPage: response.pagination?.currentPage || 1,
          totalPages: response.pagination?.totalPages || 1,
        });
      }
    } catch (err) {
      console.error("Failed to fetch companies:", err);
    }
  }, [page, limit, statusFilter, searchTerm, getAllMedicineManufacturers, getMedicineManufacturersByStatus]);

  useEffect(() => {
    fetchCompaniesData();
  }, [fetchCompaniesData]);

  // Handlers
  const handlePageChange = (newPage) => setPage(newPage);
  const handleAddClick = () => { setSelectedCompany(null); setIsModalOpen(true); };
  const handleEditClick = (company) => { setSelectedCompany(company); setIsModalOpen(true); };
  const handleDeleteClick = (company) => { setCompanyToDelete(company); setIsDeleteModalOpen(true); };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); 
  };

  const confirmDelete = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    
    try {
      await removeMedicineManufacturer(companyToDelete._id);
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
      fetchCompaniesData(); 
    } catch (err) {
      alert(`Error deleting: ${err}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper to render status based on Mongoose Enum
  const renderStatusBadge = (status) => {
    const s = status?.toLowerCase() || 'inactive';
    
    let config = {
      className: "bg-casual-black/10 dark:bg-white/10 text-casual-black dark:text-concrete",
      icon: null,
      label: s
    };

    if (s === 'active') {
      config = {
        className: "bg-earls-green/20 dark:bg-earls-green/30 text-earls-green",
        icon: <HiCheck className="h-3 w-3" />,
        label: "active"
      };
    } else if (s === 'suspended') {
      config = {
        className: "bg-fascinating-magenta/20 dark:bg-fascinating-magenta/30 text-fascinating-magenta",
        icon: <HiXMark className="h-3 w-3" />,
        label: "suspended"
      };
    } else if (s === 'inactive') {
      config = {
        className: "bg-casual-black/20 dark:bg-white/20 text-casual-black dark:text-white",
        icon: <HiMinus className="h-3 w-3" />,
        label: "inactive"
      };
    }

    return (
      <div className={`badge badge-sm gap-1 border-none ${config.className}`}>
        {config.icon}
        <span className="text-[10px] uppercase font-bold tracking-wider">{config.label}</span>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 bg-base-100 dark:bg-casual-black min-h-screen font-primary text-casual-black dark:text-concrete transition-colors">
      
      <SectionTitle 
        title="Medicine Manufacturers" 
        subtitle="Manage medicine manufacturing companies and their details."
        rightElement={
          <button 
            onClick={handleAddClick}
            className="btn bg-sporty-blue hover:bg-sporty-blue/90 text-concrete border-none w-full md:w-auto font-secondary flex items-center gap-2"
          >
            <HiPlus className="text-xl" />
            Add New Manufacturer
          </button>
        }
      />

      {/* Filtering Toolbar */}
      <div className="bg-concrete dark:bg-white/5 p-4 rounded-box shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4 border border-casual-black/5 dark:border-white/10 transition-colors">
        
        {/* Search */}
        <div className="form-control w-full md:w-auto md:flex-1 max-w-sm relative">
          <HiMagnifyingGlass className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-casual-black/50 dark:text-concrete/50" />
          <input 
            type="text" 
            placeholder="Search manufacturer name..." 
            className="input input-bordered w-full pl-10 bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue dark:focus:border-sporty-blue focus:outline-none transition-colors" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Status Dropdown */}
        <div className="form-control w-full md:w-48">
          <select 
            className="select select-bordered w-full bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || statusFilter) && (
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter(''); setPage(1); }}
            className="btn btn-ghost text-fascinating-magenta hover:bg-fascinating-magenta/10 w-full md:w-auto font-secondary"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Loading State */}
      {compLoading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-sporty-blue"></span>
        </div>
      )}
      
      {/* Error State */}
      {compError && !compLoading && (
        <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border border-fascinating-magenta/20 shadow-sm mb-6">
          <div className="flex items-center gap-2">
            <HiTrash className="h-6 w-6" />
            <div>
              <h3 className="font-bold font-secondary">Error retrieving data</h3>
              <div className="text-xs">{compError}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {!compLoading && !compError && companies.length === 0 && (
        <div className="bg-concrete dark:bg-white/5 p-12 rounded-box text-center shadow-sm border border-casual-black/5 dark:border-white/10 transition-colors">
          <p className="text-casual-black/70 dark:text-concrete/70 text-lg font-medium font-secondary">No manufacturers found.</p>
          {(searchTerm || statusFilter) && (
            <p className="text-sm text-casual-black/50 dark:text-concrete/50 mt-2">Try adjusting your search or filters.</p>
          )}
        </div>
      )}

      {/* Data Table */}
      {!compLoading && !compError && companies.length > 0 && (
        <div className="bg-concrete dark:bg-[#1a1a1a] rounded-box shadow-sm overflow-hidden border border-casual-black/5 dark:border-white/10 transition-colors">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-casual-black dark:text-concrete">
              <thead className="bg-casual-black/5 dark:bg-white/5 text-casual-black dark:text-concrete font-secondary transition-colors">
                <tr>
                  <th>Manufacturer Name</th>
                  <th>Short Name</th>
                  <th>Contact Info</th>
                  <th>Established</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-casual-black/5 dark:hover:bg-white/5 transition-colors border-b-casual-black/5 dark:border-b-white/5 border-b">
                    <td>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{company.name}</span>
                        <div>{renderStatusBadge(company.status)}</div>
                      </div>
                    </td>
                    <td>{company.short_name || '-'}</td>
                    <td>
                      <div className="flex flex-col text-sm">
                        {company.phone && <span>{company.phone}</span>}
                        {company.email && <span className="text-casual-black/70 dark:text-concrete/70">{company.email}</span>}
                        {!company.phone && !company.email && '-'}
                      </div>
                    </td>
                    <td>{company.established_year || '-'}</td>
                    <td className="text-center">
                      <div className="join">
                        <button 
                          onClick={() => handleEditClick(company)} 
                          className="btn btn-sm btn-ghost join-item text-sporty-blue hover:bg-sporty-blue/10 hover:text-sporty-blue" 
                          title="Edit"
                        >
                          <HiPencilSquare className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(company)} 
                          className="btn btn-sm btn-ghost join-item text-fascinating-magenta hover:bg-fascinating-magenta/10 hover:text-fascinating-magenta" 
                          title="Delete"
                        >
                          <HiTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-casual-black/5 dark:border-white/10 bg-base-100 dark:bg-transparent transition-colors">
            <Pagination 
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {isModalOpen && (
        <MedicineCompanyFormModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          company={selectedCompany} 
          onSuccess={fetchCompaniesData} 
        />
      )}
      
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
        itemName={companyToDelete?.name || 'this manufacturer'} 
        isDeleting={isDeleting} 
      />
    </div>
  );
};

export default MedicineCompanies;