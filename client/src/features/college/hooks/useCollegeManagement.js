import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useCollegeManagement = (shouldFetch = true) => {
    const [colleges, setColleges] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchColleges = useCallback(async () => {
        if (!shouldFetch) return;
        
        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/colleges');
            const sortedColleges = res.data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setColleges(sortedColleges);
        } catch (err) {
            setError('Failed to load colleges');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch]);

    useEffect(() => {
        fetchColleges();
    }, [fetchColleges]);

    const addCollege = async (collegeData) => {
        try {
            const res = await apiClient.post('/colleges/create-college', collegeData);
            setColleges(prev => [...prev, res.data.college].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to add college' 
            };
        }
    };

    const updateCollege = async (id, collegeData) => {
        try {
            const res = await apiClient.patch(`/colleges/update-college/${id}`, collegeData);
            setColleges(prev => prev.map(c => c._id === id ? res.data : c).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to update college' 
            };
        }
    };

    const deleteCollege = async (id) => {
        try {
            await apiClient.delete(`/colleges/delete-college/${id}`);
            setColleges(prev => prev.filter(c => c._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Failed to delete college:', err);
            return { success: false, error: err.response?.data?.message || 'Failed to delete college' };
        }
    };

    return {
        colleges,
        isLoading,
        error,
        addCollege,
        updateCollege,
        deleteCollege,
        refreshColleges: fetchColleges
    };
};

export default useCollegeManagement;
