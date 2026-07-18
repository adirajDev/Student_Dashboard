import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Users, GraduationCap, LayoutDashboard, Settings, LogOut, Sun, Moon, Search } from 'lucide-react';
import UserManagementSection from '../../features/users/components/UserManagementSection';
import AdminSearch from './AdminSearch';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
    const { user, onSettingsOpen, onLogout } = useOutletContext();
    const { theme, toggleTheme } = useTheme();
    const isAdmin = user?.role === 'admin';

    const [activeTab, setActiveTab] = useState('overview'); // overview, editors, students
    const navigate = useNavigate();

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)]">
            {/* Sidebar */}
            <aside 
                className="w-64 transition-all duration-300 ease-in-out m-4 rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/80 to-slate-50/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-md flex flex-col justify-between py-6 shrink-0 z-20"
            >
                {/* Top Section */}
                <div className="flex flex-col gap-6 px-4">
                    {/* Logo */}
                    <div className="flex items-center justify-between px-2">
                        <button onClick={() => setActiveTab('overview')} className="text-xl text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity font-semibold">AdminPanel</button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-2 mt-2">
                        <NavItem 
                            icon={<Search className="w-5 h-5" />} 
                            label="Search" 
                            isActive={activeTab === 'search'} 
                            onClick={() => setActiveTab('search')}
                            isOpen={true}
                        />
                        <NavItem 
                            icon={<LayoutDashboard className="w-5 h-5" />} 
                            label="Overview" 
                            isActive={activeTab === 'overview'} 
                            onClick={() => setActiveTab('overview')}
                            isOpen={true}
                        />
                        {isAdmin && (
                            <NavItem 
                                icon={<Users className="w-5 h-5" />} 
                                label="Editors" 
                                isActive={activeTab === 'editors'} 
                                onClick={() => setActiveTab('editors')}
                                isOpen={true}
                            />
                        )}
                        <NavItem 
                            icon={<GraduationCap className="w-5 h-5" />} 
                            label="Students" 
                            isActive={activeTab === 'students'} 
                            onClick={() => setActiveTab('students')}
                            isOpen={true}
                        />
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-2 px-4 mt-auto">
                    <NavItem 
                        icon={theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />} 
                        label={`${theme === 'light' ? 'Dark' : 'Light'} Mode`} 
                        onClick={toggleTheme}
                        isOpen={true}
                        hideActive
                    />
                    <NavItem 
                        icon={<Settings className="w-5 h-5" />} 
                        label="Settings" 
                        onClick={onSettingsOpen}
                        isOpen={true}
                        hideActive
                    />
                    <NavItem 
                        icon={<LogOut className="w-5 h-5" />} 
                        label="Logout" 
                        onClick={onLogout}
                        isOpen={true}
                        hideActive
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
                    {activeTab === 'search' && (
                        <div className="animate-fade-in">
                            <AdminSearch />
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <div className="mb-8 animate-fade-in">
                            <h2 className="text-3xl mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                            <p className="text-[var(--ring)]">Here is an overview of your management portal.</p>
                            
                            <div className="mt-8 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center text-[var(--ring)] flex flex-col items-center justify-center min-h-[300px]">
                                <LayoutDashboard className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                                <p className="text-lg">Select an option from the sidebar to manage users.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'editors' && isAdmin && (
                        <div className="animate-fade-in">
                            <UserManagementSection
                                title="Editor Directory"
                                role="editor"
                                showCourse={false}
                                canAdd={isAdmin}
                                canDelete={isAdmin}
                                shouldFetch={isAdmin}
                            />
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div className="animate-fade-in">
                            <UserManagementSection
                                title="Student Directory"
                                role="student"
                                showCourse={true}
                                canAdd={isAdmin}
                                canDelete={isAdmin}
                                shouldFetch={true}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const NavItem = ({ icon, label, isActive, onClick, isOpen, hideActive, className = '' }) => {
    return (
        <button 
            onClick={onClick}
            title={!isOpen ? label : ''}
            className={`
                flex items-center p-3 rounded-full transition-all duration-200
                ${isOpen ? 'justify-start px-4' : 'justify-center'}
                ${isActive && !hideActive 
                    ? 'text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-[var(--foreground)] hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}
                ${className}
            `}
        >
            <div className="flex-shrink-0">{icon}</div>
            {isOpen && <span className="ml-3 font-medium whitespace-nowrap">{label}</span>}
        </button>
    );
};

export default AdminDashboard;
