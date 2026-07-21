import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient';

const useUserManagement = (role, shouldFetch = true) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        if (!shouldFetch) return;
        try {
            setIsLoading(true);
            setError(null);
            const res = await apiClient.get(`/${role}s/get-${role}s`);
            setUsers(res.data);
        } catch (err) {
            setError(err.response?.data?.error || `Failed to fetch ${role}s.`);
        } finally {
            setIsLoading(false);
        }
    }, [role, shouldFetch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const addUser = async (userData) => {
        const res = await apiClient.post(`/${role}s/create-${role}`, userData);
        setUsers((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
        return res.data;
    };

    const updateUser = async (id, userData) => {
        const res = await apiClient.put(`/${role}s/update-${role}/${id}`, userData);
        setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)).sort((a, b) => a.name.localeCompare(b.name)));
    };

    const deleteUser = async (id) => {
        await apiClient.delete(`/${role}s/delete-${role}/${id}`);
        setUsers((prev) => prev.filter((u) => u._id !== id));
    };

    return { users, isLoading, error, addUser, updateUser, deleteUser };
};

export default useUserManagement;
