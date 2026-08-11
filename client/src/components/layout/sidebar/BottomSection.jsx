import { Settings, LogOut } from 'lucide-react';
import NavItem from './NavItem';

const BottomSection = ({ onSettingsOpen, onLogout, setIsMobileOpen }) => {
    return (
        <div className="flex flex-col gap-2 px-4 mt-auto">
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
                className="text-red-600 hover:bg-red-50 hover:text-red-700"
            />
        </div>
    );
};

export default BottomSection;
