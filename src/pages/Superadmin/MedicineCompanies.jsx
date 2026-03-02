import React, { useState } from 'react';
import { useMedicineCompanies } from '../../Hook/useMedicineCompanies';

const MedicineCompanies = () => {
  const { companies, loading, error } = useMedicineCompanies();
  
  // State for the drill-down view
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyMedicines, setCompanyMedicines] = useState([]);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [medicineError, setMedicineError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  // Function to fetch medicines when a company is clicked
  const handleCompanyClick = async (manufacturer) => {
    setSelectedCompany(manufacturer);
    setLoadingMedicines(true);
    setMedicineError(null);

    try {
      const token = localStorage.getItem('token');
      
      // Hitting your protected filter route
      const response = await fetch(`${backendUrl}/medicines/filter/manufacturer/${encodeURIComponent(manufacturer)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '', 
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medicines for this company');
      }

      const data = await response.json();
      setCompanyMedicines(data);
    } catch (err) {
      console.error('Error fetching filtered medicines:', err);
      setMedicineError(err.message);
    } finally {
      setLoadingMedicines(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Super Admin: Medicine Companies</h1>
        <p className="text-gray-600 text-sm mt-1">
          Select a manufacturer to view all their associated medicines.
        </p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* LEFT COLUMN: List of Companies */}
        <div className="w-full lg:w-1/3">
          {loading && <p className="text-gray-500">Loading companies...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          
          {!loading && !error && companies.length > 0 && (
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 text-left font-semibold text-gray-700">Manufacturer Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {companies.map((company) => (
                    <tr 
                      key={company.id} 
                      onClick={() => handleCompanyClick(company.name)}
                      className={`cursor-pointer transition-colors ${
                        selectedCompany === company.name ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="p-3 text-gray-800 font-medium flex justify-between items-center">
                        {company.name}
                        <span className="text-gray-400 text-xs text-right">View &rarr;</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Medicines by Selected Company */}
        <div className="w-full lg:w-2/3">
          {!selectedCompany && (
            <div className="bg-gray-50 border border-gray-200 p-8 rounded text-center h-full flex items-center justify-center">
              <p className="text-gray-500">Click a company from the list to view their medicines.</p>
            </div>
          )}

          {selectedCompany && (
            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="text-lg font-bold">Medicines by: {selectedCompany}</h2>
              </div>
              
              <div className="p-4">
                {loadingMedicines && <p className="text-gray-500 my-4">Loading medicines...</p>}
                {medicineError && <p className="text-red-500 my-4">Error: {medicineError}</p>}
                
                {!loadingMedicines && !medicineError && companyMedicines.length === 0 && (
                  <p className="text-gray-500 my-4 text-center">No medicines found for this manufacturer.</p>
                )}

                {!loadingMedicines && !medicineError && companyMedicines.length > 0 && (
                  <div className="overflow-x-auto mt-2">
                    <table className="min-w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-2 text-left text-sm font-semibold text-gray-700">Brand</th>
                          <th className="p-2 text-left text-sm font-semibold text-gray-700">Generic</th>
                          <th className="p-2 text-left text-sm font-semibold text-gray-700">Strength</th>
                          <th className="p-2 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {companyMedicines.map((med) => (
                          <tr key={med._id} className="hover:bg-gray-50">
                            <td className="p-2 text-sm text-gray-800">{med.brandName || '-'}</td>
                            <td className="p-2 text-sm text-gray-800">{med.genericName || '-'}</td>
                            <td className="p-2 text-sm text-gray-600">{med.strength || '-'}</td>
                            <td className="p-2 text-sm">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                med.status === 'final' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {med.status || 'final'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default MedicineCompanies;