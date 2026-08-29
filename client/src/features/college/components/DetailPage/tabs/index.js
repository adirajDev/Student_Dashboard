import InfoTab from './InfoTab';
import CoursesTab from './CoursesTab';
import PlacementsTab from './PlacementsTab';
import FacultyTab from './FacultyTab';
import GalleryTab from './GalleryTab';
import ReviewsTab from './ReviewsTab';
import FaqsTab from './FaqsTab';

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
