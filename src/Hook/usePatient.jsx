import { useState, useCallback } from 'react';
import UseAxiosSecure from './UseAxioSecure';

const usePatient = () => {
    const axiosSecure = UseAxiosSecure();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getPatientsByBranch = useCallback(async (branch, params) => {
        setLoading(true);
        setError(null);
        try {
            // Endpoint: /patients/:branch/get-all
            const { data } = await axiosSecure.get(`/patients/${branch}/get-all`, { params });
            // console.log("Fetched Patients:", data);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axiosSecure]);

    const createPatient = async (patientData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axiosSecure.post('/patients/post', patientData);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePatient = async (id, updateData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axiosSecure.put(`/patients/update/${id}`, updateData);
            return data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message;
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removePatient = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axiosSecure.delete(`/patients/delete/${id}`);
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
        getPatientsByBranch,
        createPatient,
        updatePatient,
        removePatient,
    };
};

export default usePatient;