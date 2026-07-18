import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useCourseManagement = (shouldFetch) => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCourses = useCallback(async () => {
        if (!shouldFetch) return;
        
        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/data/courses');
            const sortedCourses = res.data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
            setCourses(sortedCourses);
        } catch (err) {
            setError('Failed to load courses');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const addCourse = async (courseData) => {
        try {
            const res = await apiClient.post('/courses/create-course', courseData);
            setCourses(prev => [...prev, res.data].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to add course' 
            };
        }
    };

    const updateCourse = async (id, courseData) => {
        try {
            const res = await apiClient.put(`/courses/update-course/${id}`, courseData);
            setCourses(prev => prev.map(c => c._id === id ? res.data : c).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
            return { success: true };
        } catch (err) {
            return { 
                success: false, 
                error: err.response?.data?.message || 'Failed to update course' 
            };
        }
    };

    const deleteCourse = async (id) => {
        try {
            await apiClient.delete(`/courses/delete-course/${id}`);
            setCourses(prev => prev.filter(c => c._id !== id));
            return { success: true };
        } catch (err) {
            console.error('Failed to delete course:', err);
            return { success: false, error: 'Failed to delete course' };
        }
    };

    return {
        courses,
        isLoading,
        error,
        addCourse,
        updateCourse,
        deleteCourse,
        refreshCourses: fetchCourses
    };
};

export default useCourseManagement;
