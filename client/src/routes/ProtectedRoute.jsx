import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ allowedRoles }) => {
    const context = useOutletContext();
    const { user, isLoading } = context || {};

    // Wait for auth check to complete
    if (isLoading) return <Loading />;

    // If somehow there is no user, redirect to signin
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // Check if route has role restrictions and user meets them
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'admin' || user.role === 'editor') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'college') return <Navigate to="/college/dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    // Pass the context down to the actual dashboard components
    return <Outlet context={context} />;
};

export default ProtectedRoute;
