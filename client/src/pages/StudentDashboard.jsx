import { useState } from 'react';
import useAuth from '../hooks/useAuth';
import SettingsModal from '../components/SettingsModal';
import Header from '../components/Header';
import { User as UserIcon, BookOpen, Phone, Mail } from 'lucide-react';

const StudentDashboard = () => {
    const { user, setUser, handleLogout } = useAuth();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    if (!user) return null;

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout} />            

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-[var(--ring)]">Here is an overview of your student profile.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <UserIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Full Name</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.name}</p>
                    </div>
                    
                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <Mail className="w-5 h-5" />
                            <span className="text-sm font-medium">Email Address</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)] truncate" title={user.email}>{user.email}</p>
                    </div>

                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">Enrolled Course</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.course}</p>
                    </div>

                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <Phone className="w-5 h-5" />
                            <span className="text-sm font-medium">Phone Number</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.phone}</p>
                    </div>
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

export default StudentDashboard;
