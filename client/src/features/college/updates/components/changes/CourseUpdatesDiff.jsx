const courseLabel = course => {
    const base = course.shortName || course.name || 'Unknown course';
    const spec = course.specialization ? ` - ${course.specialization}` : '';
    return `${base}${spec}`;
};

export const CourseUpdatesDiff = ({ courseUpdates, currentCourses }) => {
    // populatedCourses is attached server-side. Ids are strings once
    // serialised to JSON, but String() both sides so an ObjectId can't slip past.
    const lookup = id => {
        const found = (courseUpdates.populatedCourses || []).find(
            c => String(c._id) === String(id)
        );
        return found || { name: null, shortName: null, level: null };
    };

    const currentFee = id => {
        const entry = (currentCourses || []).find(
            c => String(c.course) === String(id)
        );
        return entry?.fee;
    };

    const { added = [], updated = [], removed = [] } = courseUpdates;

    return (
        <div className="space-y-4 mt-2">
            {added.length > 0 && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                        Added Courses
                    </h4>
                    <div className="grid gap-2">
                        {added.map((item, i) => {
                            const course = lookup(item.course);
                            return (
                                <div
                                    key={`ca-${i}`}
                                    className="flex justify-between items-center text-sm gap-3"
                                >
                                    <span>
                                        {courseLabel(course)}
                                        {course.level && (
                                            <span className="text-xs opacity-70 ml-1">
                                                ({course.level})
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-medium whitespace-nowrap">
                                        Fee: ₹{item.fee}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {updated.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                        Updated Fees
                    </h4>
                    <div className="grid gap-2">
                        {updated.map((item, i) => {
                            const course = lookup(item.course);
                            const before = currentFee(item.course);
                            return (
                                <div
                                    key={`cu-${i}`}
                                    className="flex justify-between items-center text-sm gap-3"
                                >
                                    <span>
                                        {courseLabel(course)}
                                        {course.level && (
                                            <span className="text-xs opacity-70 ml-1">
                                                ({course.level})
                                            </span>
                                        )}
                                    </span>
                                    <span className="font-medium whitespace-nowrap">
                                        <span className="line-through text-red-700 opacity-70">
                                            ₹{before ?? '—'}
                                        </span>
                                        <span className="mx-1.5">→</span>
                                        <span className="text-green-700">
                                            ₹{item.fee}
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {removed.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                        Removed Courses
                    </h4>
                    <div className="grid gap-2">
                        {removed.map((id, i) => {
                            const course = lookup(id);
                            const before = currentFee(id);
                            return (
                                <div
                                    key={`cr-${i}`}
                                    className="flex justify-between items-center text-sm gap-3 line-through opacity-70 text-red-700"
                                >
                                    <span>
                                        {courseLabel(course)}
                                        {course.level && (
                                            <span className="ml-1">
                                                ({course.level})
                                            </span>
                                        )}
                                    </span>
                                    {before !== undefined && (
                                        <span className="whitespace-nowrap">
                                            Fee: ₹{before}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
