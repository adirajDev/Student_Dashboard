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
    { name: 'Colleges', href: '/college' },
    { name: 'Exams', href: '/exams' },
    { name: 'Blogs', href: '/blog' },
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
                        : 'bg-white/80 backdrop-blur-md shadow-sm py-3 border-b border-[var(--border)]'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3 md:gap-8">
                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center shrink-0">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className={`p-2 -ml-2 rounded-lg ${isTransparent ? 'text-white' : 'text-[var(--color-ink-800)]'}`}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                    <Link
                        to="/"
                        className="flex items-center gap-2 mr-auto md:mr-0 shrink-0"
                    >
                        <div className="w-10 h-10 bg-[var(--color-ink-800)] rounded-xl flex items-center justify-center text-[var(--color-amber-300)] font-display font-bold text-xl shadow-lg">
                            SD
                        </div>
                        <span
                            className={`text-xl font-display font-semibold hidden sm:block ${isTransparent ? 'text-white' : 'text-[var(--color-ink-950)]'}`}
                        >
                            Student Dashboard
                        </span>
                        <span
                            className={`text-xl font-display font-semibold sm:hidden ${isTransparent ? 'text-white' : 'text-[var(--color-ink-950)]'}`}
                        >
                            SD
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex gap-8 items-center ml-auto">
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-base font-medium hover:text-[var(--color-amber-600)] transition-colors ${
                                    isTransparent
                                        ? 'text-white/90'
                                        : 'text-[var(--foreground)]'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side icons/buttons */}
                    <div className="flex items-center shrink-0">
                        {user ? (
                            <UserDropdown
                                user={user}
                                handleLogout={handleLogout}
                                setIsSettingsOpen={setIsSettingsOpen}
                            />
                        ) : (
                            <Link
                                to="/dashboard-redirect"
                                className={
                                    isTransparent
                                        ? 'px-6 py-2.5 rounded-[var(--radius-md)] text-base font-semibold transition-all bg-white text-[var(--color-ink-950)] hover:bg-[var(--color-amber-50)]'
                                        : 'btn-primary'
                                }
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <MobileMenu
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
                navLinks={navLinks}
                user={user}
                handleLogout={handleLogout}
                setIsSettingsOpen={setIsSettingsOpen}
            />

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
