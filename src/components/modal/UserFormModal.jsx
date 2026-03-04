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
};

export default UserFormModal;