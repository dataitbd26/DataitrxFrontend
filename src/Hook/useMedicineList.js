import { useState, useEffect, useCallback } from 'react';

export const useMedicineList = (initialPage = 1, limit = 10, manufacturerFilter = '') => {
  const [medicines, setMedicines] = useState([]);
  const [allFilteredMedicines, setAllFilteredMedicines] = useState([]); // Cache for client-side pagination
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  const fetchMedicines = useCallback(async (page, filter, currentLimit) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }) // Attach token dynamically
      };

      if (filter) {
        // ==============================================================
        // 1. FILTER FLOW: Hits /filter/manufacturer/:manufacturer
        // ==============================================================
        const encodedFilter = encodeURIComponent(filter);
        const response = await fetch(`${backendUrl}/medicines/filter/manufacturer/${encodedFilter}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `Filter API Failed (Status: ${response.status})`);
        }
        
        const data = await response.json();

        // STRICT VALIDATION: Ensure we are working with an array to prevent .slice() crashes
        const dataArray = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);

        setAllFilteredMedicines(dataArray); 
        
        // Calculate Client-Side Pagination
        const totalItems = dataArray.length;
        const totalPages = Math.ceil(totalItems / currentLimit) || 1;
        const safePage = page > totalPages ? totalPages : (page < 1 ? 1 : page);

        const startIndex = (safePage - 1) * currentLimit;
        setMedicines(dataArray.slice(startIndex, startIndex + currentLimit));

        setPagination({ currentPage: safePage, totalPages, totalItems });

      } else {
        // ==============================================================
        // 2. DEFAULT FLOW: Hits /?page=X&limit=Y
        // ==============================================================
        setAllFilteredMedicines([]); // Clear cache
        
        const response = await fetch(`${backendUrl}/medicines?page=${page}&limit=${currentLimit}`, {
          method: 'GET',
          headers,
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || `List API Failed (Status: ${response.status})`);
        }
        
        const result = await response.json();

        setMedicines(result.data || []);
        setPagination({
          currentPage: result.currentPage || 1,
          totalPages: result.totalPages || 1,
          totalItems: result.totalItems || 0,
        });
      }
    } catch (err) {
      console.error('API Error in useMedicineList:', err);
      setError(err.message);
      setMedicines([]); // Clear data on failure so UI doesn't freeze
    } finally {
      setLoading(false);
    }
  }, [backendUrl]);

  // Trigger fetch when the filter or limit changes. Forces page to reset to 1.
  useEffect(() => {
    fetchMedicines(1, manufacturerFilter, limit);
  }, [manufacturerFilter, limit, fetchMedicines]);

  // Handle Pagination Clicks
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      if (manufacturerFilter) {
        // Client-Side Slice
        const startIndex = (newPage - 1) * limit;
        setMedicines(allFilteredMedicines.slice(startIndex, startIndex + limit));
        setPagination(prev => ({ ...prev, currentPage: newPage }));
      } else {
        // Server-Side Fetch
        fetchMedicines(newPage, manufacturerFilter, limit);
      }
    }
  };

  const refetch = () => {
    fetchMedicines(pagination.currentPage, manufacturerFilter, limit);
  };

  const deleteMedicine = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/medicines/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
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

  return { medicines, loading, error, pagination, handlePageChange, refetch, deleteMedicine };
};