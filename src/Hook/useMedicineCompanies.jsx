import { useState, useEffect } from 'react';

export const useMedicineCompanies = () => {
  const [companies, setCompanies] = useState([]);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // 🔥 CRITICAL FIX: Using the base `/medicines` route because we KNOW this works 
        // from your screenshot. We pass a large limit to grab enough data to build the filter list.
        const response = await fetch(`${backendUrl}/medicines?limit=1000`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
        });

        if (!response.ok) throw new Error('Failed to fetch manufacturers');

        const result = await response.json();
        
        // The base route returns { data: [...] }. We safely extract the array.
        const dataArray = Array.isArray(result.data) ? result.data : [];
        
        // Extract unique 'manufacturer' names from the array and remove empty strings
        const uniqueManufacturers = [...new Set(dataArray.map(item => item.manufacturer).filter(Boolean))];
        
        // Format it perfectly for our ModernDropdown component
        setCompanies(uniqueManufacturers.map((name, index) => ({ id: index, name })));
      } catch (err) {
        console.error('Failed to extract manufacturers for dropdown:', err);
      }
    };

    fetchCompanies();
  }, [backendUrl]);

  return { companies };
};