import React, { useState, useEffect, useCallback, useContext } from 'react';
import { HiPlus, HiPencilSquare, HiTrash, HiMagnifyingGlass, HiUser } from "react-icons/hi2";
import { AuthContext } from '../../providers/AuthProvider';
import useUserDoctor from '../../Hook/useUserDoctor';
import UserFormModal from '../../components/modal/UserFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import Pagination from '../../components/common/Pagination';
import SectionTitle from '../../components/common/SectionTitle';

const Users = () => {
  const { branch } = useContext(AuthContext);

  // Filters & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Data State
  const [users, setUsers] = useState([]);
  const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1 });

  // Hook Destructuring
  const { getUsersByBranch, removeUser, loading, error } = useUserDoctor();

  // Modals States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Users
  const fetchUsersData = useCallback(async () => {
    if (!branch) return;
    try {
      const response = await getUsersByBranch(branch, {
        page,
        limit,
        search: searchTerm || undefined
      });

      if (response?.success) {
        setUsers(response.data || []);
        setPaginationData({
          currentPage: response.pagination.currentPage || 1,
          totalPages: response.pagination.totalPages || 1,
        });
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }, [page, limit, searchTerm, branch, getUsersByBranch]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Handlers
  const handlePageChange = (newPage) => setPage(newPage);
  const handleAddClick = () => { setSelectedUser(null); setIsModalOpen(true); };
  const handleEditClick = (user) => { setSelectedUser(user); setIsModalOpen(true); };
  const handleDeleteClick = (user) => { setUserToDelete(user); setIsDeleteModalOpen(true); };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-base-100 dark:bg-casual-black min-h-screen font-primary text-casual-black dark:text-concrete transition-colors">

      <SectionTitle
        title="User Management"
        subtitle="Managing staff and admin records"
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
        <div className="form-control w-full md:w-auto md:flex-1 max-w-sm relative">
          <HiMagnifyingGlass className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-casual-black/50 dark:text-concrete/50" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            className="input input-bordered w-full pl-10 bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && !users.length && (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-sporty-blue"></span>
        </div>
      )}

      {error && (
        <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border-fascinating-magenta/20 mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && users.length === 0 ? (
        <div className="bg-concrete dark:bg-white/5 p-12 rounded-box text-center border border-casual-black/5 dark:border-white/10">
          <p className="text-casual-black/70 dark:text-concrete/70 text-lg font-medium">No users found.</p>
        </div>
      ) : (
        !loading && (
          <div className="bg-concrete dark:bg-[#1a1a1a] rounded-box shadow-sm overflow-hidden border border-casual-black/5 dark:border-white/10 transition-colors">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-casual-black dark:text-concrete">
                <thead className="bg-casual-black/5 dark:bg-white/5 text-casual-black dark:text-concrete font-secondary">
                  <tr>
                    <th>User Name</th>
                    <th>Contact Info</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-casual-black/5 dark:hover:bg-white/5 transition-colors border-b border-b-casual-black/5 dark:border-b-white/5">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-sporty-blue/10 text-sporty-blue rounded-full w-8">
                              <HiUser />
                            </div>
                          </div>
                          <span className="font-bold">{u.fullName || u.name}</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">{u.email}</div>
                          <div className="opacity-50 text-xs">{u.phone || 'No Phone'}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-ghost font-bold text-sporty-blue">
                          {u.role || 'Staff'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-sm ${u.status === 'Inactive' ? 'badge-error' : 'badge-success'}`}>
                          {u.status || 'Active'}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="join">
                          <button onClick={() => handleEditClick(u)} className="btn btn-sm btn-ghost join-item text-sporty-blue" title="Edit"><HiPencilSquare className="h-5 w-5" /></button>
                          <button onClick={() => handleDeleteClick(u)} className="btn btn-sm btn-ghost join-item text-fascinating-magenta" title="Delete"><HiTrash className="h-5 w-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-casual-black/5 dark:border-white/10 bg-base-100 dark:bg-transparent">
              <Pagination
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        )
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSuccess={fetchUsersData}
        branch={branch}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={userToDelete?.fullName || userToDelete?.name || 'this user'}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Users;