import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import apiClient from '../api/apiClient';
import Loading from '../utils/Loading';

const ProtectedRoute = ({ allowedRoles }) => {
    const [auth, setAuth] = useState({ isAuthenticated: false, role: null, loading: true });

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await apiClient.get('/me');
                setAuth({ isAuthenticated: true, role: res.data.role, loading: false });
            } catch (error) {
                setAuth({ isAuthenticated: false, role: null, loading: false });
            }
        };
        verifyAuth();
    }, []);

    if (auth.loading) return <Loading />; 

    if (!auth.isAuthenticated) {
        return <Navigate to="/signin" replace />;
    }

    // Check if route has role restrictions and user meets them
    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        // Redirect students trying to access admin pages to their dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />; // Renders the nested routes
};

export default ProtectedRoute;