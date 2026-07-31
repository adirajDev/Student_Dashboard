import { useOutletContext, useSearchParams } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import UserManagementSection from '../../features/users/components/UserManagementSection';
import CourseManagementSection from '../../features/courses/components/CourseManagementSection';
import CollegeManagementSection from '../../features/college/components/CollegeManagementSection';
import PendingUpdatesSection from '../../features/collegeUpdate/components/Admin/PendingUpdatesSection';
import ExamManagementSection from '../../features/exam/components/ExamManagementSection';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';
    const [searchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {activeTab === 'overview' && (
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-3xl mb-2">
                        Welcome back, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-[var(--ring)]">
                        Here is an overview of your management portal.
                    </p>

                    <div className="mt-8 p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center text-[var(--ring)] flex flex-col items-center justify-center min-h-[300px]">
                        <LayoutDashboard className="w-12 h-12 mb-4 text-slate-300" />
                        <p className="text-lg">
                            Select an option from the sidebar to manage users.
                        </p>
                    </div>
                </div>
            )}

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

            {activeTab === 'students' && (
                <div className="animate-fade-in">
                    <UserManagementSection
                        title="Student Directory"
                        role="student"
                        showCourse={true}
                        showCourseInList={false}
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
        </div>
    );
};

export default AdminDashboard;
