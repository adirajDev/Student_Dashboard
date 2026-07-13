import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useTheme } from '../context/ThemeContext';
import SettingsModal from '../components/SettingsModal';
import { Sun, Moon, Settings, LogOut, User as UserIcon, BookOpen, Phone, Mail } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiClient.get('/me');
                setUser(res.data);
            } catch (error) {
                navigate('/signin');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout');
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (!user) return null; // Or TODO: a loader(later)

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Header  // FIXME: make a component for header */}
            <header className="bg-[var(--card)] shadow-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">StudentPortal</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                        </button>
                        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[var(--foreground)]" title="Settings">
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Logout">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

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
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.phoneNumber}</p>
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

export default Dashboard;
