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
        <div className="flex flex-col gap-6">
            {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
            ))}
        </div>
    );
};

export default PostList;
