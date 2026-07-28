import {
    X,
    Check,
    XCircle,
    Building2,
    TrendingUp,
    Users,
    Presentation,
} from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

const ReviewUpdateModal = ({ update, onClose, onApprove, onReject }) => {
    const [feedback, setFeedback] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    if (!update) return null;

    const changes = update.proposedChanges;

    const renderDiff = (label, currentVal, proposedVal) => {
        if (proposedVal === undefined || proposedVal === currentVal)
            return null;
        return (
            <div className="mb-4">
                <span className="block text-xs font-semibold text-[var(--ring)] uppercase mb-1">
                    {label}
                </span>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                    <div className="flex-1 bg-red-50 border border-red-200 p-3 rounded-xl line-through text-red-800 opacity-60">
                        {currentVal || (
                            <span className="italic text-xs">Empty</span>
                        )}
                    </div>
                    <div className="flex-1 bg-green-50 border border-green-200 p-3 rounded-xl text-green-800">
                        {proposedVal}
                    </div>
                </div>
            </div>
        );
    };

    const renderPlacementDetails = details => {
        if (!details) return null;
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-[var(--ring)] uppercase mb-1">
                        Average Package
                    </p>
                    <p className="font-medium">
                        {details.averagePackage
                            ? `₹${details.averagePackage} LPA`
                            : 'N/A'}
                    </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-[var(--ring)] uppercase mb-1">
                        Highest Package
                    </p>
                    <p className="font-medium">
                        {details.highestPackage
                            ? `₹${details.highestPackage} LPA`
                            : 'N/A'}
                    </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <p className="text-xs text-[var(--ring)] uppercase mb-1">
                        Placement %
                    </p>
                    <p className="font-medium">
                        {details.placementPercentage
                            ? `${details.placementPercentage}%`
                            : 'N/A'}
                    </p>
                </div>
            </div>
        );
    };

    const renderRecruiters = recruiters => {
        if (!recruiters || recruiters.length === 0)
            return (
                <p className="text-sm italic text-[var(--ring)]">
                    No recruiters listed
                </p>
            );
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {recruiters.map((rec, i) => (
                    <span
                        key={i}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium"
                    >
                        {rec}
                    </span>
                ))}
            </div>
        );
    };

    const renderFaculty = faculty => {
        if (!faculty || faculty.length === 0)
            return (
                <p className="text-sm italic text-[var(--ring)]">
                    No faculty listed
                </p>
            );
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                {faculty.map((fac, i) => (
                    <div
                        key={i}
                        className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-3"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                            {fac.name?.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{fac.name}</p>
                            <p className="text-xs text-[var(--ring)]">
                                {fac.role} • {fac.department}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderCourseUpdates = courseUpdates => {
        if (!courseUpdates) return null;

        const getCourseDetails = id => {
            const course = courseUpdates.populatedCourses?.find(
                c => c._id === id
            );
            if (!course) return { name: id, shortName: id, level: '' };
            return course;
        };

        return (
            <div className="space-y-4 mt-2">
                {courseUpdates.added?.length > 0 && (
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                        <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                            Added Courses
                        </h4>
                        <div className="grid gap-2">
                            {courseUpdates.added.map((item, i) => {
                                const course = getCourseDetails(item.course);
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span>
                                            {course.shortName || course.name}
                                            {course.specialization
                                                ? ` - ${course.specialization}`
                                                : ''}
                                            <span className="text-xs opacity-70 ml-1">
                                                ({course.level})
                                            </span>
                                        </span>
                                        <span className="font-medium">
                                            Fee: ₹{item.fee}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {courseUpdates.updated?.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-800 mb-2">
                            Updated Fees
                        </h4>
                        <div className="grid gap-2">
                            {courseUpdates.updated.map((item, i) => {
                                const course = getCourseDetails(item.course);
                                return (
                                    <div
                                        key={i}
                                        className="flex justify-between items-center text-sm"
                                    >
                                        <span>
                                            {course.shortName || course.name}
                                            {course.specialization
                                                ? ` - ${course.specialization}`
                                                : ''}
                                            <span className="text-xs opacity-70 ml-1">
                                                ({course.level})
                                            </span>
                                        </span>
                                        <span className="font-medium">
                                            New Fee: ₹{item.fee}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {courseUpdates.removed?.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                        <h4 className="text-sm font-semibold text-red-800 mb-2">
                            Removed Courses
                        </h4>
                        <div className="grid gap-2">
                            {courseUpdates.removed.map((id, i) => {
                                const course = getCourseDetails(id);
                                return (
                                    <div
                                        key={i}
                                        className="text-sm line-through opacity-70 text-red-700"
                                    >
                                        {course.shortName || course.name}
                                        {course.specialization
                                            ? ` - ${course.specialization}`
                                            : ''}
                                        <span className="ml-1">
                                            ({course.level})
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex justify-center items-center p-4 sm:p-6 animate-fade-in">
            <div className="bg-[var(--card)] rounded-3xl w-full max-w-3xl max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl border border-[var(--border)] overflow-hidden mt-0">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                    <h3 className="text-xl">Review: {update.college?.name}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Diff view) */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6">
                    <div className="p-4 bg-blue-50 text-blue-800 rounded-2xl text-sm border border-blue-200">
                        Requested by <strong>{update.requestedBy?.name}</strong>{' '}
                        ({update.requestedBy?.email}) on{' '}
                        {new Date(update.createdAt).toLocaleDateString()}
                    </div>

                    <div className="space-y-6">
                        {changes.name &&
                            renderDiff(
                                'College Name',
                                update.college?.name,
                                changes.name
                            )}
                        {changes.type &&
                            renderDiff(
                                'College Type',
                                update.college?.type,
                                changes.type
                            )}
                        {changes.location &&
                            renderDiff(
                                'Location',
                                update.college?.location,
                                changes.location
                            )}
                        {changes.collegeId &&
                            renderDiff(
                                'College ID',
                                update.college?.collegeId,
                                changes.collegeId
                            )}
                        {changes.logo &&
                            renderDiff(
                                'Logo URL',
                                update.college?.logo,
                                changes.logo
                            )}
                        {changes.overview &&
                            renderDiff(
                                'Overview',
                                'Current Overview Hidden (See DB)',
                                changes.overview
                            )}
                        {changes.description &&
                            renderDiff(
                                'Description',
                                'Current Description Hidden (See DB)',
                                changes.description
                            )}

                        {changes.placementDetails && (
                            <div className="border border-[var(--border)] rounded-2xl p-5 bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[var(--foreground)] font-semibold border-b border-[var(--border)] pb-3">
                                    <TrendingUp className="w-5 h-5 text-blue-500" />{' '}
                                    Placements (Proposed)
                                </div>
                                {renderPlacementDetails(
                                    changes.placementDetails
                                )}
                            </div>
                        )}

                        {changes.recruiters && (
                            <div className="border border-[var(--border)] rounded-2xl p-5 bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[var(--foreground)] font-semibold border-b border-[var(--border)] pb-3">
                                    <Building2 className="w-5 h-5 text-purple-500" />{' '}
                                    Top Recruiters (Proposed)
                                </div>
                                {renderRecruiters(changes.recruiters)}
                            </div>
                        )}

                        {changes.faculty && (
                            <div className="border border-[var(--border)] rounded-2xl p-5 bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[var(--foreground)] font-semibold border-b border-[var(--border)] pb-3">
                                    <Users className="w-5 h-5 text-orange-500" />{' '}
                                    Faculty Roster (Proposed)
                                </div>
                                {renderFaculty(changes.faculty)}
                            </div>
                        )}

                        {changes.courseUpdates && (
                            <div className="border border-[var(--border)] rounded-2xl p-5 bg-white shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-[var(--foreground)] font-semibold border-b border-[var(--border)] pb-3">
                                    <Presentation className="w-5 h-5 text-emerald-500" />{' '}
                                    Course Updates (Proposed)
                                </div>
                                {renderCourseUpdates(changes.courseUpdates)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[var(--border)] bg-slate-50">
                    {isRejecting ? (
                        <div className="animate-fade-in space-y-3">
                            <label className="block text-sm font-medium text-[var(--foreground)]">
                                Reason for Rejection
                            </label>
                            <textarea
                                value={feedback}
                                onChange={e => setFeedback(e.target.value)}
                                className="input-field min-h-[80px]"
                                placeholder="Explain why these changes are being rejected..."
                                autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setIsRejecting(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() =>
                                        onReject(update._id, feedback)
                                    }
                                    disabled={!feedback.trim()}
                                    className="btn-primary bg-red-500 hover:bg-red-600 border-none"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsRejecting(true)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors"
                            >
                                <XCircle className="w-4 h-4" /> Reject
                            </button>
                            <button
                                onClick={() => onApprove(update._id)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                            >
                                <Check className="w-4 h-4" /> Approve Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReviewUpdateModal;
