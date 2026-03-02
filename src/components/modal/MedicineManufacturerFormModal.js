import React, { useState, useEffect } from 'react';
import useMedicineManufacturer from '../../Hook/useMedicineManufacturer';

const MedicineCompanyFormModal = ({ isOpen, onClose, company, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    short_name: '',
    established_year: '',
    status: 'Active',
    phone: '',
    email: '',
    website: '',
    logo: ''
  });
  
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createMedicineManufacturer, updateMedicineManufacturer } = useMedicineManufacturer();

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        short_name: company.short_name || '',
        established_year: company.established_year || '',
        status: company.status || 'Active',
        phone: company.phone || '',
        email: company.email || '',
        website: company.website || '',
        logo: company.logo || ''
      });
    } else {
      setFormData({
        name: '',
        short_name: '',
        established_year: '',
        status: 'Active',
        phone: '',
        email: '',
        website: '',
        logo: ''
      });
    }
    setFormError('');
  }, [company, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name) {
      setFormError('Manufacturer name is required.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        established_year: formData.established_year ? Number(formData.established_year) : undefined,
      };

      if (company?._id) {
        await updateMedicineManufacturer(company._id, payload);
      } else {
        await createMedicineManufacturer(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setFormError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-casual-black/50 backdrop-blur-sm p-4">
      <div className="bg-base-100 dark:bg-casual-black w-full max-w-2xl rounded-box shadow-xl border border-casual-black/10 dark:border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-casual-black/10 dark:border-white/10 flex justify-between items-center bg-concrete dark:bg-white/5 rounded-t-box">
          <h2 className="text-xl font-bold text-casual-black dark:text-concrete font-secondary">
            {company ? 'Edit Manufacturer' : 'Add New Manufacturer'}
          </h2>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost text-casual-black dark:text-concrete">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {formError && (
            <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border border-fascinating-magenta/20 shadow-sm mb-6 text-sm">
              {formError}
            </div>
          )}

          <form id="company-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Name */}
            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Manufacturer Name *</span>
              </label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Square Pharmaceuticals Ltd." 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
                required
              />
            </div>

            {/* Short Name */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Short Name</span>
              </label>
              <input 
                type="text" 
                name="short_name"
                value={formData.short_name}
                onChange={handleChange}
                placeholder="e.g. Square" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

            {/* Status */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Status *</span>
              </label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select select-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            {/* Established Year */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Established Year</span>
              </label>
              <input 
                type="number" 
                name="established_year"
                value={formData.established_year}
                onChange={handleChange}
                placeholder="e.g. 1958" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

            {/* Phone */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Phone</span>
              </label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Contact number" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

            {/* Email */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Email</span>
              </label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Contact email" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

            {/* Website */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Website</span>
              </label>
              <input 
                type="url" 
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

            {/* Logo URL */}
            <div className="form-control w-full md:col-span-2">
              <label className="label">
                <span className="label-text text-casual-black dark:text-concrete font-medium">Logo URL</span>
              </label>
              <input 
                type="text" 
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                placeholder="Image URL" 
                className="input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue" 
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-casual-black/10 dark:border-white/10 flex justify-end gap-3 bg-concrete dark:bg-white/5 rounded-b-box">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost text-casual-black dark:text-concrete font-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="company-form"
            className="btn bg-sporty-blue hover:bg-sporty-blue/90 text-concrete border-none font-secondary min-w-[100px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="loading loading-spinner loading-sm"></span> : company ? 'Update' : 'Save'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default MedicineCompanyFormModal;