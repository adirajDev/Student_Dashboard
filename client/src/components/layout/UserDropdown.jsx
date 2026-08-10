import { Settings, LogOut, Star, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';

const UserDropdown = ({ user, handleLogout, setIsSettingsOpen }) => {
    const navigate = useNavigate();
    const { ref, isOpen, setIsOpen } = useClickOutside(false);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-[var(--color-ink-100)] flex items-center justify-center text-[var(--color-ink-900)] font-bold overflow-hidden border-2 border-[var(--color-ink-200)] hover:border-[var(--color-ink-300)] transition-colors"
            >
                {user.name?.charAt(0).toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--card)] rounded-[var(--radius-xl)] shadow-lg border border-[var(--border)] py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-[var(--border)] mb-1">
                        <p className="text-sm font-medium text-[var(--foreground)]">
                            {user.name}
                        </p>
                        <p className="text-xs text-[var(--muted)] truncate mt-0.5">
                            {user.email}
                        </p>
                    </div>
                    {user.role === 'student' && (
                        <>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/applications');
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--color-ink-50)] flex items-center gap-3 transition-colors"
                            >
                                <GraduationCap className="w-4 h-4 text-[var(--muted)]" />
                                My Applications
                            </button>
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    navigate('/dashboard');
                                }}
                                className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--color-ink-50)] flex items-center gap-3 transition-colors"
                            >
                                <Star className="w-4 h-4 text-[var(--muted)]" />
                                My Reviews
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsSettingsOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground)] hover:bg-[var(--color-ink-50)] flex items-center gap-3 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-[var(--muted)]" />
                        Settings
                    </button>
                    <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserDropdown;
