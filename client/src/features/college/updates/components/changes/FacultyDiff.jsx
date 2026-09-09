// Faculty rows have no stable id, so identity is the name/department/role triple.

const facKey = f =>
    `${f?.name || ''}|${f?.department || ''}|${f?.role || ''}`.toLowerCase();

export const buildFacultyDiff = (current = [], proposed = []) => {
    const cur = current || [];
    const prop = proposed || [];
    const curKeys = new Set(cur.map(facKey));
    const propKeys = new Set(prop.map(facKey));
    return {
        removed: cur.filter(f => !propKeys.has(facKey(f))),
        added: prop.filter(f => !curKeys.has(facKey(f))),
        kept: prop.filter(f => curKeys.has(facKey(f))),
    };
};

const FacultyRow = ({ fac, tone }) => {
    const tones = {
        added: 'bg-green-50 border-green-200',
        removed: 'bg-red-50 border-red-200 line-through opacity-70',
        kept: 'bg-slate-50 border-slate-200',
    };
    return (
        <div
            className={`p-3 rounded-xl border flex items-start gap-3 ${tones[tone]}`}
        >
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                {fac.name?.charAt(0) || '?'}
            </div>
            <div>
                <p className="font-medium text-sm">{fac.name}</p>
                <p className="text-xs text-[var(--ring)]">
                    {[fac.role, fac.department].filter(Boolean).join(' • ') ||
                        '—'}
                </p>
            </div>
        </div>
    );
};

export const FacultyDiff = ({ removed, added, kept }) => (
    <div className="space-y-3 mt-2">
        {added.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase mb-1.5">
                    Added
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {added.map((f, i) => (
                        <FacultyRow key={`fa-${i}`} fac={f} tone="added" />
                    ))}
                </div>
            </div>
        )}
        {removed.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-red-700 uppercase mb-1.5">
                    Removed
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {removed.map((f, i) => (
                        <FacultyRow key={`fr-${i}`} fac={f} tone="removed" />
                    ))}
                </div>
            </div>
        )}
        {kept.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-[var(--ring)] uppercase mb-1.5">
                    Unchanged ({kept.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {kept.map((f, i) => (
                        <FacultyRow key={`fk-${i}`} fac={f} tone="kept" />
                    ))}
                </div>
            </div>
        )}
    </div>
);
