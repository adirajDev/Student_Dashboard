import { Search, X } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const GlobalSearch = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    // We maintain a local state for the input value to allow fast typing
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

    // Sync input value with URL when navigating
    useEffect(() => {
        if (location.pathname === '/search') {
            setInputValue(searchParams.get('q') || '');
        } else {
            setInputValue(''); // Clear if we navigate away
        }
    }, [location.pathname, searchParams]);

    const handleSearch = (val) => {
        setInputValue(val);
        
        if (val.trim()) {
            navigate(`/search?q=${encodeURIComponent(val)}`, { replace: location.pathname === '/search' });
        } else if (location.pathname === '/search') {
            navigate('/search', { replace: true });
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-4">
            <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-[var(--ring)] pointer-events-none" />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleSearch(e.target.value)}
                    onClick={() => {
                        if (location.pathname !== '/search') {
                            navigate('/search');
                        }
                    }}
                    placeholder="Search courses and colleges..."
                    className="w-full pl-11 pr-11 py-3 rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
                />
                {inputValue && (
                    <button 
                        onClick={() => handleSearch('')}
                        className="absolute right-4 p-1 rounded-full text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default GlobalSearch;
