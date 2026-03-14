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
      Confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      Cancelled: "bg-red-100 text-red-700 dark:bg-fascinating-magenta/20 dark:text-fascinating-magenta",
    };
    return styles[status] || "bg-casual-black/10 text-casual-black/70 dark:bg-white/10 dark:text-concrete/70";
  };

  return (
    <div className="min-h-screen bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete font-primary p-6 transition-colors">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            Doctor Appointments
          </h1>
        </div>

        {/* Add Appointment */}
        <div className="bg-concrete dark:bg-white/5 p-6 rounded-box shadow-sm mb-8 border border-casual-black/5 dark:border-white/10 transition-colors">
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
              className="w-full p-2 rounded-lg bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
              required
            />

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
              required
            />

            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
              required
            />

            <input
              type="text"
              name="reason"
              placeholder="Reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-2 rounded-lg bg-base-100 dark:bg-casual-black text-casual-black dark:text-concrete border border-casual-black/20 dark:border-concrete/20 focus:border-sporty-blue focus:outline-none transition-colors"
            />

            <button
              type="submit"
              className="md:col-span-4 bg-sporty-blue hover:bg-sporty-blue/90 text-concrete py-2 rounded-lg transition-colors font-secondary border-none"
            >
              Add Appointment
            </button>
          </form>
        </div>

        {/* Appointments Table */}
        <div className="bg-concrete dark:bg-[#1a1a1a] rounded-box shadow-sm overflow-hidden border border-casual-black/5 dark:border-white/10 transition-colors">
          {loading ? (
            <div className="p-6 text-center text-casual-black/50 dark:text-concrete/50">
              <span className="loading loading-spinner loading-md text-sporty-blue"></span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="p-12 text-center text-casual-black/70 dark:text-concrete/70 text-lg font-medium">
              No appointments found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full text-casual-black dark:text-concrete">
                <thead className="bg-casual-black/5 dark:bg-white/5 text-casual-black dark:text-concrete font-secondary uppercase text-sm">
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
                      className="border-b border-b-casual-black/5 dark:border-b-white/5 hover:bg-casual-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-bold">
                        {appt.patientName}
                      </td>
                      <td className="px-6 py-4">{appt.date}</td>
                      <td className="px-6 py-4">{appt.time}</td>
                      <td className="px-6 py-4">{appt.reason}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusStyle(
                            appt.status
                          )}`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(appt.id)}
                          className="text-fascinating-magenta hover:opacity-80 hover:underline text-sm transition-opacity"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Appointments;