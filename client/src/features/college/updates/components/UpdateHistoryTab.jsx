import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import useCollegeUpdates from '../hooks/useCollegeUpdates.js';
import Loading from '@/components/common/Loading.jsx';
import Pagination from '@/components/common/Pagination.jsx';
import { buildChangeSections } from './changes/index.js';

const STATUS_BADGES = {
    pending: {
        icon: Clock,
        label: 'Pending Review',
        className: 'bg-yellow-100 text-yellow-700',
    },
    approved: {
        icon: CheckCircle2,
        label: 'Approved',
        className: 'bg-green-100 text-green-700',
    },
    rejected: {
        icon: XCircle,
        label: 'Rejected',
        className: 'bg-red-100 text-red-700',
    },
};

const hasSnapshot = update =>
    !!update?.previousValues &&
    typeof update.previousValues === 'object' &&
    Object.keys(update.previousValues).length > 0;

const StatusBadge = ({ status }) => {
    const badge = STATUS_BADGES[status];
    if (!badge) return null;
    const Icon = badge.icon;
    return (
        <span
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
        >
            <Icon className="w-3 h-3" /> {badge.label}
        </span>
    );
};

const UpdateHistoryTab = () => {
    const { page, setPage, totalPages, getMyUpdates } = useCollegeUpdates();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchUpdates = async () => {
            setLoading(true);
            try {
                const data = await getMyUpdates();
                if (!cancelled) setUpdates(Array.isArray(data) ? data : []);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchUpdates();
        return () => {
            cancelled = true;
        };
    }, [page, getMyUpdates]);

    if (loading) return <Loading />;

    if (updates.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--ring)] bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
                <p>You haven&apos;t submitted any update requests yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {updates.map(update => {
                // Same builder the admin review modal uses, so this tab can
                // never fall behind on a newly supported field.
                //
                // Diff against the snapshot taken when the request was
                // submitted, not the live college. Once a request is approved
                // the college already holds the proposed values, so diffing
                // against it would collapse every row to "nothing changed".
                // Requests created before previousValues existed fall back to
                // the live record, which is still correct while they're pending.
                //
                // Three cases:
                //   snapshot present        -> a real diff, for any status
                //   legacy + still pending  -> the live college is still the
                //                              before-state, so diff that
                //   legacy + already decided-> the before-state is unrecoverable;
                //                              list what was submitted instead
                const legacyDecided =
                    !hasSnapshot(update) && update.status !== 'pending';

                const baseline = hasSnapshot(update)
                    ? update.previousValues
                    : legacyDecided
                      ? {}
                      : update.college;

                const sections = buildChangeSections(update, {
                    before: baseline,
                });

                return (
                    <div
                        key={update._id}
                        className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-[var(--ring)]">
                                Submitted on{' '}
                                {new Date(
                                    update.createdAt
                                ).toLocaleDateString()}
                            </span>
                            <StatusBadge status={update.status} />
                        </div>

                        <h4 className="text-[var(--foreground)] mb-1">
                            Proposed Changes
                        </h4>
                        <p className="text-xs text-[var(--ring)] mb-4">
                            {hasSnapshot(update)
                                ? 'Compared against your college record as it stood when you submitted.'
                                : legacyDecided
                                  ? 'Values as submitted. This request predates change tracking, so the original values were not recorded.'
                                  : 'Compared against your college record as it stands now.'}
                        </p>

                        {sections.length === 0 ? (
                            <div className="py-8 text-center text-sm text-[var(--ring)] border border-dashed border-[var(--border)] rounded-2xl">
                                Nothing in this request differed from your
                                college record at the time it was submitted.
                            </div>
                        ) : (
                            <div className="space-y-6">{sections}</div>
                        )}

                        {update.status === 'rejected' &&
                            update.adminFeedback && (
                                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <h5 className="text-red-800 font-medium text-sm mb-1">
                                        Admin Feedback:
                                    </h5>
                                    <p className="text-red-700 text-sm">
                                        {update.adminFeedback}
                                    </p>
                                </div>
                            )}
                    </div>
                );
            })}

            <div className="mt-6 border-t border-[var(--border)] pt-4">
                <Pagination
                    currentPage={page || 1}
                    totalPages={totalPages || 1}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
};

export default UpdateHistoryTab;
