import React, { useState, useEffect, useContext } from 'react';
import { HiXMark, HiPlus, HiTrash } from 'react-icons/hi2';
import usePrescription from '../../Hook/usePrescription';
import { AuthContext } from '../../providers/AuthProvider';
import dayjs from 'dayjs';

const initialFormState = {
    patientName: '',
    patientAge: '',
    patientGender: '',
    patientPhone: '',
    status: 'Completed',
    bp: '',
    weight: '',
    pulse: '',
    temp: '',
    complaintsText: '',
    diagnosisText: '',
    adviceText: '',
};

const initialMedicineState = {
    name: '',
    dosage: '',
    duration: '',
    instruction: '',
    manufacturer: ''
};

const PrescriptionFormModal = ({ isOpen, onClose, prescription, onSuccess, branch }) => {
    const { user } = useContext(AuthContext); // Used for doctorId
    const { createPrescription, updatePrescription } = usePrescription();

    const [formData, setFormData] = useState(initialFormState);
    const [medicines, setMedicines] = useState([initialMedicineState]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form if editing
    useEffect(() => {
        if (prescription && isOpen) {
            setFormData({
                patientName: prescription.patient?.name || '',
                patientAge: prescription.patient?.age || '',
                patientGender: prescription.patient?.gender || '',
                patientPhone: prescription.patient?.phone || '',
                status: prescription.status || 'Completed',
                bp: prescription.vitals?.bp || '',
                weight: prescription.vitals?.weight || '',
                pulse: prescription.vitals?.pulse || '',
                temp: prescription.vitals?.temp || '',
                complaintsText: prescription.complaintsText || '',
                diagnosisText: prescription.diagnosisText || '',
                adviceText: prescription.adviceText || '',
            });
            setMedicines(prescription.medicines?.length ? prescription.medicines : [initialMedicineState]);
        } else if (isOpen) {
            setFormData(initialFormState);
            setMedicines([initialMedicineState]);
        }
        setError('');
    }, [prescription, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMedicineChange = (index, field, value) => {
        const updatedMedicines = [...medicines];
        updatedMedicines[index][field] = value;
        setMedicines(updatedMedicines);
    };

    const addMedicineRow = () => {
        setMedicines([...medicines, { ...initialMedicineState }]);
    };

    const removeMedicineRow = (index) => {
        const updatedMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(updatedMedicines.length ? updatedMedicines : [{ ...initialMedicineState }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Construct Payload matching backend schema exactly
        const payload = {
            branch,
            doctorId: prescription?.doctorId || user?._id,
            status: formData.status,
            patient: {
                name: formData.patientName,
                age: formData.patientAge,
                gender: formData.patientGender,
                phone: formData.patientPhone
            },
            vitals: {
                bp: formData.bp,
                weight: formData.weight,
                pulse: formData.pulse,
                temp: formData.temp,
                // Optional vitals omitted for brevity, can be added
            },
            complaintsText: formData.complaintsText,
            diagnosisText: formData.diagnosisText,
            adviceText: formData.adviceText,
            // Filter out empty medicines to prevent validation errors on required 'name'
            medicines: medicines.filter(m => m.name.trim() !== '')
        };

        try {
            if (prescription) {
                await updatePrescription(prescription._id, payload);
            } else {
                // Auto-generate a basic prescriptionId for new records (in a real app, backend might do this)
                payload.prescriptionId = `RX-${dayjs().format('YYYYMMDD')}-${Math.floor(1000 + Math.random() * 9000)}`;
                await createPrescription(payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err?.message || "Something went wrong saving the prescription.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-casual-black/60 backdrop-blur-sm p-4">
            <div className="bg-concrete dark:bg-[#1a1a1a] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-box shadow-xl border border-casual-black/10 dark:border-white/10 flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-casual-black/10 dark:border-white/10 sticky top-0 bg-concrete dark:bg-[#1a1a1a] z-10">
                    <h2 className="text-xl font-bold text-casual-black dark:text-concrete font-secondary">
                        {prescription ? 'Edit Prescription' : 'Create New Prescription'}
                    </h2>
                    <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-casual-black dark:text-concrete">
                        <HiXMark className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {error && (
                        <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border-fascinating-magenta/20 mb-6">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8" id="prescription-form">

                        {/* Section 1: Patient Info */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-casual-black/10 dark:border-white/10 pb-2 mb-4 text-casual-black dark:text-concrete">Patient Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Patient Name *</span></label>
                                    <input type="text" name="patientName" required value={formData.patientName} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Phone</span></label>
                                    <input type="text" name="patientPhone" value={formData.patientPhone} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Age</span></label>
                                    <input type="text" name="patientAge" value={formData.patientAge} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Gender</span></label>
                                    <select name="patientGender" value={formData.patientGender} onChange={handleChange} className="select select-bordered bg-transparent dark:border-white/20">
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Vitals */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-casual-black/10 dark:border-white/10 pb-2 mb-4 text-casual-black dark:text-concrete">Vitals</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Blood Pressure</span></label>
                                    <input type="text" name="bp" placeholder="e.g. 120/80" value={formData.bp} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Pulse</span></label>
                                    <input type="text" name="pulse" placeholder="e.g. 72 bpm" value={formData.pulse} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Weight</span></label>
                                    <input type="text" name="weight" placeholder="e.g. 70 kg" value={formData.weight} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Temperature</span></label>
                                    <input type="text" name="temp" placeholder="e.g. 98.6 F" value={formData.temp} onChange={handleChange} className="input input-bordered bg-transparent dark:border-white/20" />
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Clinical Notes */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-casual-black/10 dark:border-white/10 pb-2 mb-4 text-casual-black dark:text-concrete">Clinical Notes</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Complaints</span></label>
                                    <textarea name="complaintsText" value={formData.complaintsText} onChange={handleChange} className="textarea textarea-bordered h-24 bg-transparent dark:border-white/20" placeholder="Chief complaints..."></textarea>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Diagnosis</span></label>
                                    <textarea name="diagnosisText" value={formData.diagnosisText} onChange={handleChange} className="textarea textarea-bordered h-24 bg-transparent dark:border-white/20" placeholder="Clinical diagnosis..."></textarea>
                                </div>
                            </div>
                        </section>

                        {/* Section 4: Medicines */}
                        <section>
                            <div className="flex justify-between items-center border-b border-casual-black/10 dark:border-white/10 pb-2 mb-4">
                                <h3 className="text-lg font-semibold text-casual-black dark:text-concrete">Medicines</h3>
                                <button type="button" onClick={addMedicineRow} className="btn btn-xs bg-sporty-blue/20 text-sporty-blue border-none hover:bg-sporty-blue hover:text-white">
                                    <HiPlus /> Add Medicine
                                </button>
                            </div>

                            <div className="space-y-3">
                                {medicines.map((med, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-casual-black/5 dark:bg-white/5 p-3 rounded-box">
                                        <input type="text" placeholder="Medicine Name *" required className="input input-bordered input-sm w-full md:w-1/3 bg-transparent dark:border-white/20" value={med.name} onChange={(e) => handleMedicineChange(index, 'name', e.target.value)} />
                                        <input type="text" placeholder="Dosage (e.g. 1+0+1)" className="input input-bordered input-sm w-full md:w-1/4 bg-transparent dark:border-white/20" value={med.dosage} onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)} />
                                        <input type="text" placeholder="Duration (e.g. 5 Days)" className="input input-bordered input-sm w-full md:w-1/4 bg-transparent dark:border-white/20" value={med.duration} onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)} />
                                        <input type="text" placeholder="Instruction (e.g. After Meal)" className="input input-bordered input-sm w-full md:w-1/4 bg-transparent dark:border-white/20" value={med.instruction} onChange={(e) => handleMedicineChange(index, 'instruction', e.target.value)} />
                                        <button type="button" onClick={() => removeMedicineRow(index)} className="btn btn-sm btn-ghost text-fascinating-magenta w-full md:w-auto mt-2 md:mt-0">
                                            <HiTrash className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Section 5: Status & Advice */}
                        <section>
                            <h3 className="text-lg font-semibold border-b border-casual-black/10 dark:border-white/10 pb-2 mb-4 text-casual-black dark:text-concrete">Finalize</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">General Advice</span></label>
                                    <textarea name="adviceText" value={formData.adviceText} onChange={handleChange} className="textarea textarea-bordered h-24 bg-transparent dark:border-white/20" placeholder="Lifestyle advice, next visit details..."></textarea>
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text dark:text-concrete/80">Status</span></label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="select select-bordered bg-transparent dark:border-white/20">
                                        <option value="Draft">Draft</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-casual-black/10 dark:border-white/10 flex justify-end gap-3 sticky bottom-0 bg-concrete dark:bg-[#1a1a1a] z-10 rounded-b-box">
                    <button type="button" onClick={onClose} className="btn btn-ghost font-secondary dark:text-concrete">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="prescription-form"
                        className="btn bg-sporty-blue hover:bg-sporty-blue/90 text-concrete border-none font-secondary"
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : (prescription ? 'Update' : 'Save')}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PrescriptionFormModal;