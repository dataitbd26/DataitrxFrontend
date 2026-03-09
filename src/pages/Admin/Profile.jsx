import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import useDoctorProfile from '../../Hook/useDoctorProfile';
import useLocationData from '../../Hook/useLocationData';
import ImageUpload from '../../config/ImageUploadcpanel';
import SectionTitle from '../../components/common/SectionTitle'; // <-- Update this path to where your SectionTitle is saved

// Import React Icons
import { 
  HiOutlineUser, 
  HiOutlineAcademicCap, 
  HiOutlineIdentification, 
  HiOutlinePencilSquare,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiChevronUpDown
} from 'react-icons/hi2';
import { CgSpinner } from 'react-icons/cg';

const Profile = () => {
  const { branch } = useContext(AuthContext);
  const { getProfilesByBranch, updateProfile, loading, error } = useDoctorProfile();

  const [profileId, setProfileId] = useState(null);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    bmdcRegistrationNumber: '',
    degree: '',
    designation: '',
    institution: '',
    phone: '',
    email: '',
    nid: '',
    address: '',
    division: '',
    district: '',
    signature: '',
    doctorPicture: '',
    branch: branch || '',
  });

  const { divisions, availableDistricts } = useLocationData(formData.division);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!branch) return;
      try {
        setFetching(true);
        const response = await getProfilesByBranch(branch);
        if (response?.data && response.data.length > 0) {
          const profile = response.data[0];
          setProfileId(profile._id);

          setFormData({
            name: profile.name || '',
            bmdcRegistrationNumber: profile.bmdcRegistrationNumber || '',
            degree: profile.degree || '',
            designation: profile.designation || '',
            institution: profile.institution || '',
            phone: profile.phone || '',
            email: profile.email || '',
            nid: profile.nid || '',
            address: profile.address || '',
            division: profile.division || '',
            district: profile.district || '',
            signature: profile.signature || '',
            doctorPicture: profile.doctorPicture || '',
            branch: branch || '',
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, [branch, getProfilesByBranch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === 'division') {
        newData.district = '';
      }
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profileId) {
      alert("No profile ID found. Cannot update.");
      return;
    }
    try {
      await updateProfile(profileId, formData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update profile.");
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <CgSpinner className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium text-sm tracking-wide">Loading Profile Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 p-6 sm:p-10 selection:bg-blue-100 selection:text-blue-900">
      <div className=" mx-auto">
        
        {/* 🌟 Implemented SectionTitle Here 🌟 */}
        <SectionTitle 
          title="Edit Professional Profile"
          subtitle="Manage your public presence and medical credentials for patients to see."
        />

        {error && (
          <div className="mb-6 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200 flex items-center gap-2">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-md">
          
          {/* Section 1: Basic Information */}
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5 mb-8">
              <HiOutlineUser className="w-6 h-6 text-blue-600" />
              Basic Information
            </h2>

            {/* Profile Photo Upload */}
            <div className="flex items-center gap-6 mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="w-24 h-24 rounded-full bg-slate-200 overflow-hidden shadow-sm flex-shrink-0 border-4 border-white ring-1 ring-slate-200 relative">
                <img
                  src={formData.doctorPicture || "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Profile Photo</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">Upload a professional headshot. PNG or JPG, max 5MB.</p>
                <div className="flex items-center gap-4">
                  <div className="relative inline-block overflow-hidden bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg text-slate-700 font-medium text-xs px-5 py-2.5 cursor-pointer shadow-sm">
                     <span className="relative z-10 pointer-events-none">Update Photo</span>
                     <div className="absolute inset-0 opacity-0 cursor-pointer">
                        <ImageUpload setImageUrl={(url) => setFormData(prev => ({ ...prev, doctorPicture: url }))} />
                     </div>
                  </div>
                  <button type="button" className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors" onClick={() => setFormData(prev => ({ ...prev, doctorPicture: '' }))}>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="e.g. James Smith, MD" />
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="e.g. General Surgeon" />
              </div>
            </div>
          </div>

          {/* Section 2: Professional Qualifications */}
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5 mb-8">
              <HiOutlineAcademicCap className="w-6 h-6 text-blue-600" />
              Professional Qualifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Institution</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="e.g. Harvard Medical School" />
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Degree</label>
                <input type="text" name="degree" value={formData.degree} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="e.g. MBBS, FCPS" />
              </div>
              <div className="md:col-span-2 group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">BMDC Registration Number</label>
                <input type="text" name="bmdcRegistrationNumber" value={formData.bmdcRegistrationNumber} onChange={handleChange} required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="e.g. A-12345" />
              </div>
            </div>
          </div>

          {/* Section 3: Contact Details */}
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5 mb-8">
              <HiOutlineIdentification className="w-6 h-6 text-blue-600" />
              Contact Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineEnvelope className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="doctor@hospital.com" />
                </div>
              </div>
              <div className="group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <HiOutlinePhone className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="md:col-span-2 group">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Office Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiOutlineMapPin className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full pl-11 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200" placeholder="123 Health St, Medical District" />
                </div>
              </div>

              {/* Division Dropdown */}
              <div className="group relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Division</label>
                <select 
                  name="division" 
                  value={formData.division} 
                  onChange={handleChange} 
                  className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 cursor-pointer"
                >
                  <option value="" disabled>Select Division</option>
                  {divisions.map((div) => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 pointer-events-none">
                   <HiChevronUpDown className="h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* District Dropdown */}
              <div className="group relative">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">District</label>
                <select 
                  name="district" 
                  value={formData.district} 
                  onChange={handleChange} 
                  disabled={!formData.division} 
                  className="appearance-none w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all duration-200 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>Select District</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3 pointer-events-none">
                   <HiChevronUpDown className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: E-Signature */}
          <div className="p-8">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5 mb-6">
               <HiOutlinePencilSquare className="w-6 h-6 text-blue-600" />
              E-Signature
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              <div className="relative overflow-hidden bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 rounded-lg text-slate-700 font-medium text-xs px-5 py-2.5 cursor-pointer shadow-sm w-full sm:w-auto text-center">
                  <span className="relative z-10 pointer-events-none">Upload Signature</span>
                  <div className="absolute inset-0 opacity-0 cursor-pointer">
                    <ImageUpload setImageUrl={(url) => setFormData(prev => ({ ...prev, signature: url }))} />
                  </div>
              </div>
              {formData.signature && (
                <div className="h-16 w-auto border border-slate-200 rounded-lg p-2 bg-white shadow-sm flex items-center justify-center">
                  <img src={formData.signature} alt="Signature preview" className="h-full w-auto object-contain" />
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-4">
            <button type="button" className="px-6 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-all duration-200">
              Cancel Changes
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 rounded-xl transition-all duration-200 flex items-center justify-center min-w-[150px] active:scale-95"
            >
              {loading ? (
                <CgSpinner className="w-5 h-5 animate-spin text-white" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>

        {/* Delete Profile Section */}
        <div className="mt-8 bg-red-50/50 border border-red-100 hover:border-red-200 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors duration-300">
          <div>
            <h3 className="text-base font-bold text-red-700">Delete Profile</h3>
            <p className="text-sm text-red-600/80 mt-1">This will permanently remove your medical profile from the system.</p>
          </div>
          <button type="button" className="px-6 py-2.5 text-sm font-bold text-red-600 border-2 border-red-200 bg-white hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl transition-all duration-200 whitespace-nowrap active:scale-95 shadow-sm">
            Deactivate Account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Profile;