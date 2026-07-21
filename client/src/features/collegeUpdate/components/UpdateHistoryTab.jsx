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

                    <div className="space-y-2">
                        <h4 className="font-medium text-[var(--foreground)]">Proposed Changes:</h4>
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-sm font-mono overflow-x-auto text-[var(--foreground)]">
                            <pre>{JSON.stringify(update.proposedChanges, null, 2)}</pre>
                        </div>
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
