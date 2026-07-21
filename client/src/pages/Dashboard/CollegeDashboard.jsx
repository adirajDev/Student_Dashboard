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

            <div className="flex space-x-1 bg-[var(--card)] p-1 rounded-2xl border border-[var(--border)] mb-8 max-w-sm">
                <button
                    onClick={() => setSearchParams({ tab: 'edit' })}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                        activeTab === 'edit'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    Edit College
                </button>
                <button
                    onClick={() => setSearchParams({ tab: 'history' })}
                    className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                        activeTab === 'history'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                >
                    Request History
                </button>
            </div>

            {activeTab === 'edit' && <EditCollegeTab user={user} />}
            {activeTab === 'history' && <UpdateHistoryTab />}
        </main>
    );
};

export default CollegeDashboard;
