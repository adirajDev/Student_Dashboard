import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, EyeOff, Eye, ChevronUp } from 'lucide-react';
import useBlogPosts from '../../blog/hooks/useBlogPosts';
import Loading from '../../../components/common/Loading';
import ActionMenu from '../../../components/common/ActionMenu';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import renderPostContent from '../../blog/components/renderPostContent';

const EDITABLE_STATUSES = ['draft', 'rejected'];

const STATUS_LABELS = {
    draft: 'Draft',
    pending_review: 'Pending Review',
    published: 'Published',
    rejected: 'Rejected',
};

const STATUS_CLASSES = {
    draft: 'bg-[var(--color-ink-100)] text-[var(--color-ink-700)]',
    pending_review: 'bg-[var(--color-amber-100)] text-[var(--color-amber-800)]',
    published: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    rejected: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
};

const ViewPostsTab = () => {
    const { getMyPosts, deletePost, unpublishPost } = useBlogPosts();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingPost, setDeletingPost] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const fetchPosts = async () => {
        setLoading(true);
        const data = await getMyPosts();
        setPosts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async () => {
        try {
            await deletePost(deletingPost._id);
            setDeletingPost(null);
            fetchPosts();
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    const handleUnpublish = async post => {
        try {
            await unpublishPost(post._id);
            fetchPosts();
        } catch (err) {
            console.error('Failed to unpublish post', err);
        }
    };

    if (loading) return <Loading />;

    if (posts.length === 0) {
        return (
            <div className="text-center py-12 text-[var(--ring)] bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm">
                <p>You haven't published any posts yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in">
            {posts.map(post => {
                const editable = EDITABLE_STATUSES.includes(post.status);
                const expanded = expandedId === post._id;

                return (
                    <div
                        key={post._id}
                        className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="text-lg text-[var(--foreground)] mb-1">
                                    {post.title}
                                </h4>
                                <span className="text-sm text-[var(--ring)]">
                                    Updated{' '}
                                    {new Date(
                                        post.updatedAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span
                                    className={`status-pill ${STATUS_CLASSES[post.status] || ''}`}
                                >
                                    {STATUS_LABELS[post.status] || post.status}
                                </span>
                                <ActionMenu
                                    actions={[
                                        editable && {
                                            label: 'Edit',
                                            icon: (
                                                <Pencil className="w-4 h-4" />
                                            ),
                                            onClick: () =>
                                                navigate(
                                                    `/blogger/dashboard?tab=write&postId=${post._id}`
                                                ),
                                        },
                                        editable && {
                                            label: 'Delete',
                                            icon: (
                                                <Trash2 className="w-4 h-4" />
                                            ),
                                            danger: true,
                                            onClick: () =>
                                                setDeletingPost(post),
                                        },
                                        post.status === 'published' && {
                                            label: 'Unpublish',
                                            icon: (
                                                <EyeOff className="w-4 h-4" />
                                            ),
                                            onClick: () =>
                                                handleUnpublish(post),
                                        },
                                        {
                                            label: expanded ? 'Hide' : 'View',
                                            icon: expanded ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            ),
                                            onClick: () =>
                                                setExpandedId(
                                                    expanded ? null : post._id
                                                ),
                                        },
                                    ].filter(Boolean)}
                                />
                            </div>
                        </div>

                        {post.status === 'rejected' && post.reviewNote && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <h5 className="text-red-800 font-medium text-sm mb-1">
                                    Admin Feedback:
                                </h5>
                                <p className="text-red-700 text-sm">
                                    {post.reviewNote}
                                </p>
                            </div>
                        )}

                        {expanded && (
                            <div className="mt-4 pt-4 border-t border-[var(--border)] tiptap-content">
                                {renderPostContent(post.content)}
                            </div>
                        )}
                    </div>
                );
            })}

            {deletingPost && (
                <DeleteConfirmModal
                    studentName={deletingPost.title}
                    onConfirm={handleDelete}
                    onClose={() => setDeletingPost(null)}
                />
            )}
        </div>
    );
};

export default ViewPostsTab;
