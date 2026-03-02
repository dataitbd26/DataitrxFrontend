import React, { useState, useEffect } from "react";

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    medication: "",
    dosage: "",
    date: "",
  });

  // 🔌 Ready for backend integration
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);

        // 🔹 Replace this with API call later
        // const response = await axios.get("/api/prescriptions");
        // setPrescriptions(response.data);

        // Temporary mock data
        setPrescriptions([
          {
            id: 1,
            patientName: "Jane Smith",
            medication: "Amoxicillin",
            dosage: "500mg, 3x daily",
            date: "2026-03-02",
            status: "Active",
          },
        ]);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPrescription = {
      id: Date.now(),
      ...formData,
      status: "Active", // Default status for a new prescription
    };

    try {
      // 🔌 Replace with API POST later
      // await axios.post("/api/prescriptions", newPrescription);

      setPrescriptions((prev) => [...prev, newPrescription]);

      setFormData({
        patientName: "",
        medication: "",
        dosage: "",
        date: "",
      });
    } catch (error) {
      console.error("Error creating prescription:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // 🔌 Replace with API DELETE later
      // await axios.delete(`/api/prescriptions/${id}`);

      setPrescriptions((prev) => prev.filter((rx) => rx.id !== id));
    } catch (error) {
      console.error("Error deleting prescription:", error);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700",
      Completed: "bg-blue-100 text-blue-700",
      Discontinued: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Prescriptions
          </h1>
        </div>

        {/* Add Prescription */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Write New Prescription
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="text"
              name="medication"
              placeholder="Medication Name"
              value={formData.medication}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="text"
              name="dosage"
              placeholder="Dosage (e.g., 500mg, 2x daily)"
              value={formData.dosage}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <button
              type="submit"
              className="md:col-span-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Prescription
            </button>
          </form>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading prescriptions...
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No prescriptions found.
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Patient</th>
                  <th className="px-6 py-3 text-left">Medication</th>
                  <th className="px-6 py-3 text-left">Dosage</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {prescriptions.map((rx) => (
                  <tr
                    key={rx.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {rx.patientName}
                    </td>
                    <td className="px-6 py-4">{rx.medication}</td>
                    <td className="px-6 py-4">{rx.dosage}</td>
                    <td className="px-6 py-4">{rx.date}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(
                          rx.status
                        )}`}
                      >
                        {rx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(rx.id)}
                        className="text-red-600 hover:underline text-sm"
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

export default Prescriptions;