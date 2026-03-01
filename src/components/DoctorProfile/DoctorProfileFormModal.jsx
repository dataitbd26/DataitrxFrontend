import React, { useState, useEffect } from 'react';

const DoctorProfileFormModal = ({ isOpen, onClose, profile, onSuccess }) => {
  const initialFormState = {
    fullName: '',
    bmdcRegNumber: '',
    degree: '',
    designation: '',
    institution: '',
    email: '',
    phone: '',
    degreeAndDesignation: '',
    nid: '',
    location: '',
    address: '',
    division: '',
    district: '',
    postCode: '',
    department: '',
    consultancyFee: '',
    oldConsultancyFee: '',
    followUpDay: '',
    signature: '',
    branch: '',
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        ...initialFormState,
        ...profile,
      });
    } else {
      setFormData(initialFormState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const isUpdating = !!profile?._id;
      
      const url = isUpdating 
        ? `${backendUrl}/doctor-profiles/update/${profile._id}` 
        : `${backendUrl}/doctor-profiles/post`;
      const method = isUpdating ? 'PUT' : 'POST';

      // Parse numbers for fee fields before sending
      const payload = {
        ...formData,
        consultancyFee: Number(formData.consultancyFee),
        oldConsultancyFee: formData.oldConsultancyFee ? Number(formData.oldConsultancyFee) : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to save doctor profile');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">
            {profile ? 'Edit Doctor Profile' : 'Add New Doctor'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold text-xl">
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form id="doctor-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BMDC Reg Number *</label>
                  <input type="text" name="bmdcRegNumber" value={formData.bmdcRegNumber} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NID *</label>
                  <input type="text" name="nid" value={formData.nid} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Section 2: Professional Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Professional Detail</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree *</label>
                  <input type="text" name="degree" value={formData.degree} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <input type="text" name="designation" value={formData.designation} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Degree & Designation *</label>
                  <input type="text" name="degreeAndDesignation" value={formData.degreeAndDesignation} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution *</label>
                  <input type="text" name="institution" value={formData.institution} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input type="text" name="department" value={formData.department} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signature URL</label>
                  <input type="text" name="signature" value={formData.signature} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Section 3: Contact & Location */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch *</label>
                  <input type="text" name="branch" value={formData.branch} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
                  <input type="text" name="division" value={formData.division} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Post Code *</label>
                  <input type="text" name="postCode" value={formData.postCode} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>

            {/* Section 4: Fees & Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-4">Fees & Schedule</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultancy Fee *</label>
                  <input type="number" name="consultancyFee" value={formData.consultancyFee} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old Consultancy Fee</label>
                  <input type="number" name="oldConsultancyFee" value={formData.oldConsultancyFee} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow Up Day *</label>
                  <input type="text" name="followUpDay" value={formData.followUpDay} onChange={handleChange} required className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 shrink-0">
          <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 transition">
            Cancel
          </button>
          <button type="submit" form="doctor-form" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileFormModal;