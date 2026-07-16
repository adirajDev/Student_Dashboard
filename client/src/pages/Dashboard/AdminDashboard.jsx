import { useOutletContext } from 'react-router-dom';
import UserManagementSection from '../../features/users/components/UserManagementSection';

const AdminDashboard = () => {
    const { user } = useOutletContext();
    const isAdmin = user?.role === 'admin';

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                <p className="text-[var(--ring)]">Here is an overview of your management portal.</p>
            </div>

            <div className={isAdmin ? "mt-16" : ""}>
                <UserManagementSection
                    title="Editor Directory"
                    role="editor"
                    showCourse={false}
                    canAdd={isAdmin}
                    canDelete={isAdmin}
                    shouldFetch={isAdmin}
                />
            </div>

            <UserManagementSection
                title="Student Directory"
                role="student"
                showCourse={true}
                canAdd={isAdmin}
                canDelete={isAdmin}
                shouldFetch={true}
            />
        </main>
    );
};

export default AdminDashboard;
