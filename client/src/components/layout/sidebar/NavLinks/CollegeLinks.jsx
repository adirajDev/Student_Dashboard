import { LayoutDashboard, Star } from 'lucide-react';
import NavItem from '../NavItem';

const CollegeLinks = ({ activeTab, handleNav }) => {
    return (
        <>
            <NavItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Edit College"
                isActive={activeTab === 'edit'}
                onClick={() => handleNav('/college/dashboard?tab=edit')}
            />
            <NavItem
                icon={<Star className="w-5 h-5" />}
                label="Update History"
                isActive={activeTab === 'history'}
                onClick={() => handleNav('/college/dashboard?tab=history')}
            />
        </>
    );
};

export default CollegeLinks;
