import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useExams = (shouldFetch = true) => {
    const [exams, setExams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchExams = useCallback(async () => {
        if (!shouldFetch) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/exams');
            // Assuming the backend returns the array directly or inside data
            const data = Array.isArray(res.data)
                ? res.data
                : res.data.data || [];
            const sortedExams = data.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setExams(sortedExams);
        } catch (err) {
            setError('Failed to load exams');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    const getExamById = useCallback(async id => {
        try {
            const res = await apiClient.get(`/exams/${id}`);
            return { success: true, data: res.data };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to fetch exam',
            };
        }
    }, []);

    const addExam = useCallback(async examData => {
        try {
            const res = await apiClient.post('/exams', examData);
            const newExam = res.data.exam || res.data.data || res.data;
            setExams(prev =>
                [...prev, newExam].sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to add exam',
            };
        }
    }, []);

    const updateExam = useCallback(async (id, examData) => {
        try {
            const res = await apiClient.patch(`/exams/${id}`, examData);
            const updated = res.data.updatedExam || res.data.data || res.data;
            setExams(prev =>
                prev
                    .map(e => (e._id === id ? updated : e))
                    .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to update exam',
            };
        }
    }, []);

    const deleteExam = useCallback(async id => {
        try {
            await apiClient.delete(`/exams/${id}`);
            setExams(prev => prev.filter(e => e._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Failed to delete exam:', err);
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to delete exam',
            };
        }
    }, []);

    return {
        exams,
        isLoading,
        error,
        addExam,
        updateExam,
        deleteExam,
        getExamById,
        refreshExams: fetchExams,
    };
};

export default useExams;
