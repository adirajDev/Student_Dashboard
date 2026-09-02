/**
 * Placement figures are free-text strings, so they arrive in every shape:
 * "12", "12 LPA", "₹12 LPA", "Rs 12 lakh". Normalise for display without
 * mangling values that are already formatted.
 */
export const formatPackage = pkg => {
    if (!pkg) return null;
    const str = String(pkg).trim();
    const hasLetters = /[a-zA-Z]/.test(str);
    const hasCurrency = str.includes('₹') || str.toLowerCase().includes('rs');

    let result = str;
    if (!hasCurrency) result = `₹${result}`;
    if (!hasLetters) result = `${result} LPA`;
    return result;
};

/** Course duration is stored in months. 66 -> "5 Yrs 6 Mos". */
export const formatDuration = months => {
    if (!months) return 'N/A';
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return `${years > 0 ? `${years} Yrs ` : ''}${rest > 0 ? `${rest} Mos` : ''}`.trim();
};

/**
 * `College.availableCourses` elements are `{ course, fee }`, where `course` is
 * either a populated Course document or a bare ObjectId string depending on the
 * endpoint. Both helpers below accept either that wrapper or a plain Course, so
 * callers don't have to know which shape they were handed.
 */
const unwrapCourse = entry => entry?.course ?? entry ?? null;

/** Stable string id for a course, usable as a filter value or React key. */
export const getCourseId = entry => {
    const course = unwrapCourse(entry);
    if (!course) return null;
    const id = typeof course === 'object' ? course._id : course;
    return id ? String(id) : null;
};

/** "MBA (Finance)" — falls back to the long name when there's no short one. */
export const courseLabel = entry => {
    const course = unwrapCourse(entry);
    if (!course || typeof course !== 'object') return null;

    const base = course.shortName || course.name;
    if (!base) return null;

    return course.specialization ? `${base} (${course.specialization})` : base;
};