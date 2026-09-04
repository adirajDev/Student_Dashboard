import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../../features/auth/hooks/useAuth';
import Sidebar from './Sidebar';
import SettingsModal from '../../features/profile/components/SettingsModal';
import Loading from '../common/Loading';

const SidebarLayout = () => {
    // Requires authenticated user
    const { user, setUser, handleLogout, isLoading } = useAuth(true);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (isLoading || !user)
        return <Loading message="Loading your dashboard..." />;

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)] transition-colors duration-300">
            <Sidebar
                user={user}
                onSettingsOpen={() => setIsSettingsOpen(true)}
                onLogout={handleLogout}
            />

            <main className="flex-1 overflow-y-auto pt-20 md:pt-0">
                <Outlet
                    context={{
                        user,
                        setUser,
                        onSettingsOpen: () => setIsSettingsOpen(true),
                        onLogout: handleLogout,
                    }}
                />
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

export default SidebarLayout;
