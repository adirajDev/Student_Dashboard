import { Outlet, Navigate } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Topbar from './Topbar';

const PublicLayout = () => {
    // Pass false to not require auth, fetching user in background to provide context
    const { user, setUser, isLoading } = useAuth(false);

    // Prevent management roles from accessing public pages
    if (user && user.role !== 'student') {
        if (user.role === 'admin' || user.role === 'editor')
            return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'college')
            return <Navigate to="/college/dashboard" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[var(--background)] transition-colors duration-300">
            <Topbar transparentOnTop={false} />
            <main className="flex-1 pt-24">
                <Outlet context={{ user, setUser, isLoading }} />
            </main>
        </div>
    );
};

export default PublicLayout;
