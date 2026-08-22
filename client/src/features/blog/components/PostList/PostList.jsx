import PostCard from './PostCard';
import {
    PostListEmpty,
    PostListError,
    PostListSkeleton,
} from './PostListStates';

const PostList = ({ posts, isLoading, error, isEmpty, onRetry }) => {
    if (isLoading) return <PostListSkeleton />;
    if (error) return <PostListError message={error} onRetry={onRetry} />;
    if (isEmpty) return <PostListEmpty />;

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
            ))}
        </div>
    );
};

export default PostList;
