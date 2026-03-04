import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';

const useMedicine = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPaginatedMedicines = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get('/medicines', { params });
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getAllMedicines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get('/medicines/get-all');
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMedicineById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get(`/medicines/get-id/${id}`);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMedicinesByManufacturer = useCallback(async (manufacturer) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get(`/medicines/filter/manufacturer/${manufacturer}`);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMedicinesByGenericName = useCallback(async (genericName) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get(`/medicines/filter/generic/${genericName}`);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const createMedicine = async (medicineData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.post('/medicines/post', medicineData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMedicine = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.put(`/medicines/update/${id}`, updateData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMedicine = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.delete(`/medicines/delete/${id}`);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getPaginatedMedicines,
    getAllMedicines,
    getMedicineById,
    getMedicinesByManufacturer,
    getMedicinesByGenericName,
    createMedicine,
    updateMedicine,
    removeMedicine,
  };
};

export default useMedicine;