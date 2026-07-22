import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useUserManagement = (role, shouldFetch = true) => {
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
            const res = await apiClient.get(`/${role}s/get-${role}s?page=${page}&limit=10&search=${encodeURIComponent(debouncedSearchTerm)}`);
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
        const res = await apiClient.post(`/${role}s/create-${role}`, userData);
        setUsers(prev =>
            [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name))
        );
        return res.data;
    };

    const updateUser = async (id, userData) => {
        const res = await apiClient.put(
            `/${role}s/update-${role}/${id}`,
            userData
        );
        setUsers(prev =>
            prev
                .map(u => (u._id === id ? res.data : u))
                .sort((a, b) => a.name.localeCompare(b.name))
        );
    };

    const deleteUser = async id => {
        await apiClient.delete(`/${role}s/delete-${role}/${id}`);
        setUsers(prev => prev.filter(u => u._id !== id));
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
        deleteUser 
    };
};

export default useUserManagement;
