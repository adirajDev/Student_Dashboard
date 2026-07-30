import { LayoutDashboard, Star, Image } from 'lucide-react';
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
            <NavItem
                icon={
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                    </svg>
                }
                label="Manage Courses"
                isActive={activeTab === 'courses'}
                onClick={() => handleNav('/college/dashboard?tab=courses')}
            />
            <NavItem
                icon={<Image className="w-5 h-5" />}
                label="Manage Gallery"
                isActive={activeTab === 'gallery'}
                onClick={() => handleNav('/college/dashboard?tab=gallery')}
            />
        </>
    );
};

export default CollegeLinks;
