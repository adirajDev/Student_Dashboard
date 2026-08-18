import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

import usePostBySlug from '../../features/blog/hooks/usePostBySlug.js';
import useReadingTime from '../../features/blog/hooks/useReadingTime.js';

import PostAuthorCard from '../../features/blog/components/PostRender/PostAuthorCard.jsx';
import PostBody from '../../features/blog/components/PostRender/PostBody.jsx';
import PostCover from '../../features/blog/components/PostRender/PostCover.jsx';
import PostErrorState from '../../features/blog/components/PostRender/PostErrorState.jsx';
import PostMasthead from '../../features/blog/components/PostRender/PostMasthead.jsx';
import PostSkeleton from '../../features/blog/components/PostRender/PostSkeleton.jsx';
import ReadingProgressBar from '../../features/blog/components/PostRender/ReadingProgressBar.jsx';

import { authorOf } from '../../features/blog/components/PostRender/utils/postFormatters.js';

const BlogDetail = () => {
    const { slug } = useParams();
    const articleRef = useRef(null);

    const { post, status, retry } = usePostBySlug(slug);
    const readingTime = useReadingTime(post?.content);
    const author = useMemo(() => authorOf(post?.author), [post?.author]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [slug]);

    useEffect(() => {
        if (post?.title) document.title = `${post.title} — Journal`;
    }, [post?.title]);

    if (status === 'loading') return <PostSkeleton />;
    if (status !== 'ready') {
        return (
            <PostErrorState notFound={status === 'notFound'} onRetry={retry} />
        );
    }

    return (
        <>
            <ReadingProgressBar targetRef={articleRef} />

            <article ref={articleRef} className="surface-paper pb-24">
                <PostMasthead
                    title={post.title}
                    excerpt={post.excerpt}
                    author={author}
                    publishedAt={post.publishedAt || post.createdAt}
                    readingTime={readingTime}
                />

                <div className="mx-auto max-w-3xl px-5">
                    <PostCover coverImage={post.coverImage} />
                    <PostBody content={post.content} />

                    <PostAuthorCard author={author} />

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
                        <p className="text-sm text-[var(--muted)]">
                            More guidance on choosing a college, course, and
                            career path.
                        </p>
                        <Link to="/blog" className="btn-primary">
                            Browse the journal
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};

export default BlogDetail;
