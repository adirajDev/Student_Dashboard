import { useNavigate } from 'react-router-dom';

const POPULAR_SEARCHES = [
    'Computer Science',
    'Engineering',
    'Medical',
    'Business Administration',
    'Arts & Humanities',
    'Delhi',
    'Mumbai',
];

const PopularSearches = () => {
    const navigate = useNavigate();

    return (
        <div className="mt-8">
            <h2 className="text-2xl mb-6 text-[var(--foreground)]">
                Popular Searches
            </h2>
            <div className="flex flex-wrap gap-3">
                {POPULAR_SEARCHES.map((term, i) => (
                    <button
                        key={i}
                        onClick={() =>
                            navigate(`/search?q=${encodeURIComponent(term)}`)
                        }
                        className="px-5 py-3 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2"
                    >
                        {term}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PopularSearches;
