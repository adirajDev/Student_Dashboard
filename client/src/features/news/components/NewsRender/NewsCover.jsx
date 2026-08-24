import { getImageSrc } from '../../utils/newsUtils';

const NewsCover = ({ coverImage, alt }) => {
    const src = getImageSrc(coverImage);
    if (!src) return null;

    return (
        <figure className="mb-10 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--color-ink-50)]">
            <img
                src={src}
                alt={alt || 'Cover'}
                className="w-full max-h-[460px] object-cover"
            />
        </figure>
    );
};

export default NewsCover;