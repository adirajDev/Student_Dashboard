import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import TopSection from './sidebar/TopSection';
import NavLinks from './sidebar/NavLinks';
import BottomSection from './sidebar/BottomSection';

const Sidebar = ({ user, onSettingsOpen, onLogout }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const isAdmin = user?.role === 'admin';
    const isEditor = user?.role === 'editor';

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

    const handleNav = path => {
        navigate(path);
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-30 p-3 rounded-full bg-[var(--card)] border border-[var(--border)] shadow-md text-[var(--foreground)] hover:bg-slate-100 transition-colors"
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
                    rounded-3xl border border-white/20 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)],0,0,0.2)] bg-gradient-to-b from-white/80 to-slate-50/60 backdrop-blur-md
                    
                    /* Mobile styles */
                    fixed inset-y-0 left-0 m-4
                    ${isMobileOpen ? 'translate-x-0' : '-translate-x-[120%]'}
                    
                    /* Desktop styles */
                    md:relative md:translate-x-0
                `}
            >
                {/* Top Section */}
                <div className="flex flex-col gap-6 px-4">
                    <TopSection
                        isAdmin={isAdmin}
                        isEditor={isEditor}
                        handleNav={handleNav}
                        setIsMobileOpen={setIsMobileOpen}
                    />

                    <NavLinks
                        user={user}
                        activeTab={activeTab}
                        handleNav={handleNav}
                    />
                </div>

                {/* Bottom Section */}
                <BottomSection
                    onSettingsOpen={onSettingsOpen}
                    onLogout={onLogout}
                    setIsMobileOpen={setIsMobileOpen}
                />
            </aside>
        </>
    );
};

export default Sidebar;
