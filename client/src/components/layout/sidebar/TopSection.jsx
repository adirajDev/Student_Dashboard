import { X } from 'lucide-react';

const TopSection = ({ dashboard, handleNav, setIsMobileOpen }) => {
    return (
        <div className="flex items-center justify-between px-2">
            <button
                onClick={() => handleNav(dashboard.path)}
                className="cursor-pointer text-xl text-[var(--color-ink-950)] hover:text-[var(--color-ink-700)] font-display transition-colors font-bold"
            >
                {dashboard.label}
            </button>
            <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-1.5 rounded-full hover:bg-slate-200 text-[var(--foreground)] transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
};

export default TopSection;
