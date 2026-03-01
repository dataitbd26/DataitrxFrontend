import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/doctor-profiles";

/* ✅ Moved OUTSIDE (Fixes typing disappearing issue) */
const InputField = ({ name, placeholder, type = "text", required = true, value, onChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    value={value ?? ""}   // 🔥 Prevent undefined issue
    onChange={onChange}
    required={required}
    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
);

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Initial State matching your Mongoose Schema exactly
  const initialFormState = {
    fullName: "",
    bmdcRegNumber: "",
    degree: "",
    designation: "",
    institution: "",
    email: "",
    phone: "",
    degreeAndDesignation: "",
    nid: "",
    location: "",
    address: "",
    division: "",
    district: "",
    postCode: "",
    department: "",
    consultancyFee: "",
    oldConsultancyFee: "",
    followUpDay: "",
    signature: "",
    branch: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch from DB on load
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setProfiles(response.data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  /* ✅ Safer handleChange */
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  /* ✅ Handle File Upload specifically */
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      signature: e.target.files[0], // Store the actual file object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      // 🔥 Convert formData state to native FormData for file uploading
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      const response = await axios.post(API_URL, submitData, {
        headers: {
          "Content-Type": "multipart/form-data", // Tell server we are sending files
        },
      });

      setProfiles((prev) => [response.data, ...prev]);
      
      // Reset form and clear the file input manually
      setFormData(initialFormState);
      const fileInput = document.getElementById("signatureFileInput");
      if (fileInput) fileInput.value = ""; 

    } catch (error) {
      console.error("Error creating profile:", error);
      setErrorMsg(
        error.response?.data?.message || "Failed to create profile. Please check the fields."
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setProfiles((prev) => prev.filter((profile) => profile._id !== id));
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Profiles</h1>
        </div>

        {/* Add Profile Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-6 border-b pb-2">Add New Doctor</h2>
          
          {errorMsg && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Professional Identity */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Professional Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
                <InputField name="bmdcRegNumber" placeholder="BMDC Reg Number" value={formData.bmdcRegNumber} onChange={handleChange} />
                <InputField name="nid" placeholder="National ID (NID)" value={formData.nid} onChange={handleChange} />
                <InputField name="department" placeholder="Department" value={formData.department} onChange={handleChange} />
                <InputField name="designation" placeholder="Designation" value={formData.designation} onChange={handleChange} />
                <InputField name="degree" placeholder="Degree (e.g. MBBS, FCPS)" value={formData.degree} onChange={handleChange} />
                <InputField name="degreeAndDesignation" placeholder="Degree & Designation summary" value={formData.degreeAndDesignation} onChange={handleChange} />
                <InputField name="institution" placeholder="Institution" value={formData.institution} onChange={handleChange} />
              </div>
            </div>

            {/* Contact & Location */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
                <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                <InputField name="branch" placeholder="Branch" value={formData.branch} onChange={handleChange} />
                <InputField name="location" placeholder="General Location" value={formData.location} onChange={handleChange} />
                <InputField name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} />
                <InputField name="division" placeholder="Division" value={formData.division} onChange={handleChange} />
                <InputField name="district" placeholder="District" value={formData.district} onChange={handleChange} />
                <InputField name="postCode" placeholder="Post Code" value={formData.postCode} onChange={handleChange} />
              </div>
            </div>

            {/* Fees & Extras */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Fees & Additional Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField name="consultancyFee" type="number" placeholder="Consultancy Fee" value={formData.consultancyFee} onChange={handleChange} />
                <InputField name="oldConsultancyFee" type="number" placeholder="Old Consultancy Fee" required={false} value={formData.oldConsultancyFee} onChange={handleChange} />
                <InputField name="followUpDay" placeholder="Follow-up Day limit" value={formData.followUpDay} onChange={handleChange} />
                
                {/* 🔥 Replaced with standard file input */}
                <input 
                  type="file" 
                  name="signature" 
                  id="signatureFileInput"
                  accept="image/*"
                  onChange={handleFileChange} 
                  className="border border-gray-300 p-1.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-8 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Save Doctor Profile
            </button>
          </form>
        </div>

        {/* Profiles Data Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading profiles...</div>
          ) : profiles.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No doctor profiles found.</div>
          ) : (
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Doctor Info</th>
                  <th className="px-6 py-3">BMDC / Contact</th>
                  <th className="px-6 py-3">Location / Branch</th>
                  <th className="px-6 py-3">Fee</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{profile.fullName}</div>
                      <div className="text-xs text-gray-500">{profile.designation} at {profile.institution}</div>
                      <div className="text-xs text-gray-500">{profile.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-700">{profile.bmdcRegNumber}</div>
                      <div className="text-xs text-gray-500">{profile.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>{profile.branch}</div>
                      <div className="text-xs text-gray-500">{profile.district}, {profile.division}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-blue-600">
                      ৳{profile.consultancyFee}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(profile._id)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;