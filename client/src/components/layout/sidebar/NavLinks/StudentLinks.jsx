import { LayoutDashboard, Star } from 'lucide-react';
import NavItem from '../NavItem';

const StudentLinks = ({ activeTab, handleNav }) => {
    return (
        <>
            <NavItem
                icon={<LayoutDashboard className="w-5 h-5" />}
                label="Dashboard"
                isActive={activeTab === 'overview'}
                onClick={() => handleNav('/dashboard?tab=overview')}
            />
            <NavItem
                icon={<Star className="w-5 h-5" />}
                label="My Reviews"
                isActive={activeTab === 'reviews'}
                onClick={() => handleNav('/dashboard?tab=reviews')}
            />
        </>
    );
};

export default StudentLinks;
