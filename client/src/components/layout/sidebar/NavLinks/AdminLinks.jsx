import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    Library,
    FileEdit,
    PenSquare,
    Newspaper,
} from 'lucide-react';
import NavItem from '../NavItem';
import { Megaphone } from 'lucide-react';

const AdminLinks = ({ isAdmin, isEditor, activeTab, handleNav }) => {
    return (
        <>
            {(isAdmin || isEditor) && (
                <NavItem
                    icon={<LayoutDashboard className="w-5 h-5" />}
                    label="Overview"
                    isActive={activeTab === 'overview'}
                    onClick={() => handleNav('/admin/dashboard?tab=overview')}
                />
            )}

            {isAdmin && (
                <NavItem
                    icon={<Users className="w-5 h-5" />}
                    label="Editors"
                    isActive={activeTab === 'editors'}
                    onClick={() => handleNav('/admin/dashboard?tab=editors')}
                />
            )}

            {isAdmin && (
                <NavItem
                    icon={<PenSquare className="w-5 h-5" />}
                    label="Bloggers"
                    isActive={activeTab === 'bloggers'}
                    onClick={() => handleNav('/admin/dashboard?tab=bloggers')}
                />
            )}

            {(isAdmin || isEditor) && (
                <NavItem
                    icon={<GraduationCap className="w-5 h-5" />}
                    label="Students"
                    isActive={activeTab === 'students'}
                    onClick={() => handleNav('/admin/dashboard?tab=students')}
                />
            )}

            {isAdmin && (
                <NavItem
                    icon={<BookOpen className="w-5 h-5" />}
                    label="Courses"
                    isActive={activeTab === 'courses'}
                    onClick={() => handleNav('/admin/dashboard?tab=courses')}
                />
            )}

            {isAdmin && (
                <NavItem
                    icon={<FileEdit className="w-5 h-5" />}
                    label="Exams"
                    isActive={activeTab === 'exams'}
                    onClick={() => handleNav('/admin/dashboard?tab=exams')}
                />
            )}

            {isAdmin && (
                <NavItem
                    icon={<Newspaper className="w-5 h-5" />}
                    label="News"
                    isActive={activeTab === 'news'}
                    onClick={() => handleNav('/admin/dashboard?tab=news')}
                />
            )}

            {isAdmin && (
                <>
                    <NavItem
                        icon={<Library className="w-5 h-5" />}
                        label="Colleges"
                        isActive={activeTab === 'colleges'}
                        onClick={() =>
                            handleNav('/admin/dashboard?tab=colleges')
                        }
                    />
                    <NavItem
                        icon={<Users className="w-5 h-5" />}
                        label="College Admins"
                        isActive={activeTab === 'collegeUsers'}
                        onClick={() =>
                            handleNav('/admin/dashboard?tab=collegeUsers')
                        }
                    />
                    <NavItem
                        icon={<FileEdit className="w-5 h-5" />}
                        label="Approval Requests"
                        isActive={activeTab === 'approvals'}
                        onClick={() =>
                            handleNav('/admin/dashboard?tab=approvals')
                        }
                    />
                    <NavItem
                        icon={<Newspaper className="w-5 h-5" />}
                        label="Blog Approvals"
                        isActive={activeTab === 'blogApprovals'}
                        onClick={() =>
                            handleNav('/admin/dashboard?tab=blogApprovals')
                        }
                    />
                    <NavItem
                        icon={<Megaphone className="w-5 h-5" />}
                        label="Promotions"
                        isActive={activeTab === 'promotions'}
                        onClick={() =>
                            handleNav('/admin/dashboard?tab=promotions')
                        }
                    />
                </>
            )}
        </>
    );
};

export default AdminLinks;
