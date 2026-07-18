import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Sidebar from './Sidebar';
import SettingsModal from '../../features/profile/components/SettingsModal';
import Loading from '../common/Loading';

const MainLayout = () => {
    const { user, setUser, handleLogout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    if (!user) return <Loading />;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)] transition-colors duration-300">
            <Sidebar user={user} onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout} />
            
            <main className="flex-1 overflow-y-auto">
                <Outlet context={{ user, setUser, onSettingsOpen: () => setIsSettingsOpen(true), onLogout: handleLogout }} />
            </main>

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
