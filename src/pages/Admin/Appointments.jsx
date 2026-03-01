import React, { useState, useEffect } from "react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientName: "",
    date: "",
    time: "",
    reason: "",
  });

  // 🔌 Ready for backend integration
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        // 🔹 Replace this with API call later
        // const response = await axios.get("/api/appointments");
        // setAppointments(response.data);

        // Temporary mock data
        setAppointments([
          {
            id: 1,
            patientName: "John Doe",
            date: "2026-03-01",
            time: "10:00",
            reason: "General Checkup",
            status: "Confirmed",
          },
        ]);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: "Pending",
    };

    try {
      // 🔌 Replace with API POST later
      // await axios.post("/api/appointments", newAppointment);

      setAppointments((prev) => [...prev, newAppointment]);

      setFormData({
        patientName: "",
        date: "",
        time: "",
        reason: "",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // 🔌 Replace with API DELETE later
      // await axios.delete(`/api/appointments/${id}`);

      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Confirmed: "bg-green-100 text-green-700",
      Pending: "bg-yellow-100 text-yellow-700",
      Cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Doctor Appointments
          </h1>
        </div>

        {/* Add Appointment */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Schedule New Appointment
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
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="border p-2 rounded-lg"
              required
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={formData.reason}
              onChange={handleChange}
              className="border p-2 rounded-lg"
            />

            <button
              type="submit"
              className="md:col-span-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Appointment
            </button>
          </form>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-6 text-center text-gray-500">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No appointments found.
            </div>
          ) : (
            <table className="min-w-full">
              <thead className="bg-gray-200 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Patient</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Time</th>
                  <th className="px-6 py-3 text-left">Reason</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium">
                      {appt.patientName}
                    </td>
                    <td className="px-6 py-4">{appt.date}</td>
                    <td className="px-6 py-4">{appt.time}</td>
                    <td className="px-6 py-4">{appt.reason}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(
                          appt.status
                        )}`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(appt.id)}
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

export default Appointments;