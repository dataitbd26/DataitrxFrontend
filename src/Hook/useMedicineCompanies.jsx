import { useState, useEffect } from 'react';

export const useMedicineCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Use the get-all endpoint to find all unique manufacturers
        const response = await fetch(`${backendUrl}/medicines/get-all`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch companies');
        }

        const data = await response.json();
        
        // Extract unique manufacturers and remove empties/nulls
        const uniqueCompanies = [...new Set(data.map(item => item.manufacturer).filter(Boolean))];
        
        // Map to an object format for easier rendering
        setCompanies(uniqueCompanies.map((name, index) => ({ id: index, name })));
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [backendUrl]);

  return { companies, loading, error };
};