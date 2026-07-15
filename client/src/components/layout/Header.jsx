import { Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = ({ onSettingsOpen, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-[var(--card)] shadow-sm sticky top-0 z-10">
            <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">StudentPortal</h1>
                <div className="flex items-center gap-4">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                    </button>
                    <button onClick={onSettingsOpen} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-[var(--foreground)]" title="Settings">
                        <Settings className="w-5 h-5" />
                    </button>
                    <button onClick={onLogout} className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;