import { X } from 'lucide-react';

const TopSection = ({ isAdmin, isEditor, handleNav, setIsMobileOpen }) => {
    return (
        <div className="flex items-center justify-between px-2">
            <button
                onClick={() =>
                    handleNav(
                        isAdmin || isEditor ? '/admin/dashboard' : '/dashboard'
                    )
                }
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
    );
};

export default TopSection;
