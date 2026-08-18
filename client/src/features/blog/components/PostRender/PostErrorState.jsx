import { Link } from 'react-router-dom';

const PostErrorState = ({ notFound, onRetry }) => (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="stat-label">{notFound ? 'Error 404' : 'Error'}</p>

        <h1 className="mt-3 text-3xl md:text-4xl">
            {notFound ? 'This article isn’t here' : 'The article didn’t load'}
        </h1>

        <p className="mt-4 text-[var(--muted)]">
            {notFound
                ? 'The link may be mistyped, or the post was unpublished. Browse the journal to find what you were after.'
                : 'Something went wrong on the way to the server. Try again in a moment.'}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {!notFound && (
                <button type="button" onClick={onRetry} className="btn-primary">
                    Try again
                </button>
            )}
            <Link to="/blog" className="btn-secondary">
                Back to all articles
            </Link>
        </div>
    </div>
);

export default PostErrorState;
