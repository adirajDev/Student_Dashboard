import PostList from '@/features/blog/components/PostList/PostList.jsx';
import usePublishedPosts from '@/features/blog/hooks/usePublishedPosts';

const PostListing = () => {
    const { posts, isLoading, error, isEmpty, refetch } = usePublishedPosts();

    return (
        <main className="min-h-screen">
            <header className="surface-wash border-b border-[var(--border)]">
                <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                    <p className="stat-label stagger-in stagger-1">
                        The Journal
                    </p>
                    <h1 className="stagger-in stagger-2 mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">
                        Guidance and latest news about college admissions, and
                        exams.
                    </h1>
                    <p className="stagger-in stagger-3 mt-5 max-w-xl text-base leading-relaxed text-[var(--muted)]">
                        Cut-offs, placement numbers, campus realities, upcoming
                        exams and application strategy — explained without the
                        brochure gloss.
                    </p>
                </div>
            </header>

            <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
                <PostList
                    posts={posts}
                    isLoading={isLoading}
                    error={error}
                    isEmpty={isEmpty}
                    onRetry={refetch}
                />
            </section>
        </main>
    );
};

export default PostListing;
