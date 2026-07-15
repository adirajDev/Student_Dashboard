import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import SettingsModal from '../components/SettingsModal';
import Header from '../components/Header';
import UserManagementSection from '../components/UserManagementSection';

const AdminDashboard = () => {
    const { user, setUser, handleLogout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!user) return null;

    const isAdmin = user.role === 'admin';

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout} />            

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-[var(--ring)]">Here is an overview of your management portal.</p>
                </div>

                <UserManagementSection
                    title="Student Directory"
                    role="student"
                    showCourse={true}
                    canAdd={isAdmin}
                    canDelete={isAdmin}
                    shouldFetch={true}
                />

                <div className={isAdmin ? "mt-16" : ""}>
                    <UserManagementSection
                        title="Editor Directory"
                        role="editor"
                        showCourse={false}
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={isAdmin}
                    />
                </div>
            </main>

            {isSettingsOpen && (
                <SettingsModal 
                    user={user} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onUpdate={(updatedUser) => setUser(updatedUser)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
