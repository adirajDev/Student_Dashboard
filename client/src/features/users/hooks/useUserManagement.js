import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const ROLE_URL_SEGMENTS = {
    student: 'students',
    editor: 'editors',
    blogger: 'bloggers',
    collegeUser: 'college-users',
};

const useUserManagement = (role, shouldFetch = true) => {
    const urlSegment = ROLE_URL_SEGMENTS[role] || `${role}s`;
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
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

    const fetchUsers = useCallback(async () => {
        if (!shouldFetch) return;
        try {
            setIsLoading(true);
            setError(null);
            const res = await apiClient.get(
                `/${urlSegment}?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearchTerm)}`
            );
            const data = Array.isArray(res.data) ? res.data : res.data.data;
            setUsers(data);
            if (res.data.totalPages) {
                setTotalPages(res.data.totalPages);
            }
        } catch (err) {
            setError(err.response?.data?.error || `Failed to fetch ${role}s.`);
        } finally {
            setIsLoading(false);
        }
    }, [role, shouldFetch, page, debouncedSearchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = async userData => {
        const res = await apiClient.post(`/${urlSegment}`, userData);
        const newUser = res.data.data;
        setUsers(prev =>
            [...prev, newUser].sort((a, b) => a.name.localeCompare(b.name))
        );
        return newUser;
    };

    const updateUser = async (id, userData) => {
        const res = await apiClient.put(`/${urlSegment}/${id}`, userData);
        const updatedUser = res.data.data;
        setUsers(prev =>
            prev
                .map(u => (u._id === id ? updatedUser : u))
                .sort((a, b) => a.name.localeCompare(b.name))
        );
    };

    const deleteUser = async id => {
        await apiClient.delete(`/${urlSegment}/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
    };

    const updateUserApplications = (userId, newApplications) => {
        setUsers(prev =>
            prev.map(u =>
                u._id === userId || u.id === userId
                    ? { ...u, applications: newApplications }
                    : u
            )
        );
    };

    return {
        users,
        isLoading,
        error,
        page,
        totalPages,
        setPage,
        searchTerm,
        setSearchTerm,
        addUser,
        updateUser,
        updateUserApplications,
        deleteUser,
    };
};

export default useUserManagement;
