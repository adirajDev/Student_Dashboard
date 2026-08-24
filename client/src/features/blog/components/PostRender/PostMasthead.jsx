import { Link } from 'react-router-dom';
import PostByline from './PostByLine.jsx';
import useShareLink from '../../hooks/useShareLink.js';

const PostMasthead = ({ title, excerpt, author, publishedAt, readingTime }) => {
    return (
        <header className="surface-wash border-b border-[var(--border)]">
            <div className="mx-auto max-w-3xl px-5 pt-10 pb-14">
                <Link
                    to="/blog"
                    className="btn-ghost -ml-4 stagger-in stagger-1"
                >
                    <span aria-hidden="true">&larr;</span> All articles
                </Link>

                <p className="stat-label mt-6 block stagger-in stagger-1">
                    {readingTime} min read
                </p>

                <h1 className="mt-4 text-3xl leading-tight md:text-5xl md:leading-[1.1] stagger-in stagger-2">
                    {title}
                </h1>

                {excerpt && (
                    <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-600)] stagger-in stagger-3">
                        {excerpt}
                    </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 stagger-in stagger-4">
                    <PostByline author={author} publishedAt={publishedAt} />
                </div>
            </div>
        </header>
    );
};

export default PostMasthead;
