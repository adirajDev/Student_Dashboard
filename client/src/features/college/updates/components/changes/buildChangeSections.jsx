import {
    AlertTriangle,
    Building2,
    TrendingUp,
    Users,
    Presentation,
    HelpCircle,
} from 'lucide-react';
import { Card, isSame, renderDiff } from './primitives.jsx';
import { buildPlacementDiff } from './PlacementDiff.jsx';
import { buildRecruiterDiff, RecruiterDiff } from './RecruiterDiff.jsx';
import { buildFacultyDiff, FacultyDiff } from './FacultyDiff.jsx';
import { CourseUpdatesDiff } from './CourseUpdatesDiff.jsx';
import { FaqsDiff } from './FaqsDiff.jsx';

// A populate that did not run leaves an ObjectId string where an object was
// expected. Treat anything that is not a plain object as "no baseline".
const asRecord = value =>
    value && typeof value === 'object' && !Array.isArray(value) ? value : {};

/**
 * Returns an array of JSX nodes — one per field that genuinely changed.
 * An empty array means the request is a no-op. Shared by the admin review
 * modal and the college-side update history so the two can never drift.
 *
 * `options.before` overrides what the proposal is compared against. The admin
 * modal leaves it unset and diffs against the live college, because that is
 * what approval will actually overwrite. The history tab passes the snapshot
 * stored on the request, so an approved change still shows a real before/after.
 */
export const buildChangeSections = (update, options = {}) => {
    const changes = update?.proposedChanges || {};
    const current = asRecord(options.before ?? update?.college);
    const sections = [];

    // Scalar fields. `!== undefined` rather than truthiness, so a field cleared
    // to '' is still shown — approval would otherwise unset it silently.
    const scalar = (key, label, currentVal) => {
        const node = renderDiff(label, currentVal, changes[key], key);
        if (node) sections.push(node);
    };

    scalar('name', 'College Name', current.name);

    // Slug gets its own warning wrapper because approving it breaks old links.
    const slugDiff = renderDiff('URL Slug', current.slug, changes.slug, 'slug');
    if (slugDiff) {
        sections.push(
            <div
                key="slug-warning"
                className="mb-4 p-4 rounded-xl border-2 border-amber-300 bg-amber-50"
            >
                <div className="flex items-start gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800">
                        Approving this moves the college&apos;s public URL.
                        Links to the old address will stop working.
                    </p>
                </div>
                {slugDiff}
            </div>
        );
    }

    scalar('type', 'College Type', current.type);
    scalar('city', 'City', current.city);
    scalar('state', 'State / UT', current.state);
    scalar('collegeId', 'College ID', current.collegeId);
    scalar('logo', 'Logo URL', current.logo);
    scalar('overview', 'Overview', current.overview);
    scalar('description', 'Description', current.description);

    // Placement details
    if (changes.placementDetails) {
        const rows = buildPlacementDiff(
            current.placementDetails,
            changes.placementDetails
        );
        if (rows.length > 0) {
            sections.push(
                <Card
                    key="placement"
                    icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                    title="Placements"
                >
                    <div className="mt-3">{rows}</div>
                </Card>
            );
        }
    }

    // Recruiters
    if (
        changes.recruiters &&
        !isSame(current.recruiters || [], changes.recruiters)
    ) {
        const diff = buildRecruiterDiff(current.recruiters, changes.recruiters);
        if (diff.added.length > 0 || diff.removed.length > 0) {
            sections.push(
                <Card
                    key="recruiters"
                    icon={<Building2 className="w-5 h-5 text-purple-500" />}
                    title="Top Recruiters"
                >
                    <RecruiterDiff {...diff} />
                </Card>
            );
        }
    }

    // Faculty
    if (changes.faculty && !isSame(current.faculty || [], changes.faculty)) {
        const diff = buildFacultyDiff(current.faculty, changes.faculty);
        if (diff.added.length > 0 || diff.removed.length > 0) {
            sections.push(
                <Card
                    key="faculty"
                    icon={<Users className="w-5 h-5 text-orange-500" />}
                    title="Faculty Roster"
                >
                    <FacultyDiff {...diff} />
                </Card>
            );
        }
    }

    // Course delta. Joi fills added/updated/removed with [], so a truthy
    // object is not by itself proof that anything changed.
    const cu = changes.courseUpdates;
    if (cu && (cu.added?.length || cu.updated?.length || cu.removed?.length)) {
        sections.push(
            <Card
                key="courses"
                icon={<Presentation className="w-5 h-5 text-emerald-500" />}
                title="Course Updates"
            >
                <CourseUpdatesDiff
                    courseUpdates={cu}
                    currentCourses={current.availableCourses}
                />
            </Card>
        );
    }

    // Full replacement of the course list (the other branch of the Joi oxor).
    // Rare, but it must not vanish from review.
    if (
        changes.availableCourses &&
        !isSame(
            (current.availableCourses || []).map(c => ({
                course: String(c.course),
                fee: c.fee,
            })),
            changes.availableCourses.map(c => ({
                course: String(c.course),
                fee: c.fee,
            }))
        )
    ) {
        sections.push(
            <Card
                key="available-courses"
                icon={<Presentation className="w-5 h-5 text-emerald-500" />}
                title="Course List (full replacement)"
            >
                <div className="mt-2 grid gap-2">
                    {changes.availableCourses.map((item, i) => (
                        <div
                            key={`ac-${i}`}
                            className="flex justify-between items-center text-sm"
                        >
                            <span className="font-mono text-xs opacity-70">
                                {String(item.course)}
                            </span>
                            <span className="font-medium">
                                Fee: ₹{item.fee}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    // FAQs
    const fq = changes.faqs;
    if (fq && (fq.added?.length || fq.updated?.length || fq.removed?.length)) {
        sections.push(
            <Card
                key="faqs"
                icon={<HelpCircle className="w-5 h-5 text-indigo-500" />}
                title="FAQs"
            >
                <FaqsDiff faqs={fq} currentFaqs={current.faqs} />
            </Card>
        );
    }

    return sections;
};
