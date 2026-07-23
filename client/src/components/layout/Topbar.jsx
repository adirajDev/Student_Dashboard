import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Settings, LogOut, Star } from 'lucide-react';
import useAuth from '../../features/auth/hooks/useAuth';
import SettingsModal from '../../features/profile/components/SettingsModal';

const Topbar = ({ transparentOnTop = false }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user, handleLogout, setUser, isLoading } = useAuth(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        // Set initial state
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isTransparent = transparentOnTop && !scrolled;

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/#about' },
        { name: 'Colleges', href: '/search' },
        { name: 'Contact Us', href: '/#contact' },
    ];

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
                        <span className={`text-xl font-bold ${isTransparent ? 'text-white' : 'text-slate-900'}`}>
                            Student Dashboard
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm font-medium hover:text-indigo-500 transition-colors ${
                                    isTransparent ? 'text-white/90' : 'text-slate-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side icons/buttons */}
                    <div className="hidden md:flex items-center gap-4 relative">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </button>
                                
                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                                            <div className="px-4 py-2 border-b border-slate-50 mb-2">
                                                <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            {user.role === 'student' && (
                                                <button
                                                    onClick={() => { setIsDropdownOpen(false); navigate('/dashboard'); }}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                                >
                                                    <Star className="w-4 h-4" />
                                                    My Reviews
                                                </button>
                                            )}
                                            <button
                                                onClick={() => { setIsDropdownOpen(false); setIsSettingsOpen(true); }}
                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </button>
                                            <button
                                                onClick={() => { setIsDropdownOpen(false); handleLogout(); }}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
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
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={`p-2 rounded-lg ${isTransparent ? 'text-white' : 'text-slate-800'}`}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 max-h-screen overflow-y-auto">
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-base font-medium text-slate-700 hover:text-indigo-600"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <hr className="border-slate-100" />
                        {user ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{user.name}</p>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                {user.role === 'student' && (
                                    <button
                                        onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                                        className="text-left font-medium text-slate-700 flex items-center gap-2"
                                    >
                                        <Star className="w-5 h-5" />
                                        My Reviews
                                    </button>
                                )}
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); setIsSettingsOpen(true); }}
                                    className="text-left font-medium text-slate-700 flex items-center gap-2"
                                >
                                    <Settings className="w-5 h-5" />
                                    Settings
                                </button>
                                <button
                                    onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                                    className="text-left font-medium text-red-600 flex items-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/dashboard-redirect"
                                className="bg-indigo-600 text-white font-semibold py-3 rounded-xl text-center"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                )}
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
