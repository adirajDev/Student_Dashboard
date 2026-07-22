import { Settings, LogOut, Sun, Moon } from 'lucide-react';
import NavItem from './NavItem';
import { useTheme } from '../../../../context/ThemeContext';

const BottomSection = ({ onSettingsOpen, onLogout, setIsMobileOpen }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col gap-2 px-4 mt-auto">
            <NavItem
                icon={
                    theme === 'light' ? (
                        <Moon className="w-5 h-5" />
                    ) : (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    )
                }
                label={`${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                onClick={toggleTheme}
                hideActive
            />
            <NavItem
                icon={<Settings className="w-5 h-5" />}
                label="Settings"
                onClick={onSettingsOpen}
                hideActive
            />
            <NavItem
                icon={<LogOut className="w-5 h-5" />}
                label="Logout"
                onClick={() => {
                    onLogout();
                    setIsMobileOpen(false);
                }}
                hideActive
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            />
        </div>
    );
};

export default BottomSection;
