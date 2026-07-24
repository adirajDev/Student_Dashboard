import { Settings, LogOut, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../hooks/useClickOutside';

const UserDropdown = ({ user, handleLogout, setIsSettingsOpen }) => {
    const navigate = useNavigate();
    const { ref, isOpen, setIsOpen } = useClickOutside(false);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold overflow-hidden border-2 border-indigo-200 hover:border-indigo-400 transition-colors"
            >
                {user.name?.charAt(0).toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-3 border-b border-slate-100 mb-1">
                        <p className="text-sm font-medium text-slate-900">
                            {user.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                            {user.email}
                        </p>
                    </div>
                    {user.role === 'student' && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/dashboard');
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                            <Star className="w-4 h-4 text-slate-400" />
                            My Reviews
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsSettingsOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                    >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                handleLogout();
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
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
