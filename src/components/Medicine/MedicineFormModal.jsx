import React, { useState, useEffect } from 'react';

const MedicineFormModal = ({ isOpen, onClose, medicine, onSuccess }) => {
  const [formData, setFormData] = useState({
    genericName: '',
    brandName: '',
    packageMark: '',
    dosageType: '',
    strength: '',
    manufacturer: '',
    status: 'final',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  // Pre-fill form if editing an existing medicine
  useEffect(() => {
    if (medicine) {
      setFormData({
        genericName: medicine.genericName || '',
        brandName: medicine.brandName || '',
        packageMark: medicine.packageMark || '',
        dosageType: medicine.dosageType || '',
        strength: medicine.strength || '',
        manufacturer: medicine.manufacturer || '',
        status: medicine.status || 'final',
      });
    } else {
      // Reset form if creating new
      setFormData({
        genericName: '',
        brandName: '',
        packageMark: '',
        dosageType: '',
        strength: '',
        manufacturer: '',
        status: 'final',
      });
    }
  }, [medicine, isOpen]);

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
      
      // Determine if we are updating or creating based on the presence of medicine._id
      const isUpdating = !!medicine?._id;
      const url = isUpdating 
        ? `${backendUrl}/medicines/update/${medicine._id}` 
        : `${backendUrl}/medicines/post`;
      const method = isUpdating ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Failed to save medicine');
      }

      // Success
      onSuccess(); // Triggers the list refetch
      onClose();   // Closes the modal
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {medicine ? 'Edit Medicine' : 'Add New Medicine'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Napa"
              />
            </div>

            {/* Generic Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
              <input
                type="text"
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Paracetamol"
              />
            </div>

            {/* Dosage Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Type</label>
              <input
                type="text"
                name="dosageType"
                value={formData.dosageType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Tablet, Syrup"
              />
            </div>

            {/* Strength */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
              <input
                type="text"
                name="strength"
                value={formData.strength}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 500mg"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Beximco Pharma"
              />
            </div>

            {/* Package Mark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Package Mark</label>
              <input
                type="text"
                name="packageMark"
                value={formData.packageMark}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. Box of 100s"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="final">Final</option>
                <option value="pending">Pending</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300 transition flex items-center"
            >
              {loading ? 'Saving...' : 'Save Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineFormModal;