import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    HiPlus,
    HiPencilSquare,
    HiTrash,
    HiEye,
    HiLockClosed,
} from "react-icons/hi2";
import useAppointment from '../../Hook/useAppointment';
import useChamber from '../../Hook/useChamber';
import AppointmentFormModal from '../../components/modal/AppointmentFormModal';
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal';
import Pagination from '../../components/common/Pagination';
import { AuthContext } from '../../providers/AuthProvider';

const Appointments = () => {
    // Pagination & Config State
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const { branch } = useContext(AuthContext);

    // Data State
    const [appointments, setAppointments] = useState([]);
    const [chambers, setChambers] = useState([]);
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, totalItems: 0 });

    // Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // Hooks
    const { getAppointmentsByBranch, removeAppointment, loading: appointmentsLoading } = useAppointment();
    const { getChambersByBranch } = useChamber();

    // Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDropdownData = useCallback(async () => {
        if (!branch) return;
        try {
            const chamberRes = await getChambersByBranch(branch, { limit: 100 });
            if (chamberRes?.data) setChambers(chamberRes.data);
        } catch (err) {
            console.error("Failed to fetch dropdown dependencies:", err);
        }
    }, [branch, getChambersByBranch]);

    const fetchAppointmentsData = useCallback(async () => {
        if (!branch) return;
        try {
            const params = { page, limit, search: searchQuery };
            if (selectedDate) params.date = selectedDate;

            const response = await getAppointmentsByBranch(branch, params);

            if (response && response.success) {
                setAppointments(response.data || []);
                setPaginationData({
                    currentPage: response.pagination?.currentPage || 1,
                    totalPages: response.pagination?.totalPages || 1,
                    totalItems: response.pagination?.totalItems || 0
                });
            }
        } catch (err) {
            console.error("Failed to fetch appointments:", err);
        }
    }, [page, limit, branch, searchQuery, selectedDate, getAppointmentsByBranch]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        fetchAppointmentsData();
    }, [fetchAppointmentsData]);

    // Handlers
    const handlePageChange = (newPage) => setPage(newPage);
    const handleAddClick = () => { setSelectedAppointment(null); setIsModalOpen(true); };
    const handleEditClick = (appointment) => { setSelectedAppointment(appointment); setIsModalOpen(true); };
    const handleDeleteClick = (appointment) => { setAppointmentToDelete(appointment); setIsDeleteModalOpen(true); };

    const confirmDelete = async () => {
        if (!appointmentToDelete) return;
        setIsDeleting(true);
        try {
            await removeAppointment(appointmentToDelete._id);
            setIsDeleteModalOpen(false);
            setAppointmentToDelete(null);
            fetchAppointmentsData();
        } catch (err) {
            alert(`Error deleting: ${err}`);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="p-4 md:p-6 bg-base-100 dark:bg-casual-black min-h-screen font-primary text-casual-black dark:text-concrete transition-colors">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-casual-black dark:text-concrete font-secondary">Appointment Management</h1>
                    <p className="text-sm text-casual-black/60 dark:text-concrete/60 mt-1">
                        View and manage all patient appointments ({paginationData.totalItems} total appointments)
                    </p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="btn bg-[#008080] hover:bg-[#006666] text-white border-none font-secondary flex items-center gap-2 shadow-sm"
                >
                    <HiPlus className="text-lg" />
                    New Appointment
                </button>
            </div>

            {/* Serial Blocking Management Section */}
            <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <HiLockClosed className="text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-300">Serial Blocking Management</h3>
                </div>
                <p className="text-sm text-blue-700/70 dark:text-blue-300/70 mb-4">
                    Block specific serial numbers for appointments on selected dates. Blocked serials won't be available for booking.
                </p>
                <div className="flex flex-wrap gap-3">
                    <input type="date" className="input input-bordered input-sm bg-white dark:bg-transparent" />
                    <button className="btn btn-sm bg-[#68B1B1] hover:bg-[#5A9E9E] text-white border-none gap-2">
                        <HiLockClosed /> Block Serials
                    </button>
                    <button className="btn btn-sm btn-ghost border border-gray-300 dark:border-gray-600">
                        Manage Blocked
                    </button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap gap-4 mb-4">
                <select className="select select-bordered select-sm w-full md:w-auto bg-transparent">
                    <option>All Pre-Checkup Status</option>
                    <option>Pending</option>
                    <option>Completed</option>
                </select>
                <select className="select select-bordered select-sm w-full md:w-auto bg-transparent">
                    <option>All Genders</option>
                    <option>Male</option>
                    <option>Female</option>
                </select>
                <select className="select select-bordered select-sm w-full md:w-auto bg-transparent">
                    <option>All Chambers</option>
                    {chambers.map(ch => <option key={ch._id} value={ch._id}>{ch.chamberName}</option>)}
                </select>
                <div className="flex-1 min-w-[200px] flex gap-2">
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input input-bordered input-sm w-full max-w-xs bg-transparent" 
                    />
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <input 
                    type="text" 
                    placeholder="Search patient info..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input input-bordered input-sm w-full max-w-xs bg-transparent" 
                />
            </div>

            {/* Data Table */}
            <div className="bg-[#EAF5F5] dark:bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#D1EAEA] dark:border-white/10 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead className="bg-[#008080] text-white">
                            <tr>
                                <th>Appointment ID</th>
                                <th>Serial</th>
                                <th>Patient Info</th>
                                <th>Phone</th>
                                <th>Type</th>
                                <th>Chamber</th>
                                <th>Appointment Date</th>
                                <th>Pre-Checkup</th>
                                <th>Consultancy Fee</th>
                                <th>Payment Status</th>
                                <th>Created At</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointmentsLoading ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-10">
                                        <span className="loading loading-spinner text-[#008080]"></span>
                                    </td>
                                </tr>
                            ) : appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="12" className="text-center py-10 text-gray-500">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appt) => (
                                    <tr key={appt._id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                        <td className="font-medium text-blue-600 dark:text-blue-400">{appt.appointmentId}</td>
                                        <td className="text-blue-600 dark:text-blue-400 font-medium">{appt.serial}</td>
                                        <td>
                                            <div className="font-medium">{appt.patientId?.fullName || '-'}</div>
                                            <div className="text-xs text-gray-500">{appt.patientId?.gender} | {appt.patientId?.age ? `${appt.patientId.age}y` : 'N/A'}</div>
                                        </td>
                                        <td>{appt.patientId?.phone || '-'}</td>
                                        <td>
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                                {appt.patientType === 'New Patient' ? 'New' : appt.patientType === 'Old Patient' ? 'Old' : 'Report'}
                                            </span>
                                        </td>
                                        <td className="text-gray-500 italic">{appt.chamberId?.chamberName || 'Default'}</td>
                                        <td>
                                            <div>{new Date(appt.appointmentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                            <div className="text-xs text-gray-500">{appt.appointmentTime}</div>
                                        </td>
                                        <td>
                                            <span className={`px-2 py-1 rounded text-xs font-medium text-white ${appt.preCheckupId ? 'bg-teal-600' : 'bg-gray-600'}`}>
                                                {appt.preCheckupId ? 'Completed' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="text-green-600 font-medium text-sm">৳{appt.chamberId?.consultancyFee || '0'}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span className="bg-gray-800 text-white text-[10px] px-2 py-1 rounded uppercase tracking-wider">Unpaid</span>
                                                <button className="btn btn-xs border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent">Collect</button>
                                            </div>
                                        </td>
                                        <td className="text-xs text-gray-500">
                                            {new Date(appt.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })}
                                        </td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button className="btn btn-xs btn-square bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
                                                    <HiEye className="text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <button onClick={() => handleEditClick(appt)} className="btn btn-xs btn-square bg-transparent border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800">
                                                    <HiPencilSquare className="text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(appt)} className="btn btn-xs btn-square bg-transparent border-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-gray-600">
                                                    <HiTrash className="text-red-500" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                <div className="p-4 bg-white dark:bg-[#1a1a1a] border-t border-black/5 dark:border-white/5 flex justify-between items-center text-sm text-gray-500">
                    <div>
                        Showing {(page - 1) * limit + 1 > paginationData.totalItems ? 0 : (page - 1) * limit + 1} to {Math.min(page * limit, paginationData.totalItems)} of {paginationData.totalItems} entries
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span>Rows per page</span>
                            <select 
                                value={limit} 
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }} 
                                className="select select-bordered select-xs bg-transparent"
                            >
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>
                        {paginationData.totalPages > 1 && (
                            <Pagination
                                currentPage={paginationData.currentPage}
                                totalPages={paginationData.totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>

            <AppointmentFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appointment={selectedAppointment}
                onSuccess={fetchAppointmentsData}
                currentBranch={branch}
            />
            
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                itemName={`Appointment ${appointmentToDelete?.appointmentId || ''}`}
                isDeleting={isDeleting}
            />
        </div>
    );
};

export default Appointments;