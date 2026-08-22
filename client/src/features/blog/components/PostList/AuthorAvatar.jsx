import useAvatar from '@/features/blog/hooks/useAvatar';

const SIZES = {
    sm: 'h-9 w-9 text-xs',
    lg: 'h-20 w-20 text-xl md:h-24 md:w-24 md:text-2xl',
};

const AuthorAvatar = ({ src, initials, name, size = 'sm' }) => {
    const { showImage, handleError } = useAvatar(src);

    return (
        <span
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--color-ink-50)] ${SIZES[size] ?? SIZES.sm}`}
        >
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
                    className="font-display font-semibold text-[var(--color-ink-600)]"
                >
                    {initials}
                </span>
            )}
        </span>
    );
};

export default AuthorAvatar;
