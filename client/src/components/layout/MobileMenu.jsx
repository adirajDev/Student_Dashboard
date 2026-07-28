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
        <>
            <div 
                className="md:hidden fixed inset-0 top-[72px] bg-black/20 backdrop-blur-sm z-40"
                onClick={() => setIsOpen(false)}
            />
            <div className="md:hidden fixed top-[72px] left-4 right-4 mt-2 bg-white/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl py-6 px-6 flex flex-col gap-4 max-h-[calc(100vh-100px)] overflow-y-auto animate-fade-in-up z-50">
                <nav className="flex flex-col gap-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="text-lg font-medium text-slate-700 hover:text-indigo-600"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;
