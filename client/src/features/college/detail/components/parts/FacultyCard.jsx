const FacultyCard = ({ member }) => (
    <div className="p-4 bg-[var(--card)] rounded-[var(--radius-md)] border border-[var(--border)] flex items-start gap-4 transition-colors hover:bg-[var(--color-ink-50)]">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[var(--radius-sm)] bg-[var(--color-amber-100)] flex items-center justify-center text-lg font-display text-[var(--color-amber-600)] shrink-0">
            {member.name?.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
            <h4 className="text-[var(--foreground)] font-semibold truncate">
                {member.name}
            </h4>
            {member.department && (
                <p className="text-sm text-[var(--muted)] font-medium truncate">
                    {member.department}
                </p>
            )}
            {member.role && (
                <p className="text-xs font-semibold text-[var(--color-ink-400)] mt-1 uppercase tracking-wider truncate">
                    {member.role}
                </p>
            )}
        </div>
    </div>
);

export default FacultyCard;
