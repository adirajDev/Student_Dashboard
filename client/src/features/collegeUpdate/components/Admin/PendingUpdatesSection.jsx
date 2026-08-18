import { useState, useEffect } from 'react';
import { FileEdit, CheckCircle2 } from 'lucide-react';
import useCollegeUpdates from '../../hooks/useCollegeUpdates';
import Loading from '@/components/common/Loading';
import Pagination from '@/components/common/Pagination';
import ReviewUpdateModal from './ReviewUpdateModal';

const PendingUpdatesSection = ({ title }) => {
    const {
        page,
        setPage,
        totalPages,
        getAllUpdates,
        approveUpdate,
        rejectUpdate,
    } = useCollegeUpdates();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUpdate, setSelectedUpdate] = useState(null);

    const fetchUpdates = async () => {
        setLoading(true);
        const data = await getAllUpdates();
        setUpdates(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchUpdates();
    }, [page, getAllUpdates]);

    const handleApprove = async id => {
        try {
            await approveUpdate(id);
            setSelectedUpdate(null);
            fetchUpdates();
        } catch (err) {
            console.error('Failed to approve update', err);
        }
    };

    const handleReject = async (id, feedback) => {
        try {
            await rejectUpdate(id, feedback);
            setSelectedUpdate(null);
            fetchUpdates();
        } catch (err) {
            console.error('Failed to reject update', err);
        }
    };

    return (
        <div className="bg-[var(--color-amber-50)] rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl flex items-center gap-2">
                    <FileEdit className="w-5 h-5 text-blue-500" />
                    {title}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {updates.length} Pending
                </span>
            </div>

            {loading ? (
                <div className="py-12">
                    <Loading />
                </div>
            ) : updates.length === 0 ? (
                <div className="py-16 text-center text-[var(--ring)] flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mb-4 opacity-50" />
                    <p>All caught up! No pending updates to review.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-sm text-[var(--color-ink-600)]">
                                <th className="pb-3 font-medium">College</th>
                                <th className="pb-3 font-medium">
                                    Requested By
                                </th>
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {updates.map(update => (
                                <tr
                                    key={update._id}
                                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--color-amber-100)] transition-colors"
                                >
                                    <td className="py-4 text-sm font-medium">
                                        {update.college?.name ||
                                            'Unknown College'}
                                    </td>
                                    <td className="py-4 text-sm text-[var(--ring)]">
                                        {update.requestedBy?.name}
                                    </td>
                                    <td className="py-4 text-sm text-[var(--ring)]">
                                        {new Date(
                                            update.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() =>
                                                setSelectedUpdate(update)
                                            }
                                            className="px-4 py-1.5 bg-[var(--color-amber-200)] hover:bg-[var(--color-amber-300)] text-[var(--color-amber-800)] rounded-xl text-sm font-bold transition-colors"
                                        >
                                            Review
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {updates && updates.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <Pagination
                        currentPage={page || 1}
                        totalPages={totalPages || 1}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {selectedUpdate && (
                <ReviewUpdateModal
                    update={selectedUpdate}
                    onClose={() => setSelectedUpdate(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default PendingUpdatesSection;
