import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Header from './Header';
import SettingsModal from './SettingsModal';
import Loading from '../utils/Loading';

const MainLayout = () => {
    const { user, setUser, handleLogout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!user) return <Loading />;

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout} />
            
            {/* The nested routes (Dashboards) will be rendered here and receive the user context */}
            <Outlet context={{ user, setUser }} />

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
