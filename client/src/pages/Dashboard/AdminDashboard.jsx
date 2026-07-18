import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, GraduationCap, LayoutDashboard, Settings, LogOut, Sun, Moon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import UserManagementSection from '../../features/users/components/UserManagementSection';
import GlobalSearch from '../../components/common/GlobalSearch';
import { useTheme } from '../../context/ThemeContext';

const AdminDashboard = () => {
    const { user, onSettingsOpen, onLogout } = useOutletContext();
    const { theme, toggleTheme } = useTheme();
    const isAdmin = user?.role === 'admin';

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // overview, editors, students

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--background)]">
            {/* Sidebar */}
            <aside 
                className={`${isSidebarOpen ? 'w-64' : 'w-20'} 
                transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 bg-[var(--card)] flex flex-col justify-between py-6`}
            >
                {/* Top Section */}
                <div className="flex flex-col gap-6 px-4">
                    {/* Toggle Button & Logo */}
                    <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'} px-2`}>
                        {isSidebarOpen && <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">AdminPanel</h1>}
                        <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[var(--foreground)]">
                            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="w-full">
                        {isSidebarOpen ? (
                            <div className="mx-2">
                                {/* GlobalSearch expects a max-w and padding, we'll wrap it */}
                                <div className="[&>div]:mx-0 [&>div]:max-w-full">
                                    <GlobalSearch />
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsSidebarOpen(true)} className="w-full flex justify-center p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[var(--foreground)]">
                                <Search className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Nav Links */}
                    <nav className="flex flex-col gap-2 mt-4">
                        <NavItem 
                            icon={<LayoutDashboard className="w-5 h-5" />} 
                            label="Overview" 
                            isActive={activeTab === 'overview'} 
                            onClick={() => setActiveTab('overview')}
                            isOpen={isSidebarOpen}
                        />
                        {isAdmin && (
                            <NavItem 
                                icon={<Users className="w-5 h-5" />} 
                                label="Editors" 
                                isActive={activeTab === 'editors'} 
                                onClick={() => setActiveTab('editors')}
                                isOpen={isSidebarOpen}
                            />
                        )}
                        <NavItem 
                            icon={<GraduationCap className="w-5 h-5" />} 
                            label="Students" 
                            isActive={activeTab === 'students'} 
                            onClick={() => setActiveTab('students')}
                            isOpen={isSidebarOpen}
                        />
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="flex flex-col gap-2 px-4 mt-auto">
                    <NavItem 
                        icon={theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />} 
                        label={`${theme === 'light' ? 'Dark' : 'Light'} Mode`} 
                        onClick={toggleTheme}
                        isOpen={isSidebarOpen}
                        hideActive
                    />
                    <NavItem 
                        icon={<Settings className="w-5 h-5" />} 
                        label="Settings" 
                        onClick={onSettingsOpen}
                        isOpen={isSidebarOpen}
                        hideActive
                    />
                    <NavItem 
                        icon={<LogOut className="w-5 h-5" />} 
                        label="Logout" 
                        onClick={onLogout}
                        isOpen={isSidebarOpen}
                        hideActive
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto">
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
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                    : 'text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800'}
                ${className}
            `}
        >
            <div className="flex-shrink-0">{icon}</div>
            {isOpen && <span className="ml-3 font-medium whitespace-nowrap">{label}</span>}
        </button>
    );
};

export default AdminDashboard;
