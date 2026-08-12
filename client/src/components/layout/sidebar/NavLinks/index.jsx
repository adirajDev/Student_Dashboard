import NavItem from '../NavItem';
import AdminLinks from './AdminLinks';
import CollegeLinks from './CollegeLinks';
import BloggerLinks from './BloggerLinks';

const NavLinks = ({ user, activeTab, handleNav }) => {
    const isAdmin = user?.role === 'admin';
    const isEditor = user?.role === 'editor';
    const isCollege = user?.role === 'college';
    const isBlogger = user?.role === 'blogger';

    return (
        <nav className="flex flex-col gap-2 mt-2">
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

            {isBlogger && (
                <BloggerLinks activeTab={activeTab} handleNav={handleNav} />
            )}
        </nav>
    );
};

export default NavLinks;
