import { useOutletContext, useSearchParams } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import UserManagementSection from '../../features/users/components/UserManagementSection';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';
    const [searchParams] = useSearchParams();
    
    const activeTab = searchParams.get('tab') || 'overview';

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {activeTab === 'overview' && (
                <div className="mb-8 animate-fade-in">
                    <h2 className="text-3xl mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-[var(--ring)]">Here is an overview of your management portal.</p>
                    
                    <div className="mt-8 p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center text-[var(--ring)] flex flex-col items-center justify-center min-h-[300px]">
                        <LayoutDashboard className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
                        <p className="text-lg">Select an option from the sidebar to manage users.</p>
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
                        canAdd={isAdmin}
                        canDelete={isAdmin}
                        shouldFetch={true}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
