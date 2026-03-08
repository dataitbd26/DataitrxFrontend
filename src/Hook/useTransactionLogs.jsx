import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing Transaction Activity Logs.
 * Handles pagination, synchronization, secure deletion, and filtering.
 */
export const useTransactionLogs = (limit = 10) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);

  const fetchLogs = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
      
      // Clean up empty filters to keep URL clean
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      );

      const queryParams = new URLSearchParams({
        page,
        limit,
        ...activeFilters
      }).toString();

      const response = await fetch(`http://localhost:5000/api/transaction-logs/paginated?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch activity logs");

      setLogs(data.logs);
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
      setTotalLogs(data.totalLogs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const deleteLog = async (id, currentFilters = {}) => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('adminToken');
    const response = await fetch(`http://localhost:5000/api/transaction-logs/delete/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Server failed to delete record');

    // Synchronize UI by re-fetching current page data with active filters
    await fetchLogs(currentPage, currentFilters);
    return data;
  };

  return { logs, loading, error, currentPage, totalPages, totalLogs, fetchLogs, deleteLog };
};