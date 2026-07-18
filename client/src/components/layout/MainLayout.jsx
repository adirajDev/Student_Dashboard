import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Header from './Header';
import SettingsModal from '../../features/profile/components/SettingsModal';
import Loading from '../common/Loading';

const MainLayout = () => {
    const { user, setUser, handleLogout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const location = useLocation();
    
    if (!user) return <Loading />;

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen relative animate-fade-in bg-[var(--background)] transition-colors duration-300">
            {!isAdminRoute && <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout} />}
            
            {/* The nested routes (Dashboards) will be rendered here and receive the user context */}
            <Outlet context={{ user, setUser, onSettingsOpen: () => setIsSettingsOpen(true), onLogout: handleLogout }} />

            {isSettingsOpen && (
                <SettingsModal 
                    user={user} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onUpdate={setUser} 
                />
            )}
        </div>
    );
};

export default MainLayout;
