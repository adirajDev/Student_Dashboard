import { useOutletContext, useSearchParams } from 'react-router-dom';
import OverviewSection from '@/features/overview/components/OverviewSection';
import UserManagementSection from '@/features/users/components/UserManagementSection';
import CourseManagementSection from '@/features/courses/components/CourseManagementSection';
import CollegeManagementSection from '@/features/college/components/CollegeManagementSection';
import PendingUpdatesSection from '@/features/collegeUpdate/components/Admin/PendingUpdatesSection';
import ExamManagementSection from '@/features/exam/components/ExamManagementSection';
import PendingPostsSection from '@/features/blog/components/Admin/PendingPostsSection';
import NewsManagementSection from '@/features/news/components/NewsManagementSection.jsx';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';
    const [searchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <OverviewSection
                user={user}
                shouldFetch={activeTab === 'overview'}
            />

            {activeTab === 'editors' && isAdmin && (
                <div className="animate-fade-in">
                    <UserManagementSection
                        title="Editor Directory"
                        role="editor"
                        showCourse={false}
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={isAdmin}
                    />
                </div>
            )}

            {activeTab === 'bloggers' && isAdmin && (
                <div className="animate-fade-in">
                    <UserManagementSection
                        title="Blogger Directory"
                        role="blogger"
                        showCourse={false}
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={isAdmin}
                    />
                </div>
            )}

            {activeTab === 'students' && (
                <div className="animate-fade-in">
                    <UserManagementSection
                        title="Student Directory"
                        role="student"
                        showCourse={false}
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={true}
                    />
                </div>
            )}

            {activeTab === 'courses' && isAdmin && (
                <div className="animate-fade-in">
                    <CourseManagementSection title="Course Directory" />
                </div>
            )}

            {activeTab === 'exams' && isAdmin && (
                <div className="animate-fade-in">
                    <ExamManagementSection title="Exam Directory" />
                </div>
            )}

            {activeTab === 'news' && isAdmin && (
                <div className="animate-fade-in">
                    <NewsManagementSection title="News Directory" />
                </div>
            )}

            {activeTab === 'colleges' && isAdmin && (
                <div className="animate-fade-in">
                    <CollegeManagementSection title="College Directory" />
                </div>
            )}

            {activeTab === 'collegeUsers' && isAdmin && (
                <div className="animate-fade-in">
                    <UserManagementSection
                        title="College Admins Directory"
                        role="collegeUser"
                        showCourse={false}
                        showCollegeOnly={true}
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={isAdmin}
                    />
                </div>
            )}

            {activeTab === 'approvals' && isAdmin && (
                <div className="animate-fade-in">
                    <PendingUpdatesSection title="Approval Requests" />
                </div>
            )}

            {activeTab === 'blogApprovals' && isAdmin && (
                <div className="animate-fade-in">
                    <PendingPostsSection title="Blog Approvals" />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
