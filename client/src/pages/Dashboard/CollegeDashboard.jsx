import { useOutletContext, useSearchParams } from 'react-router-dom';
import EditCollegeTab from '@/features/college/updates/components/EditCollegeTab';
import UpdateHistoryTab from '@/features/college/updates/components/UpdateHistoryTab';
import CollegeCoursesTab from '@/features/college/updates/components/CollegeCoursesTab';
import GalleryManagementTab from '@/features/college/gallery/components/GalleryManagementTab';

const CollegeDashboard = () => {
    const { user } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'edit';

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl mb-2">College Administration Portal</h2>
                <p className="text-[var(--ring)]">
                    Manage your college's information and view update history.
                </p>
            </div>

            {activeTab === 'edit' && <EditCollegeTab user={user} />}
            {activeTab === 'history' && <UpdateHistoryTab />}
            {activeTab === 'courses' && <CollegeCoursesTab />}
            {activeTab === 'gallery' && <GalleryManagementTab user={user} />}
        </main>
    );
};

export default CollegeDashboard;
