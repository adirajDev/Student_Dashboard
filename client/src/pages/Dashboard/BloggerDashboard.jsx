import { useOutletContext, useSearchParams } from 'react-router-dom';
import WritePostTab from '../../features/blogger/components/WritePostTab';
import UpdateProfileTab from '../../features/blogger/components/UpdateProfileTab';
import ViewPostsTab from '../../features/blogger/components/ViewPostsTab';

const BloggerDashboard = () => {
    const { user } = useOutletContext();
    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') || 'write';

    return (
        <main className="max-w-5xl mx-auto px-4 py-8">
            <div className="mb-8">
                <h2 className="text-3xl mb-2">Blogger Dashboard</h2>
                <p className="text-[var(--ring)]">
                    Write posts, manage your profile, and track your published
                    content.
                </p>
            </div>

            {activeTab === 'write' && <WritePostTab user={user} />}
            {activeTab === 'profile' && <UpdateProfileTab user={user} />}
            {activeTab === 'posts' && <ViewPostsTab user={user} />}
        </main>
    );
};

export default BloggerDashboard;
