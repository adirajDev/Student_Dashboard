import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Users, GraduationCap, LayoutDashboard, Settings, LogOut, Sun, Moon, Search, Menu, X, BookOpen, Library, Star, FileEdit } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const NavItem = ({ icon, label, isActive, onClick, hideActive, className = '' }) => {
    return (
        <button 
            onClick={onClick}
            className={`
                cursor-pointer flex items-center p-3 rounded-full transition-all duration-200 justify-start px-4
                ${isActive && !hideActive 
                    ? 'text-blue-600 dark:text-blue-400 font-medium' 
                    : 'text-[var(--foreground)] hover:bg-slate-100/50 dark:hover:bg-slate-800/50'}
                ${className}
            `}
        >
            <div className="flex-shrink-0">{icon}</div>
            <span className="ml-3 font-medium whitespace-nowrap">{label}</span>
        </button>
    );
};

const Sidebar = ({ user, onSettingsOpen, onLogout }) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isEditor = user?.role === 'editor';
    const isStudent = user?.role === 'student';
    const isCollege = user?.role === 'college';

    // Determine active tab based on current URL
    let activeTab = 'overview';
    if (location.pathname === '/search') {
        activeTab = 'search';
    } else if (location.pathname === '/dashboard') {
        activeTab = searchParams.get('tab') || 'overview';
    } else if (location.pathname.startsWith('/admin')) {
        activeTab = searchParams.get('tab') || 'overview';
    } else if (location.pathname === '/college/dashboard') {
        activeTab = searchParams.get('tab') || 'edit';
    }

    const handleNav = (path) => {
        navigate(path);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-3 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-md text-[var(--foreground)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Open Menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside 
                className={`
                    w-64 flex flex-col justify-between py-6 shrink-0 z-50
                    transition-transform duration-300 ease-in-out
                    rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] bg-gradient-to-b from-white/80 to-slate-50/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-md
                    
                    /* Mobile styles */
                    fixed inset-y-0 left-0 m-4
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-[120%]'}
                    
                    /* Desktop styles */
                    md:relative md:translate-x-0
                `}
            >
                {/* Top Section */}
                <div className="flex flex-col gap-6 px-4">
                    {/* Logo & Close Button (Mobile) */}
                    <div className="flex items-center justify-between px-2">
                        <button 
                            onClick={() => handleNav(isAdmin || isEditor ? '/admin/dashboard' : '/dashboard')} 
                            className="cursor-pointer text-xl text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity font-semibold"
                        >
                            {isAdmin || isEditor ? 'AdminPanel' : 'StudentPortal'}
                        </button>
                        <button 
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--foreground)] transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                {/* Nav Links */}
                <nav className="flex flex-col gap-2 mt-2">
                    <NavItem 
                        icon={<Search className="w-5 h-5" />} 
                        label="Search" 
                        isActive={activeTab === 'search'} 
                        onClick={() => handleNav('/search')}
                    />

                    {isStudent && (
                        <>
                            <NavItem 
                                icon={<LayoutDashboard className="w-5 h-5" />} 
                                label="Dashboard" 
                                isActive={activeTab === 'overview'} 
                                onClick={() => handleNav('/dashboard?tab=overview')}
                            />
                            <NavItem 
                                icon={<Star className="w-5 h-5" />} 
                                label="My Reviews" 
                                isActive={activeTab === 'reviews'} 
                                onClick={() => handleNav('/dashboard?tab=reviews')}
                            />
                        </>
                    )}

                    {(isAdmin || isEditor) && (
                        <NavItem 
                            icon={<LayoutDashboard className="w-5 h-5" />} 
                            label="Overview" 
                            isActive={activeTab === 'overview'} 
                            onClick={() => handleNav('/admin/dashboard?tab=overview')}
                        />
                    )}
                    
                    {isAdmin && (
                        <NavItem 
                            icon={<Users className="w-5 h-5" />} 
                            label="Editors" 
                            isActive={activeTab === 'editors'} 
                            onClick={() => handleNav('/admin/dashboard?tab=editors')}
                        />
                    )}
                    
                    {(isAdmin || isEditor) && (
                        <NavItem 
                            icon={<GraduationCap className="w-5 h-5" />} 
                            label="Students" 
                            isActive={activeTab === 'students'} 
                            onClick={() => handleNav('/admin/dashboard?tab=students')}
                        />
                    )}

                    {isAdmin && (
                        <NavItem 
                            icon={<BookOpen className="w-5 h-5" />} 
                            label="Courses" 
                            isActive={activeTab === 'courses'} 
                            onClick={() => handleNav('/admin/dashboard?tab=courses')}
                        />
                    )}

                    {isAdmin && (
                        <>
                            <NavItem 
                                icon={<Library className="w-5 h-5" />} 
                                label="Colleges" 
                                isActive={activeTab === 'colleges'} 
                                onClick={() => handleNav('/admin/dashboard?tab=colleges')}
                            />
                            <NavItem 
                                icon={<FileEdit className="w-5 h-5" />} 
                                label="Approval Requests" 
                                isActive={activeTab === 'approvals'} 
                                onClick={() => handleNav('/admin/dashboard?tab=approvals')}
                            />
                        </>
                    )}
                    {isCollege && (
                        <>
                            <NavItem 
                                icon={<LayoutDashboard className="w-5 h-5" />} 
                                label="Edit College" 
                                isActive={activeTab === 'edit'} 
                                onClick={() => handleNav('/college/dashboard?tab=edit')}
                            />
                            <NavItem 
                                icon={<Star className="w-5 h-5" />} 
                                label="Update History" 
                                isActive={activeTab === 'history'} 
                                onClick={() => handleNav('/college/dashboard?tab=history')}
                            />
                        </>
                    )}

                </nav>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col gap-2 px-4 mt-auto">
                <NavItem 
                    icon={theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />} 
                    label={`${theme === 'light' ? 'Dark' : 'Light'} Mode`} 
                    onClick={toggleTheme}
                    hideActive
                />
                <NavItem 
                    icon={<Settings className="w-5 h-5" />} 
                    label="Settings" 
                    onClick={onSettingsOpen}
                    hideActive
                />
                <NavItem 
                    icon={<LogOut className="w-5 h-5" />} 
                    label="Logout" 
                    onClick={() => { onLogout(); setIsMobileOpen(false); }}
                    hideActive
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                />
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
