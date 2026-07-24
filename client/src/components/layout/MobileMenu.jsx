import { Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Star } from 'lucide-react';

const MobileMenu = ({
    isOpen,
    setIsOpen,
    navLinks,
    user,
    handleLogout,
    setIsSettingsOpen,
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4 max-h-[calc(100vh-70px)] overflow-y-auto animate-fade-in">
            <nav className="flex flex-col gap-4">
                {navLinks.map(link => (
                    <Link
                        key={link.name}
                        to={link.href}
                        className="text-base font-medium text-slate-700 hover:text-indigo-600"
                        onClick={() => setIsOpen(false)}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
            <hr className="border-slate-100" />
            {user ? (
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800">
                                {user.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {user.email}
                            </p>
                        </div>
                    </div>
                    {user.role === 'student' && (
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/dashboard');
                            }}
                            className="text-left font-medium text-slate-700 flex items-center gap-2"
                        >
                            <Star className="w-5 h-5 text-[var(--ring)]" />
                            My Reviews
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            setIsSettingsOpen(true);
                        }}
                        className="text-left font-medium text-slate-700 flex items-center gap-2"
                    >
                        <Settings className="w-5 h-5 text-[var(--ring)]" />
                        Settings
                    </button>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            handleLogout();
                        }}
                        className="text-left font-medium text-red-600 flex items-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            ) : (
                <Link
                    to="/dashboard-redirect"
                    className="bg-indigo-600 text-white font-semibold py-3 rounded-xl text-center mb-4"
                    onClick={() => setIsOpen(false)}
                >
                    Login / Register
                </Link>
            )}
        </div>
    );
};

export default MobileMenu;
