import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import useCollegeUpdates from '../hooks/useCollegeUpdates';
import Loading from '../../../components/common/Loading';

const UpdateHistoryTab = () => {
    const { getMyUpdates } = useCollegeUpdates();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUpdates = async () => {
            const data = await getMyUpdates();
            setUpdates(data);
            setLoading(false);
        };
        fetchUpdates();
    }, [getMyUpdates]);

    if (loading) return <Loading />;

    if (updates.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--ring)] bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
                <p>You haven't submitted any update requests yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {updates.map((update) => (
                <div key={update._id} className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-[var(--ring)]">
                            Submitted on {new Date(update.createdAt).toLocaleDateString()}
                        </span>
                        
                        {update.status === 'pending' && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                <Clock className="w-3 h-3" /> Pending Review
                            </span>
                        )}
                        {update.status === 'approved' && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                        )}
                        {update.status === 'rejected' && (
                            <span className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                <XCircle className="w-3 h-3" /> Rejected
                            </span>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-medium text-[var(--foreground)]">Proposed Changes:</h4>
                        
                        {/* Inline renderers for the different change types */}
                        {update.proposedChanges?.name && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-semibold text-[var(--ring)] uppercase mb-1 block">College Name</span>
                                <p className="font-medium">{update.proposedChanges.name}</p>
                            </div>
                        )}
                        
                        {update.proposedChanges?.description && (
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
                                <span className="text-xs font-semibold text-[var(--ring)] uppercase mb-1 block">Description</span>
                                <p className="text-sm line-clamp-3">{update.proposedChanges.description}</p>
                            </div>
                        )}

                        {update.proposedChanges?.placementDetails && (
                            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-[var(--border)]">
                                <span className="text-xs font-semibold text-[var(--ring)] uppercase mb-2 block">Placement Details</span>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-[var(--ring)] uppercase mb-1">Average Package</p>
                                        <p className="font-medium text-sm">{update.proposedChanges.placementDetails.averagePackage ? `₹${update.proposedChanges.placementDetails.averagePackage} LPA` : 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-[var(--ring)] uppercase mb-1">Highest Package</p>
                                        <p className="font-medium text-sm">{update.proposedChanges.placementDetails.highestPackage ? `₹${update.proposedChanges.placementDetails.highestPackage} LPA` : 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                        <p className="text-xs text-[var(--ring)] uppercase mb-1">Placement %</p>
                                        <p className="font-medium text-sm">{update.proposedChanges.placementDetails.placementPercentage ? `${update.proposedChanges.placementDetails.placementPercentage}%` : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {update.proposedChanges?.recruiters && (
                            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-[var(--border)]">
                                <span className="text-xs font-semibold text-[var(--ring)] uppercase mb-2 block">Top Recruiters</span>
                                <div className="flex flex-wrap gap-2">
                                    {update.proposedChanges.recruiters.length > 0 ? update.proposedChanges.recruiters.map((rec, i) => (
                                        <span key={i} className="px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 rounded-lg text-xs font-medium">
                                            {rec}
                                        </span>
                                    )) : <span className="text-xs italic text-[var(--ring)]">No recruiters listed</span>}
                                </div>
                            </div>
                        )}

                        {update.proposedChanges?.faculty && (
                            <div className="bg-white dark:bg-slate-800/50 rounded-xl p-4 border border-[var(--border)]">
                                <span className="text-xs font-semibold text-[var(--ring)] uppercase mb-2 block">Faculty Roster</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {update.proposedChanges.faculty.length > 0 ? update.proposedChanges.faculty.map((fac, i) => (
                                        <div key={i} className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold shrink-0 text-xs">
                                                {fac.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-xs">{fac.name}</p>
                                                <p className="text-[10px] text-[var(--ring)]">{fac.role} • {fac.department}</p>
                                            </div>
                                        </div>
                                    )) : <span className="text-xs italic text-[var(--ring)]">No faculty listed</span>}
                                </div>
                            </div>
                        )}
                    </div>

                    {update.status === 'rejected' && update.adminFeedback && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <h5 className="text-red-800 dark:text-red-300 font-medium text-sm mb-1">Admin Feedback:</h5>
                            <p className="text-red-700 dark:text-red-400 text-sm">{update.adminFeedback}</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default UpdateHistoryTab;
