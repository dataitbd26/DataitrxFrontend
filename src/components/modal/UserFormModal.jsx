<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import useSuperAdmin from '../../Hook/useSuperAdmin';

const UserFormModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    photo: '',
    role: 'Compounders',
    status: 'active',
    branch: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { createUser, updateUser } = useSuperAdmin();

  const roleOptions = ["Compounders", "Assistants", "Doctor", "Admin", "SuperAdmin"];
  const statusOptions = ["active", "inactive", "on-leave"];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Kept empty intentionally for edits
        phone: user.phone || '',
        photo: user.photo || '',
        role: user.role || 'Compounders',
        status: user.status || 'active',
        branch: user.branch || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        photo: '',
        role: 'Compounders',
        status: 'active',
        branch: '',
      });
    }
    setFormError('');
    setShowPassword(false); // Reset password visibility on open
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.branch.trim()) {
      setFormError('Name, Email, and Branch are required fields.');
      setIsSubmitting(false);
      return;
    }

    if (!user?._id && !formData.password.trim()) {
      setFormError('Password is required for new users.');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { ...formData };
      
      // If editing and password is empty, don't send it to backend
      if (user?._id && !payload.password.trim()) {
        delete payload.password;
      }

      if (user?._id) {
        await updateUser(user._id, payload);
      } else {
        await createUser(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setFormError(err.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!isOpen) return null;

  // Reusable input class for modern look
  const inputClass = "input input-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:ring-1 focus:ring-sporty-blue/50 transition-all duration-200";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-casual-black/60 backdrop-blur-sm p-4">
      <div className="bg-base-100 dark:bg-casual-black w-full max-w-3xl rounded-2xl shadow-2xl border border-casual-black/10 dark:border-white/10 flex flex-col max-h-[90vh] overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-casual-black/10 dark:border-white/10 flex justify-between items-center bg-concrete/50 dark:bg-white/5">
          <h2 className="text-2xl font-bold text-casual-black dark:text-concrete font-secondary tracking-tight">
            {user ? 'Edit User Profile' : 'Create New User'}
          </h2>
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-circle btn-ghost text-casual-black dark:text-concrete hover:bg-casual-black/10 dark:hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-white dark:bg-transparent">
          {formError && (
            <div className="alert alert-error bg-fascinating-magenta/10 text-fascinating-magenta border border-fascinating-magenta/20 shadow-sm mb-6 text-sm rounded-lg p-4 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{formError}</span>
            </div>
          )}

          <form id="user-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- Personal Info Section --- */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-casual-black/50 dark:text-concrete/50 mb-4 pb-2 border-b border-casual-black/10 dark:border-white/10">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="form-control w-full">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">Full Name <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={inputClass} 
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>

                <div className="form-control w-full">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">Phone Number <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputClass} 
                    placeholder="+880 1..."
                    required
                  />
                </div>
                
                <div className="form-control w-full md:col-span-2">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">Photo URL</span>
                  </label>
                  <input 
                    type="url" 
                    name="photo"
                    value={formData.photo}
                    onChange={handleChange}
                    placeholder="https://example.com/photo.jpg"
                    className={inputClass} 
                  />
                </div>
              </div>
            </div>

            {/* --- Account Settings Section --- */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-casual-black/50 dark:text-concrete/50 mb-4 pb-2 border-b border-casual-black/10 dark:border-white/10">
                Account Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div className="form-control w-full">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">Email Address <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={inputClass} 
                    placeholder="john@example.com"
                    required
                  />
                </div>

                {/* Modern Toggle Password Field */}
                <div className="form-control w-full relative">
                  <label className="label pt-0 pb-1.5 flex justify-between">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">
                      Password {!user && <span className="text-fascinating-magenta">*</span>}
                    </span>
                    {user && (
                      <span className="text-xs text-casual-black/50 dark:text-concrete/50">(Leave blank to keep)</span>
                    )}
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-10`} 
                      placeholder="••••••••"
                      required={!user}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-casual-black/50 dark:text-concrete/50 hover:text-sporty-blue dark:hover:text-sporty-blue transition-colors focus:outline-none"
                    >
                      {showPassword ? (
                        <HiEyeSlash className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <HiEye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">System Role <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <select 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={`select select-bordered w-full bg-base-100 dark:bg-[#1a1a1a] border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:ring-1 focus:ring-sporty-blue/50 transition-colors`}
                    required
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="form-control w-full">
                  <label className="label pt-0 pb-1.5">
                    <span className="label-text text-casual-black dark:text-concrete font-medium">Branch <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <input 
                    type="text" 
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Main Branch"
                    className={inputClass} 
                    required
                  />
                </div>

                <div className="form-control w-full md:col-span-2 bg-casual-black/5 dark:bg-white/5 p-4 rounded-xl border border-casual-black/10 dark:border-white/10 mt-2">
                  <label className="label pt-0 pb-2">
                    <span className="label-text text-casual-black dark:text-concrete font-bold">Account Status <span className="text-fascinating-magenta">*</span></span>
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {statusOptions.map((status) => (
                      <label key={status} className="cursor-pointer flex items-center gap-2 bg-base-100 dark:bg-[#1a1a1a] px-4 py-2 rounded-lg border border-casual-black/10 dark:border-white/10 hover:border-sporty-blue/50 transition-colors">
                        <input 
                          type="radio" 
                          name="status" 
                          value={status}
                          checked={formData.status === status}
                          onChange={handleChange}
                          className="radio radio-sm radio-primary" 
                        />
                        <span className="label-text capitalize font-medium text-sm">{status.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-casual-black/10 dark:border-white/10 flex justify-end gap-3 bg-concrete/50 dark:bg-white/5">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn btn-ghost text-casual-black dark:text-concrete font-secondary hover:bg-casual-black/10 dark:hover:bg-white/10"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="user-form"
            className="btn bg-sporty-blue hover:bg-sporty-blue/90 text-concrete border-none font-secondary min-w-[120px] shadow-lg shadow-sporty-blue/30"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              user ? 'Save Changes' : 'Create User'
            )}
          </button>
        </div>

      </div>
    </div>
  );
=======
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useUserDoctor from '../../Hook/useUserDoctor';

const UserFormModal = ({ isOpen, onClose, user, onSuccess, branch }) => {
    const { createUser, updateUser, loading } = useUserDoctor();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                role: user.role || 'Staff',
                status: user.status || 'Active',
            });
        } else {
            reset({
                fullName: '',
                email: '',
                phone: '',
                role: 'Staff',
                status: 'Active',
                password: ''
            });
        }
    }, [user, reset, isOpen]);

    const onSubmit = async (data) => {
        try {
            const payload = { ...data, branch };
            if (user?._id) {
                // If editing, usually we don't send password unless modifying it
                const { password, ...updatePayload } = payload;
                await updateUser(user._id, updatePayload);
            } else {
                await createUser(payload);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Form Submission Error:", err);
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
            <div className="modal-box bg-white dark:bg-casual-black max-w-2xl">
                <h3 className="font-bold text-lg mb-4 text-casual-black dark:text-concrete">
                    {user ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase">Full Name *</label>
                        <input {...register("fullName", { required: "Name is required" })} className="input input-bordered bg-base-100 dark:bg-casual-black" />
                        {errors.fullName && <span className="text-error text-xs">{errors.fullName.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase">Email *</label>
                        <input {...register("email", { required: "Email is required" })} type="email" className="input input-bordered bg-base-100 dark:bg-casual-black" />
                        {errors.email && <span className="text-error text-xs">{errors.email.message}</span>}
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase">Phone</label>
                        <input {...register("phone")} className="input input-bordered bg-base-100 dark:bg-casual-black" />
                    </div>

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase">Role *</label>
                        <select {...register("role", { required: true })} className="select select-bordered bg-base-100 dark:bg-casual-black">
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Staff">Staff</option>
                            <option value="Receptionist">Receptionist</option>
                        </select>
                    </div>

                    {!user && (
                        <div className="form-control">
                            <label className="label text-xs font-bold uppercase">Password *</label>
                            <input {...register("password", { required: "Password is required for new users", minLength: { value: 6, message: "Minimum 6 characters" } })} type="password" className="input input-bordered bg-base-100 dark:bg-casual-black" />
                            {errors.password && <span className="text-error text-xs">{errors.password.message}</span>}
                        </div>
                    )}

                    <div className="form-control">
                        <label className="label text-xs font-bold uppercase">Status</label>
                        <select {...register("status")} className="select select-bordered bg-base-100 dark:bg-casual-black">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="modal-action md:col-span-2">
                        <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                        <button type="submit" className="btn bg-sporty-blue text-white border-none" disabled={loading}>
                            {loading && <span className="loading loading-spinner"></span>}
                            {user ? 'Update' : 'Save'} User
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
>>>>>>> 0ecf8b83d4e903c467e9aecd7442a099dd6eae68
};

export default UserFormModal;