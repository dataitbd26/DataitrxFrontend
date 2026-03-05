import React, { useState, useEffect, useCallback } from 'react';
import { 
  HiPlus, HiPencilSquare, HiTrash, HiMagnifyingGlass, 
  HiCheckCircle, HiXCircle, HiMinusCircle, HiArrowPath 
} from "react-icons/hi2";
import { FaUserCircle } from "react-icons/fa";
import useSuperAdmin from '../../Hook/useSuperAdmin'; 
import UserFormModal from '../../components/modal/UserFormModal'; 
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'; 
import Pagination from '../../components/common/Pagination'; 
import SectionTitle from '../../components/common/SectionTitle'; 

const UserList = () => {
  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  
  // Data State
  const [allUsers, setAllUsers] = useState([]); // Stores raw backend array
  const [displayedUsers, setDisplayedUsers] = useState([]); // Stores filtered & paginated data
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1 });

  // Hook Destructuring
  const { getAllUsers, removeUser, loading: usersLoading, error: usersError } = useSuperAdmin();

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetch ALL users 
  const fetchUsersData = useCallback(async () => {
    try {
      const response = await getAllUsers();
      if (response && Array.isArray(response)) {
        setAllUsers(response);
      } else if (response?.data && Array.isArray(response.data)) {
        setAllUsers(response.data); 
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, [getAllUsers]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // 2. Client-side Filtering and Pagination
  useEffect(() => {
    let filtered = [...allUsers];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(lowerSearch) || 
        u.email?.toLowerCase().includes(lowerSearch) ||
        u.phone?.toLowerCase().includes(lowerSearch)
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter(u => u.status === statusFilter);
    }

    const totalPages = Math.ceil(filtered.length / limit) || 1;
    
    // Ensure page doesn't exceed total pages after filter
    const safePage = page > totalPages ? 1 : page;
    if (page !== safePage) setPage(safePage);

    const startIndex = (safePage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    setDisplayedUsers(paginated);
    setPaginationData({ currentPage: safePage, totalPages });

  }, [allUsers, searchTerm, roleFilter, statusFilter, page, limit]);

  // Handlers
  const handlePageChange = (newPage) => setPage(newPage);
  const handleAddClick = () => { setSelectedUser(null); setIsModalOpen(true); };
  const handleEditClick = (user) => { setSelectedUser(user); setIsModalOpen(true); };
  const handleDeleteClick = (user) => { setUserToDelete(user); setIsDeleteModalOpen(true); };
  
  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    
    try {
      await removeUser(userToDelete._id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsersData(); 
    } catch (err) {
      alert(`Error deleting: ${err}`);
      fetchUsersData(); // Refresh component data even if delete fails to ensure sync
    } finally {
      setIsDeleting(false);
    }
  };

  // UI Helpers
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <div className="badge badge-sm gap-1 border-none bg-earls-green/20 dark:bg-earls-green/30 text-earls-green">
            <HiCheckCircle className="h-3 w-3" /> <span className="text-[10px] uppercase font-bold tracking-wider">Active</span>
          </div>
        );
      case 'inactive':
        return (
          <div className="badge badge-sm gap-1 border-none bg-fascinating-magenta/20 dark:bg-fascinating-magenta/30 text-fascinating-magenta">
            <HiXCircle className="h-3 w-3" /> <span className="text-[10px] uppercase font-bold tracking-wider">Inactive</span>
          </div>
        );
      case 'on-leave':
        return (
          <div className="badge badge-sm gap-1 border-none bg-sporty-blue/20 dark:bg-sporty-blue/30 text-sporty-blue">
            <HiMinusCircle className="h-3 w-3" /> <span className="text-[10px] uppercase font-bold tracking-wider">On Leave</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 md:p-6 bg-base-100 dark:bg-casual-black min-h-screen font-primary text-casual-black dark:text-concrete transition-colors">
      
      <SectionTitle 
        title="User Management" 
        subtitle="Manage system access, roles, and staff details."
        rightElement={
          <button 
            onClick={handleAddClick}
            className="btn bg-sporty-blue hover:bg-sporty-blue/90 text-concrete border-none w-full md:w-auto font-secondary flex items-center gap-2"
          >
            <HiPlus className="text-xl" />
            Add New User
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
            placeholder="Search name, email, or phone..." 
            className="input input-bordered w-full pl-10 bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue dark:focus:border-sporty-blue focus:outline-none transition-colors" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Role Dropdown */}
        <div className="form-control w-full md:w-48">
          <select 
            className="select select-bordered w-full bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Doctor">Doctor</option>
            <option value="Assistants">Assistants</option>
            <option value="Compounders">Compounders</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="form-control w-full md:w-48">
          <select 
            className="select select-bordered w-full bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>

        {/* Clear Filters */}
        {(searchTerm || roleFilter || statusFilter) && (
          <button 
            onClick={() => { setSearchTerm(''); setRoleFilter(''); setStatusFilter(''); }}
            className="btn btn-ghost text-fascinating-magenta hover:bg-fascinating-magenta/10 w-full md:w-auto font-secondary"
          >
            Clear
          </button>
        )}
      </div>
      
      {/* Loading State */}
      {usersLoading && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-sporty-blue"></span>
        </div>
      )}
      
      {/* Error State with Refresh Button */}
      {usersError && !usersLoading && (
        <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border border-fascinating-magenta/20 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HiXCircle className="h-6 w-6 shrink-0" />
            <div>
              <h3 className="font-bold font-secondary">Error retrieving data</h3>
              <div className="text-xs">{usersError}</div>
            </div>
          </div>
          <button 
            onClick={fetchUsersData} 
            className="btn btn-sm bg-fascinating-magenta text-white hover:bg-fascinating-magenta/80 border-none flex items-center gap-1 shrink-0"
          >
            <HiArrowPath className="h-4 w-4" />
            Refresh
          </button>
        </div>
      )}
      
      {/* Empty State */}
      {!usersLoading && !usersError && displayedUsers.length === 0 && (
        <div className="bg-concrete dark:bg-white/5 p-12 rounded-box text-center shadow-sm border border-casual-black/5 dark:border-white/10 transition-colors">
          <p className="text-casual-black/70 dark:text-concrete/70 text-lg font-medium font-secondary">No users found.</p>
          {(searchTerm || roleFilter || statusFilter) && (
            <p className="text-sm text-casual-black/50 dark:text-concrete/50 mt-2">Try adjusting your search or filters.</p>
          )}
        </div>
      )}

      {/* Data Table */}
      {!usersLoading && !usersError && displayedUsers.length > 0 && (
        <div className="bg-concrete dark:bg-[#1a1a1a] rounded-box shadow-sm overflow-hidden border border-casual-black/5 dark:border-white/10 transition-colors">
          <div className="overflow-x-auto">
            <table className="table w-full text-casual-black dark:text-concrete">
              <thead className="bg-casual-black/5 dark:bg-white/5 text-casual-black dark:text-concrete font-secondary transition-colors">
                <tr>
                  <th className="pl-6">User</th>
                  <th>Contact Info</th>
                  <th>Role & Branch</th>
                  <th>Status</th>
                  <th className="text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => (
                  <tr 
                    key={user._id} 
                    className={`transition-colors border-b-casual-black/5 dark:border-b-white/5 border-b 
                      ${index % 2 === 0 ? 'bg-transparent' : 'bg-casual-black/5 dark:bg-white/5'}
                      hover:bg-casual-black/10 dark:hover:bg-white/10`}
                  >
                    <td className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-10 h-10 bg-casual-black/10 dark:bg-white/10 flex items-center justify-center">
                            {user.photo ? (
                              <img src={user.photo} alt={user.name} />
                            ) : (
                              <FaUserCircle className="text-2xl text-casual-black/30 dark:text-concrete/30 w-full h-full p-1" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">{user.email}</div>
                      <div className="text-xs text-casual-black/60 dark:text-concrete/60">{user.phone}</div>
                    </td>
                    <td>
                      <div className="font-medium text-sporty-blue">{user.role}</div>
                      <div className="text-xs text-casual-black/60 dark:text-concrete/60">{user.branch}</div>
                    </td>
                    <td>{renderStatusBadge(user.status)}</td>
                    <td className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(user)} 
                          className="btn btn-sm btn-ghost text-sporty-blue hover:bg-sporty-blue/10 hover:text-sporty-blue" 
                          title="Edit"
                        >
                          <HiPencilSquare className="h-5 w-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)} 
                          className="btn btn-sm btn-ghost text-fascinating-magenta hover:bg-fascinating-magenta/10 hover:text-fascinating-magenta" 
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

      <UserFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        user={selectedUser} 
        onSuccess={fetchUsersData} 
      />
      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
        itemName={userToDelete?.name || 'this user'} 
        isDeleting={isDeleting} 
      />
    </div>
  );
};

export default UserList;