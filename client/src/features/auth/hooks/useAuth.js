import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const useAuth = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiClient.get('/me');
                setUser(res.data);
            } catch (error) {
                navigate('/signin');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout');
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return { user, setUser, handleLogout };
};

export default useAuth;
