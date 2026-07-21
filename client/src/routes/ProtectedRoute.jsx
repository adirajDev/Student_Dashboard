import { Navigate, Outlet, useOutletContext } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // Receive the context (which includes user) from MainLayout
    const context = useOutletContext();
    const { user } = context || {};

    // If somehow there is no user, redirect to signin
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // Check if route has role restrictions and user meets them
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect students trying to access admin pages to their dashboard
        return <Navigate to="/dashboard" replace />;
    }

    if (user.role === 'college' && user.isFirstLogin && window.location.pathname !== '/force-password-reset') {
        return <Navigate to="/force-password-reset" replace />;
    }

    // Pass the context down to the actual dashboard components
    return <Outlet context={context} />;
};

export default ProtectedRoute;