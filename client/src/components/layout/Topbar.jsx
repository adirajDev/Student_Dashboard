import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuth from '../../features/auth/hooks/useAuth';
import useScroll from '../../hooks/useScroll';
import SettingsModal from '../../features/profile/components/SettingsModal';
import UserDropdown from './UserDropdown';
import MobileMenu from './MobileMenu';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/#about' },
    { name: 'Colleges', href: '/search' },
    { name: 'Exams', href: '/exams' },
    { name: 'Contact Us', href: '/#contact' },
];

const Topbar = ({ transparentOnTop = false }) => {
    const scrolled = useScroll(50);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, handleLogout, setUser } = useAuth(false);

    const isTransparent = transparentOnTop && !scrolled;

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isTransparent
                        ? 'bg-transparent py-5'
                        : 'bg-white/80 backdrop-blur-md shadow-sm py-3 border-b border-slate-200'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            SD
                        </div>
                        <span
                            className={`text-xl font-bold ${isTransparent ? 'text-white' : 'text-slate-900'}`}
                        >
                            Student Dashboard
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm font-medium hover:text-indigo-500 transition-colors ${
                                    isTransparent
                                        ? 'text-white/90'
                                        : 'text-slate-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side icons/buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <UserDropdown 
                                user={user} 
                                handleLogout={handleLogout} 
                                setIsSettingsOpen={setIsSettingsOpen} 
                            />
                        ) : (
                            <Link
                                to="/dashboard-redirect"
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                                    isTransparent
                                        ? 'bg-white text-indigo-900 hover:bg-slate-100'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                }`}
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className={`p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-slate-800'}`}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                <MobileMenu
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                    navLinks={navLinks}
                    user={user}
                    handleLogout={handleLogout}
                    setIsSettingsOpen={setIsSettingsOpen}
                />
            </header>

            {isSettingsOpen && (
                <SettingsModal
                    user={user}
                    onClose={() => setIsSettingsOpen(false)}
                    onUpdate={setUser}
                />
            )}
        </>
    );
};

export default Topbar;
