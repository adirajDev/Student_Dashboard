import { Sun, Moon, Settings, LogOut } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import GlobalSearch from '../common/GlobalSearch';
import { Link } from 'react-router-dom';

const Header = ({ onSettingsOpen, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="sticky top-4 z-10 px-4 mb-8">
            <header className="bg-gradient-to-r from-white/80 to-slate-50/60 dark:from-slate-900/80 dark:to-slate-800/60 backdrop-blur-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] max-w-5xl mx-auto rounded-full border border-white/20 dark:border-slate-700/50 transition-all">
                <div className="px-5 h-16 flex items-center gap-4">
                <Link to="/dashboard" className="text-xl text-blue-600 dark:text-blue-400 flex-shrink-0 hidden sm:block hover:opacity-80 transition-opacity">StudentPortal</Link>
                
                <div className="flex-1 max-w-2xl">
                    <GlobalSearch />
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
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
        </div>
    );
};

export default Header;