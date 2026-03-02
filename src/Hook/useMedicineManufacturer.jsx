import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';

const useMedicineManufacturer = () => {
  const axiosSecure = UseAxiosSecure();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllMedicineManufacturers = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get('/medicine-manufacturers', { params });
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMedicineManufacturersByStatus = useCallback(async (status, params) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get(`/medicine-manufacturers/${status}/get-all`, { params });
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const getMedicineManufacturerById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.get(`/medicine-manufacturers/get-id/${id}`);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [axiosSecure]);

  const createMedicineManufacturer = async (manufacturerData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.post('/medicine-manufacturers/post', manufacturerData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMedicineManufacturer = async (id, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.put(`/medicine-manufacturers/update/${id}`, updateData);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeMedicineManufacturer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosSecure.delete(`/medicine-manufacturers/delete/${id}`);
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
    getAllMedicineManufacturers,
    getMedicineManufacturersByStatus,
    getMedicineManufacturerById,
    createMedicineManufacturer,
    updateMedicineManufacturer,
    removeMedicineManufacturer,
  };
};

export default useMedicineManufacturer;