import { useCallback, useEffect } from 'react';
import { useParams, useLocation, useOutletContext } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import Error from '@/components/common/Error';
import CollegeHeader from '@/features/college/components/DetailPage/CollegeHeader';
import CollegeStickyBar from '@/features/college/components/DetailPage/CollegeStickyBar';
import { TAB_PANELS } from '@/features/college/components/DetailPage/tabs';
import useCollegeDetails from '@/features/college/hooks/useCollegeDetails';
import useCollegeTabs from '@/features/college/hooks/useCollegeTabs';
import useApplyToCollege from '@/features/college/hooks/useApplyToCollege';
import useIsStuck from '@/hooks/useIsStuck';
import useTopbarHeight from '@/hooks/useTopbarHeight';
import { prefetchCollegeGallery } from '@/features/collegeGallery/hooks/useCollegeGallery';
import LatestNewsRail from '@/features/news/components/LatestNewsRail.jsx';
import PromotionSlot from '@/features/promotions/components/PromotionSlot.jsx';

const CollegeDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useOutletContext();

    const { college, isLoading, error } = useCollegeDetails(id, location.hash);
    const { tabs, activeTab, setTab, navRef } = useCollegeTabs(college);
    // Measured, not hardcoded — the pin offset and the observer's trigger
    // point have to be the same number or the condensed row expands early.
    const topbarHeight = useTopbarHeight();
    const { sentinelRef, isStuck } = useIsStuck(topbarHeight);

    // One instance, shared by the header and the sticky bar. The hook keeps
    // `status` in local state, so two instances would drift apart the moment
    // someone applies from either one.
    const apply = useApplyToCollege(id, user);

    // One node, two consumers: useIsStuck needs it as an observer target,
    // useCollegeTabs needs it as a scroll anchor. Memoised so the callback
    // ref isn't torn down and re-attached on every render.
    const setStickyAnchor = useCallback(
        node => {
            navRef.current = node;
            sentinelRef(node);
        },
        [navRef, sentinelRef]
    );

    // Warm the gallery list once the page has settled, so opening the tab is
    // usually instant. Must sit above the early returns — hooks can't be
    // called conditionally.
    useEffect(() => {
        const collegeId = college?._id;
        if (!collegeId) return;

        if (typeof window.requestIdleCallback === 'function') {
            const handle = window.requestIdleCallback(() =>
                prefetchCollegeGallery(collegeId)
            );
            return () => window.cancelIdleCallback(handle);
        }

        const timer = setTimeout(() => prefetchCollegeGallery(collegeId), 1500);
        return () => clearTimeout(timer);
    }, [college?._id]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-fade-in">
            <CollegeHeader
                college={college}
                user={user}
                apply={apply}
                onViewGallery={() => setTab('gallery')}
            />

            {/* Marks the bar's natural top. useIsStuck watches it to know
                when the bar has pinned; useCollegeTabs measures it to decide
                whether switching tabs should scroll back up. */}
            <div
                ref={setStickyAnchor}
                aria-hidden="true"
                className="h-px -mb-px"
            />

            {/* No wrapper div here on purpose. A sticky element cannot leave
                its parent's box, so wrapping the bar in a div that contains
                only the bar leaves it nowhere to travel and, it scrolls away
                like a normal element. Its parent has to be the tall page
                container. It is also kept outside CollegeHeader, whose root
                has overflow-hidden — that disables sticky outright. */}
            <CollegeStickyBar
                college={college}
                tabs={tabs}
                activeTab={activeTab}
                onChange={setTab}
                apply={apply}
                isCondensed={isStuck}
                top={topbarHeight}
            />

            <div className="flex flex-col lg:flex-row gap-8 mt-8">
                {/*Left Section*/}
                <div
                    id={`panel-${activeTab}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${activeTab}`}
                    className="flex-1 min-w-0"
                >
                    {Panel ? <Panel college={college} user={user} /> : null}
                </div>

                {/*Right Sidebar*/}
                <aside className="w-full lg:w-80 shrink-0">
                    <div className="lg:sticky" style={{ top: topbarHeight + 16 }}>
                        <LatestNewsRail />
                        <PromotionSlot slot="collegeDetail:sidebar" className="mt-8" />
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default CollegeDetails;