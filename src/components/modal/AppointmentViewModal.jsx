import React, { useEffect, useState } from 'react';
import useAppointment from '../../Hook/useAppointment';
import { HiXMark } from "react-icons/hi2";

const AppointmentViewModal = ({ isOpen, onClose, appointmentId }) => {
    const [appointmentData, setAppointmentData] = useState(null);
    const { getAppointmentById, loading } = useAppointment();

    useEffect(() => {
        const fetchDetails = async () => {
            if (isOpen && appointmentId) {
                try {
                    const data = await getAppointmentById(appointmentId);
                    setAppointmentData(data);
                } catch (err) {
                    console.error("Failed to load details", err);
                }
            } else {
                setAppointmentData(null);
            }
        };
        fetchDetails();
    }, [isOpen, appointmentId, getAppointmentById]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-casual-black w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-red-500">
                    <HiXMark className="text-xl" />
                </button>
                <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-sporty-blue">Appointment Details</h2>
                    {loading || !appointmentData ? (
                        <div className="flex justify-center py-20">
                            <span className="loading loading-spinner text-sporty-blue loading-lg"></span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* General */}
                            <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                <h3 className="font-semibold text-lg mb-4 border-b border-gray-200 dark:border-white/10 pb-2">General Information</h3>
                                <div className="space-y-2">
                                    <p><strong className="text-gray-500 dark:text-gray-400">ID:</strong> {appointmentData.appointmentId}</p>
                                    <p><strong className="text-gray-500 dark:text-gray-400">Serial:</strong> {appointmentData.serial}</p>
                                    <p><strong className="text-gray-500 dark:text-gray-400">Date:</strong> {appointmentData.appointmentDate ? new Date(appointmentData.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                                    <p><strong className="text-gray-500 dark:text-gray-400">Time:</strong> {appointmentData.appointmentTime}</p>
                                    <p><strong className="text-gray-500 dark:text-gray-400">Pre-Checkup:</strong> <span className={`px-2 py-0.5 rounded text-xs text-white ${appointmentData.preCheckupId ? 'bg-sporty-blue' : 'bg-gray-400'}`}>{appointmentData.preCheckupId ? 'Completed' : 'Pending'}</span></p>
                                </div>
                            </div>
                            
                            {/* Patient Info */}
                            {appointmentData.patientId && (
                                <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                    <h3 className="font-semibold text-lg mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Patient Details</h3>
                                    <div className="space-y-2">
                                        <p><strong className="text-gray-500 dark:text-gray-400">Name:</strong> {appointmentData.patientId.fullName}</p>
                                        <p><strong className="text-gray-500 dark:text-gray-400">Phone:</strong> {appointmentData.patientId.phone}</p>
                                        <p><strong className="text-gray-500 dark:text-gray-400">Gender:</strong> {appointmentData.patientId.gender}</p>
                                        {appointmentData.patientId.age && <p><strong className="text-gray-500 dark:text-gray-400">Age:</strong> {appointmentData.patientId.age} years</p>}
                                        {appointmentData.patientId.bloodGroup && <p><strong className="text-gray-500 dark:text-gray-400">Blood Group:</strong> {appointmentData.patientId.bloodGroup}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Precheckup info */}
                            {appointmentData.preCheckupId && (
                                <div className="md:col-span-2 bg-sporty-blue/5 p-6 rounded-2xl border border-sporty-blue/20">
                                    <h3 className="font-semibold text-xl mb-4 border-b border-sporty-blue/20 pb-3 text-sporty-blue">Pre-Checkup Report</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {appointmentData.preCheckupId.examination?.vitals && (
                                            <div>
                                                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Vitals</h4>
                                                <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-400">
                                                    {appointmentData.preCheckupId.examination.vitals.weight && <li><strong>Weight:</strong> {appointmentData.preCheckupId.examination.vitals.weight} kg</li>}
                                                    {appointmentData.preCheckupId.examination.vitals.height && <li><strong>Height:</strong> {appointmentData.preCheckupId.examination.vitals.height} cm</li>}
                                                    {appointmentData.preCheckupId.examination.vitals.bp && <li><strong>BP:</strong> {appointmentData.preCheckupId.examination.vitals.bp} mmHg</li>}
                                                    {appointmentData.preCheckupId.examination.vitals.pulse && <li><strong>Pulse:</strong> {appointmentData.preCheckupId.examination.vitals.pulse} bpm</li>}
                                                    {appointmentData.preCheckupId.examination.vitals.temperature && <li><strong>Temp:</strong> {appointmentData.preCheckupId.examination.vitals.temperature} °F</li>}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {appointmentData.preCheckupId.conditions && typeof appointmentData.preCheckupId.conditions === 'object' && (
                                            <div>
                                                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Conditions</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {Object.entries(appointmentData.preCheckupId.conditions || {}).map(([key, val]) => (
                                                        val === true && (
                                                            <span key={key} className="bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 px-2 py-1 rounded-md text-xs capitalize whitespace-nowrap">
                                                                {key}
                                                            </span>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {appointmentData.preCheckupId.caseSummary && (
                                            <div className="md:col-span-3 mt-2 bg-white/50 dark:bg-black/20 p-4 rounded-xl">
                                                <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">Case Summary</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{appointmentData.preCheckupId.caseSummary}</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {appointmentData.preCheckupId.chiefComplaints && appointmentData.preCheckupId.chiefComplaints.length > 0 && (
                                        <div className="mt-6 border-t border-sporty-blue/10 pt-4">
                                            <h4 className="font-semibold mb-3 text-gray-700 dark:text-gray-300">Chief Complaints</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {appointmentData.preCheckupId.chiefComplaints.map((c, i) => (
                                                    <div key={i} className="bg-white dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-white/5 text-sm">
                                                        <span className="font-medium text-sporty-blue block">{c.complaint}</span>
                                                        <span className="text-gray-500 text-xs">Duration: {c.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentViewModal;
