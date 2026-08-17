import { useState, useEffect } from 'react';
import { Newspaper, CheckCircle2 } from 'lucide-react';
import useBlogReview from '../../hooks/useBlogReview';
import Loading from '../../../../components/common/Loading';
import Pagination from '../../../../components/common/Pagination';
import ReviewPostModal from './ReviewPostModal';

const PendingPostsSection = ({ title }) => {
    const {
        page,
        setPage,
        totalPages,
        getPendingPosts,
        approvePost,
        rejectPost,
    } = useBlogReview();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        const data = await getPendingPosts();
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, getPendingPosts]);

    const handleApprove = async id => {
        try {
            await approvePost(id);
            setSelectedPost(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to approve post', err);
        }
    };

    const handleReject = async (id, reviewNote) => {
        try {
            await rejectPost(id, reviewNote);
            setSelectedPost(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to reject post', err);
        }
    };

    return (
        <div className="bg-[var(--color-amber-50)] rounded-[var(--radius-xl)] p-6 shadow-sm border border-[var(--border)]">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-500" />
                    {title}
                </h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                    {posts.length} Pending
                </span>
            </div>

            {loading ? (
                <div className="py-12">
                    <Loading />
                </div>
            ) : posts.length === 0 ? (
                <div className="py-16 text-center text-[var(--ring)] flex flex-col items-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mb-4 opacity-50" />
                    <p>All caught up! No posts pending review.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border)] text-sm text-[var(--color-ink-600)]">
                                <th className="pb-3 font-medium">Title</th>
                                <th className="pb-3 font-medium">Author</th>
                                <th className="pb-3 font-medium">Submitted</th>
                                <th className="pb-3 font-medium text-right">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(post => (
                                <tr
                                    key={post._id}
                                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--color-amber-100)] transition-colors"
                                >
                                    <td className="py-4 text-sm font-medium">
                                        {post.title}
                                    </td>
                                    <td className="py-4 text-sm text-[var(--ring)]">
                                        {post.author?.name}
                                    </td>
                                    <td className="py-4 text-sm text-[var(--ring)]">
                                        {new Date(
                                            post.updatedAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() =>
                                                setSelectedPost(post)
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

            {posts && posts.length > 0 && (
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <Pagination
                        currentPage={page || 1}
                        totalPages={totalPages || 1}
                        onPageChange={setPage}
                    />
                </div>
            )}

            {selectedPost && (
                <ReviewPostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default PendingPostsSection;
