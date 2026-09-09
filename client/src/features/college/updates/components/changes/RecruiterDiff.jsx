// Recruiters are a flat array of strings, so set difference is enough.

export const buildRecruiterDiff = (current = [], proposed = []) => {
    const cur = current || [];
    const prop = proposed || [];
    return {
        removed: cur.filter(r => !prop.includes(r)),
        added: prop.filter(r => !cur.includes(r)),
        kept: prop.filter(r => cur.includes(r)),
    };
};

export const RecruiterDiff = ({ removed, added, kept }) => (
    <div className="space-y-3 mt-2">
        {added.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase mb-1.5">
                    Added
                </p>
                <div className="flex flex-wrap gap-2">
                    {added.map((rec, i) => (
                        <span
                            key={`ra-${i}`}
                            className="px-3 py-1.5 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm font-medium"
                        >
                            {rec}
                        </span>
                    ))}
                </div>
            </div>
        )}
        {removed.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-red-700 uppercase mb-1.5">
                    Removed
                </p>
                <div className="flex flex-wrap gap-2">
                    {removed.map((rec, i) => (
                        <span
                            key={`rr-${i}`}
                            className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm font-medium line-through opacity-70"
                        >
                            {rec}
                        </span>
                    ))}
                </div>
            </div>
        )}
        {kept.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-[var(--ring)] uppercase mb-1.5">
                    Unchanged ({kept.length})
                </p>
                <div className="flex flex-wrap gap-2">
                    {kept.map((rec, i) => (
                        <span
                            key={`rk-${i}`}
                            className="px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs"
                        >
                            {rec}
                        </span>
                    ))}
                </div>
            </div>
        )}
    </div>
);
