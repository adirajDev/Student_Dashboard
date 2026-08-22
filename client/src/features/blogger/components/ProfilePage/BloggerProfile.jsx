import {
    AchievementList,
    BloggerAbout,
    BloggerContact,
    BloggerHeader,
    SpecializationList,
} from './BloggerSections';
import {
    BloggerNotFound,
    BloggerProfileError,
    BloggerProfileSkeleton,
} from './BloggerProfileStates';

const BloggerProfile = ({ blogger, isLoading, error, notFound, onRetry }) => {
    if (isLoading) return <BloggerProfileSkeleton />;
    if (error) return <BloggerProfileError message={error} onRetry={onRetry} />;
    if (notFound || !blogger) return <BloggerNotFound />;

    return (
        <div className="space-y-8">
            <div className="stagger-in stagger-1">
                <BloggerHeader blogger={blogger} />
            </div>

            <div className="stagger-in stagger-2 grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <BloggerAbout about={blogger.about} />
                    <AchievementList achievements={blogger.achievements} />
                </div>

                <div className="space-y-6">
                    <SpecializationList
                        specializations={blogger.specializations}
                    />
                    <BloggerContact email={blogger.email} />
                </div>
            </div>
        </div>
    );
};

export default BloggerProfile;
