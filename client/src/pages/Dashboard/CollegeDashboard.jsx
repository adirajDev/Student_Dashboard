import { useOutletContext, useSearchParams } from 'react-router-dom';
import EditCollegeTab from '../../features/collegeUpdate/components/EditCollegeTab';
import UpdateHistoryTab from '../../features/collegeUpdate/components/UpdateHistoryTab';

const CollegeDashboard = () => {
    const { user } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const activeTab = searchParams.get('tab') || 'edit';

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl mb-2">College Administration Portal</h2>
                <p className="text-[var(--ring)]">Manage your college's information and view update history.</p>
            </div>

            {activeTab === 'edit' && <EditCollegeTab user={user} />}
            {activeTab === 'history' && <UpdateHistoryTab />}
        </main>
    );
};

export default CollegeDashboard;
