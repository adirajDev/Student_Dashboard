import { coverImageSrc } from './utils/postFormatters';

const PostCover = ({ coverImage }) => {
    const src = coverImageSrc(coverImage);
    if (!src) return null;

    return (
        <img
            src={src}
            alt=""
            className="-mt-8 mb-10 aspect-[16/9] w-full rounded-[var(--radius-lg)] border border-[var(--border)] object-cover shadow-[0_1px_2px_rgba(16,26,40,0.04),0_16px_32px_-12px_rgba(16,26,40,0.18)]"
        />
    );
};

export default PostCover;
