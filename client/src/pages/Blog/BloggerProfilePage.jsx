import { useParams } from 'react-router-dom';
import BloggerProfile from '@/features/blogger/components/ProfilePage/BloggerProfile';
import useBloggerProfile from '@/features/blogger/hooks/useBloggerProfile.js';

const BloggerProfilePage = () => {
    const { userId } = useParams();
    const { blogger, isLoading, error, notFound, refetch } =
        useBloggerProfile(userId);

    return (
        <main className="min-h-screen">
            <div className="surface-wash border-b border-[var(--border)]">
                <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
                    <BloggerProfile
                        blogger={blogger}
                        isLoading={isLoading}
                        error={error}
                        notFound={notFound}
                        onRetry={refetch}
                    />
                </div>
            </div>
        </main>
    );
};

export default BloggerProfilePage;
