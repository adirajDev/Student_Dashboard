import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                await apiClient.get('/me');
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        verifyAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="animate-spin text-blue-500 w-12 h-12" />
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
