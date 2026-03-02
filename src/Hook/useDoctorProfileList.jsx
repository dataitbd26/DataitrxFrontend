import { useState, useEffect, useCallback } from 'react';

export const useDoctorProfileList = (initialPage = 1, limit = 10, branchFilter = '') => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: initialPage,
    totalPages: 1,
    totalItems: 0,
  });

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api';

  const fetchProfiles = useCallback(async (page, branch) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };

      // Construct URL based on whether a branch filter is applied
      const url = branch 
        ? `${backendUrl}/doctor-profiles/${encodeURIComponent(branch)}/get-all?page=${page}&limit=${limit}`
        : `${backendUrl}/doctor-profiles?page=${page}&limit=${limit}`;

      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor profiles');
      }

      const result = await response.json();

      // Backend returns { success, data, pagination: { totalItems, totalPages, currentPage, itemsPerPage } }
      setProfiles(result.data || []);
      setPagination({
        currentPage: result.pagination?.currentPage || 1,
        totalPages: result.pagination?.totalPages || 1,
        totalItems: result.pagination?.totalItems || 0,
      });

    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, limit]);

  useEffect(() => {
    fetchProfiles(pagination.currentPage, branchFilter);
  }, [fetchProfiles, pagination.currentPage, branchFilter]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const refetch = () => {
    fetchProfiles(pagination.currentPage, branchFilter);
  };

  const deleteProfile = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/doctor-profiles/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete profile');
      }

      refetch();
      return { success: true };
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, error: err.message };
    }
  };

  return { 
    profiles, 
    loading, 
    error, 
    pagination, 
    handlePageChange, 
    refetch, 
    deleteProfile 
  };
};