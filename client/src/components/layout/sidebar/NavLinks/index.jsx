import { Search } from 'lucide-react';
import NavItem from '../NavItem';
import StudentLinks from './StudentLinks';
import AdminLinks from './AdminLinks';
import CollegeLinks from './CollegeLinks';

const NavLinks = ({ user, activeTab, handleNav }) => {
    const isAdmin = user?.role === 'admin';
    const isEditor = user?.role === 'editor';
    const isStudent = user?.role === 'student';
    const isCollege = user?.role === 'college';

    return (
        <nav className="flex flex-col gap-2 mt-2">
            <NavItem
                icon={<Search className="w-5 h-5" />}
                label="Search"
                isActive={activeTab === 'search'}
                onClick={() => handleNav('/search')}
            />

            {isStudent && (
                <StudentLinks activeTab={activeTab} handleNav={handleNav} />
            )}

            {(isAdmin || isEditor) && (
                <AdminLinks
                    isAdmin={isAdmin}
                    isEditor={isEditor}
                    activeTab={activeTab}
                    handleNav={handleNav}
                />
            )}

            {isCollege && (
                <CollegeLinks activeTab={activeTab} handleNav={handleNav} />
            )}
        </nav>
    );
};

export default NavLinks;
