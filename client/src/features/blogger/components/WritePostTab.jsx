import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PenSquare } from 'lucide-react';
import useBlogPosts from '../../blog/hooks/useBlogPosts';
import BlogEditor from '../../blog/components/BlogEditor/BlogEditor';
import Loading from '@/components/common/Loading';

const WritePostTab = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const postId = searchParams.get('postId');

    const {
        createPost,
        updatePost,
        submitForReview,
        getPostById,
        loading,
        error,
    } = useBlogPosts();
    const [post, setPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(Boolean(postId));
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (!postId) {
            setPost(null);
            return;
        }
        setLoadingPost(true);
        getPostById(postId).then(data => {
            setPost(data);
            setLoadingPost(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const goToPost = id => {
        setSearchParams({ tab: 'write', postId: id });
    };

    const handleSaveDraft = async payload => {
        setSuccessMsg('');
        try {
            if (postId) {
                const updated = await updatePost(postId, payload);
                setPost(updated);
            } else {
                const created = await createPost(payload);
                setPost(created);
                goToPost(created._id);
            }
            setSuccessMsg('Draft saved.');
        } catch {
            // error surfaced via hook's error state
        }
    };

    const handleSubmitForReview = async payload => {
        setSuccessMsg('');
        try {
            let targetId = postId;
            if (postId) {
                await updatePost(postId, payload);
            } else {
                const created = await createPost(payload);
                targetId = created._id;
                goToPost(created._id);
            }
            const submitted = await submitForReview(targetId);
            setPost(submitted);
            setSuccessMsg('Submitted for review.');
        } catch {
            // error surfaced via hook's error state
        }
    };

    if (loadingPost) return <Loading />;

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-[var(--foreground)]">
                    <PenSquare className="w-5 h-5 text-[var(--color-amber-600)]" />
                    <h3 className="text-xl">
                        {postId ? 'Editing Post' : 'New Post'}
                    </h3>
                </div>
                {postId && (
                    <button
                        type="button"
                        onClick={() => setSearchParams({ tab: 'write' })}
                        className="btn-secondary py-1.5 px-4 text-sm"
                    >
                        Start New Post
                    </button>
                )}
            </div>

            {successMsg && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl">
                    {successMsg}
                </div>
            )}

            <BlogEditor
                key={postId || 'new'}
                initialPost={post}
                onSaveDraft={handleSaveDraft}
                onSubmitForReview={handleSubmitForReview}
                isSubmitting={loading}
                error={error}
            />
        </div>
    );
};

export default WritePostTab;
