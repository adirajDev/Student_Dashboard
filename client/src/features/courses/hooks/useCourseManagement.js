import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useCourseManagement = shouldFetch => {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchCourses = useCallback(async () => {
        if (!shouldFetch) return;

        setIsLoading(true);
        setError('');
        try {
            const res = await apiClient.get(
                `/courses?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearchTerm)}`
            );
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            const sortedCourses = data.sort((a, b) =>
                a.name.toLowerCase().localeCompare(b.name.toLowerCase())
            );
            setCourses(sortedCourses);
            if (res.data.totalPages) {
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            setError('Failed to load courses');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [shouldFetch, page, debouncedSearchTerm]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const addCourse = async courseData => {
        try {
            const res = await apiClient.post(
                '/courses/create-course',
                courseData
            );
            setCourses(prev =>
                [...prev, res.data].sort((a, b) =>
                    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to add course',
            };
        }
    };

    const updateCourse = async (id, courseData) => {
        try {
            const res = await apiClient.put(
                `/courses/update-course/${id}`,
                courseData
            );
            setCourses(prev =>
                prev
                    .map(c => (c._id === id ? res.data : c))
                    .sort((a, b) =>
                        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    )
            );
            return { success: true };
        } catch (err) {
            return {
                success: false,
                error: err.response?.data?.message || 'Failed to update course',
            };
        }
    };

    const deleteCourse = async id => {
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
        page,
        totalPages,
        setPage,
        searchTerm,
        setSearchTerm,
        addCourse,
        updateCourse,
        deleteCourse,
        refreshCourses: fetchCourses,
    };
};

export default useCourseManagement;
