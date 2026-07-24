import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../services/apiClient';
import Loading from '../components/common/Loading';

const RootRedirect = () => {
    const [auth, setAuth] = useState({ loading: true, role: null });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await apiClient.get('/me');
                setAuth({
                    loading: false,
                    role: res.data ? res.data.role : null,
                });
            } catch (err) {
                setAuth({ loading: false, role: null });
            }
        };
        checkAuth();
    }, []);

    if (auth.loading) return <Loading />;

    // If not logged in, go to signin
    if (!auth.role) return <Navigate to="/signin" replace />;

    // If logged in, route to their respective dashboards
    if (auth.role === 'admin' || auth.role === 'editor') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;
