import useAvatar from '@/features/blog/hooks/useAvatar';

const AuthorAvatar = ({ src, initials, name }) => {
    const { showImage, handleError } = useAvatar(src);

    return (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--color-ink-50)]">
            {showImage ? (
                <img
                    src={src}
                    alt={name}
                    onError={handleError}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            ) : (
                <span
                    aria-hidden="true"
                    className="font-display text-xs font-semibold text-[var(--color-ink-600)]"
                >
                    {initials}
                </span>
            )}
        </span>
    );
};

export default AuthorAvatar;
