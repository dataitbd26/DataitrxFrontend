import { useState, useEffect, useCallback } from 'react';

export const useMedicineList = (initialPage = 1, limit = 10, manufacturerFilter = '') => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  const fetchMedicines = useCallback(async (page, filter) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };

      let response;
      let result;

      // If a filter is applied, hit the filter route
      if (filter) {
        response = await fetch(`${backendUrl}/medicines/filter/manufacturer/${encodeURIComponent(filter)}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) throw new Error('Failed to fetch filtered medicines');
        result = await response.json();

        setMedicines(result || []);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: result.length || 0,
        });

      } else {
        // Normal paginated route
        response = await fetch(`${backendUrl}/medicines?page=${page}&limit=${limit}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) throw new Error('Failed to fetch medicines');
        result = await response.json();

        setMedicines(result.data || []);
        setPagination({
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.totalItems || 0,
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, limit]);

  // Notice we now listen for changes to the manufacturerFilter
  useEffect(() => {
    fetchMedicines(pagination.currentPage, manufacturerFilter);
  }, [fetchMedicines, pagination.currentPage, manufacturerFilter]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const refetch = () => {
    fetchMedicines(pagination.currentPage, manufacturerFilter);
  };

  const deleteMedicine = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/medicines/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete medicine');
      }

      refetch();
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, error: err.message };
    }
  };

  return { 
    medicines, 
    loading, 
    error, 
    pagination, 
    handlePageChange, 
    refetch,
    deleteMedicine 
  };
};