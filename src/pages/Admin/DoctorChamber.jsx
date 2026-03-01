import React, { useState, useEffect } from "react";
import axios from "axios";

// Base URL for the chambers API
const API_URL = "http://localhost:5000/api/chambers"; 

const DoctorChamber = () => {
  const [chambers, setChambers] = useState([]);
  const [loading, setLoading] = useState(false);

  // State matches Mongoose schema exactly
  const [formData, setFormData] = useState({
    chamberName: "",
    address: "",
    phoneNumber: "",
    description: "",
    advanceBookingDays: "",
    branch: "",
  });

  // Fetch from MongoDB
  useEffect(() => {
    const fetchChambers = async () => {
      try {
        setLoading(true);
        // Backend expects GET to "/" for all chambers, so this stays the same
        const response = await axios.get(API_URL);
        setChambers(response.data);
      } catch (error) {
        console.error("Error fetching chambers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChambers();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // UPDATED: Added "/post" to match the backend route
      const response = await axios.post(`${API_URL}/post`, formData);
      
      // Add the newly created chamber (returned from DB) to our UI
      setChambers((prev) => [response.data, ...prev]);

      // Reset form
      setFormData({
        chamberName: "",
        address: "",
        phoneNumber: "",
        description: "",
        advanceBookingDays: "",
        branch: "",
      });
    } catch (error) {
      console.error("Error creating chamber:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // UPDATED: Added "/delete/" to match the backend route
      await axios.delete(`${API_URL}/delete/${id}`);
      
      // Remove from UI
      setChambers((prev) => prev.filter((chamber) => chamber._id !== id));
    } catch (error) {
      console.error("Error deleting chamber:", error);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Closed: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Doctor Chambers</h1>
        </div>

        {/* Add Chamber Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Chamber</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="chamberName"
              placeholder="Chamber Name"
              value={formData.chamberName}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              name="advanceBookingDays"
              placeholder="Advance Booking Days"
              value={formData.advanceBookingDays}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <input
              type="text"
              name="branch"
              placeholder="Branch"
              value={formData.branch}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 lg:col-span-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Chamber
            </button>
          </form>
        </div>

        {/* Chambers Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading chambers...</div>
          ) : chambers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No chambers found.</div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 text-gray-700 uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Chamber Name</th>
                  <th className="px-6 py-3 text-left">Branch</th>
                  <th className="px-6 py-3 text-left">Address</th>
                  <th className="px-6 py-3 text-left">Phone</th>
                  <th className="px-6 py-3 text-left">Advance Booking</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {chambers.map((chamber) => (
                  <tr key={chamber._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{chamber.chamberName}</td>
                    <td className="px-6 py-4">{chamber.branch}</td>
                    <td className="px-6 py-4">{chamber.address}</td>
                    <td className="px-6 py-4">{chamber.phoneNumber}</td>
                    <td className="px-6 py-4">{chamber.advanceBookingDays} Days</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(chamber.status)}`}>
                        {chamber.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(chamber._id)}
                        className="text-red-600 hover:underline"
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

export default DoctorChamber;