import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';

const useAuth = (requireAuth = false) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiClient.get('/me');
                setUser(res.data);
                if (!res.data && requireAuth) {
                    navigate('/signin');
                }
            } catch (error) {
                if (requireAuth) {
                    navigate('/signin');
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [navigate, requireAuth]);

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout');
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return { user, setUser, handleLogout, isLoading };
};

export default useAuth;
