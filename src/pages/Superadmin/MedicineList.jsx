import React, { useState, useEffect } from 'react';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fallback to localhost if env variable is missing
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        // Fetching from: http://localhost:5000/api/medicines
        const response = await fetch(`${backendUrl}/medicines`); 
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        console.error("Failed to fetch medicines:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [backendUrl]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Super Admin: Medicine List</h1>
      
      {loading && <p className="text-gray-500">Loading medicines...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left border-b">Brand Name</th>
                <th className="p-3 text-left border-b">Generic Name</th>
                <th className="p-3 text-left border-b">Strength</th>
                <th className="p-3 text-left border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med._id} className="hover:bg-gray-100">
                  <td className="p-3 border-b">{med.brandName}</td>
                  <td className="p-3 border-b">{med.genericName}</td>
                  <td className="p-3 border-b">{med.strength}</td>
                  <td className="p-3 border-b">
                    <span className={`px-2 py-1 text-sm rounded ${
                      med.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {med.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MedicineList;