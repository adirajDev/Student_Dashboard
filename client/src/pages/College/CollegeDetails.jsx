import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import CollegeHeader from '@/features/college/components/DetailPage/CollegeHeader';
import CollegeTabNav from '@/features/college/components/DetailPage/CollegeTabNav';
import { TAB_PANELS } from '@/features/college/components/DetailPage/tabs';
import useCollegeDetails from '@/features/college/hooks/useCollegeDetails';
import useCollegeTabs from '@/features/college/hooks/useCollegeTabs';

const CollegeDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useOutletContext();

    const { college, isLoading, error } = useCollegeDetails(id, location.hash);
    const { tabs, activeTab, setTab, navRef } = useCollegeTabs(college);

    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    if (!college)
        return (
            <div className="p-8 text-center text-[var(--ring)]">
                College not found.
            </div>
        );

    const Panel = TAB_PANELS[activeTab];

    return (
        <div className="max-w-5xl mx-auto px-4 pb-16 animate-fade-in">
            <CollegeHeader
                college={college}
                user={user}
                onViewGallery={() => setTab('gallery')}
            />

            {/* Outside CollegeHeader on purpose — its root has overflow-hidden,
                which would break position:sticky here. */}
            <div ref={navRef}>
                <CollegeTabNav
                    tabs={tabs}
                    activeTab={activeTab}
                    onChange={setTab}
                />
            </div>

            <div
                id={`panel-${activeTab}`}
                role="tabpanel"
                aria-labelledby={`tab-${activeTab}`}
                className="pt-8"
            >
                {Panel ? <Panel college={college} user={user} /> : null}
            </div>
        </div>
    );
};

export default CollegeDetails;
