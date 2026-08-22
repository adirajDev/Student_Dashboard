import AuthorAvatar from '@/features/blog/components/PostList/AuthorAvatar';

export const BloggerHeader = ({ blogger }) => (
    <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <AuthorAvatar
            src={blogger.avatar}
            initials={blogger.initials}
            name={blogger.name}
            size="lg"
        />

        <div className="min-w-0">
            <p className="stat-label">Blogger</p>
            <h1 className="mt-2 text-3xl md:text-4xl">{blogger.name}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[var(--muted)]">
                <span>
                    <span className="stat-figure--accent text-base">
                        {blogger.postCount}
                    </span>{' '}
                    {blogger.postCount === 1 ? 'post' : 'posts'} published
                </span>
                {blogger.memberSince && (
                    <span>Writing here since {blogger.memberSince}</span>
                )}
            </div>
        </div>
    </div>
);

export const BloggerAbout = ({ about }) =>
    about ? (
        <section className="card">
            <h2 className="text-lg">About</h2>
            <p className="mt-3 leading-relaxed text-[var(--color-ink-700)]">
                {about}
            </p>
        </section>
    ) : null;

export const SpecializationList = ({ specializations }) =>
    specializations.length ? (
        <section className="card">
            <h2 className="text-lg">Writes about</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
                {specializations.map(item => (
                    <li
                        key={item}
                        className="badge bg-[var(--color-ink-50)] text-[var(--color-ink-700)]"
                    >
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    ) : null;

export const AchievementList = ({ achievements }) =>
    achievements.length ? (
        <section className="card">
            <h2 className="text-lg">Recognition</h2>
            <ul className="mt-4 space-y-3">
                {achievements.map(item => (
                    <li
                        key={item}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--color-ink-700)]"
                    >
                        <span
                            aria-hidden="true"
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-amber-500)]"
                        />
                        {item}
                    </li>
                ))}
            </ul>
        </section>
    ) : null;

export const BloggerContact = ({ email }) =>
    email ? (
        <section className="card">
            <h2 className="text-lg">Get in touch</h2>
            <a
                href={`mailto:${email}`}
                className="btn-secondary mt-4 w-full sm:w-auto"
            >
                {email}
            </a>
        </section>
    ) : null;
