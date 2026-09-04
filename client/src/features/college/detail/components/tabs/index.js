import InfoTab from './InfoTab.jsx';
import CoursesTab from './CoursesTab.jsx';
import PlacementsTab from './PlacementsTab.jsx';
import FacultyTab from './FacultyTab.jsx';
import GalleryTab from './GalleryTab.jsx';
import ReviewsTab from './ReviewsTab.jsx';
import FaqsTab from './FaqsTab.jsx';

/**
 * Tab id -> panel component.
 *
 * Every panel takes the same props: ({ college, user }). Keep it that way —
 * it is what lets CollegeDetails render `<Panel college={college} user={user} />`
 * with no switch statement and no per-tab prop plumbing.
 *
 * Adding a tab is three lines: an entry in constants/collegeTabs.js, an
 * entry here, and the panel file itself.
 */
export const TAB_PANELS = {
    info: InfoTab,
    courses: CoursesTab,
    placements: PlacementsTab,
    faculty: FacultyTab,
    gallery: GalleryTab,
    reviews: ReviewsTab,
    faqs: FaqsTab,
};

export default TAB_PANELS;
