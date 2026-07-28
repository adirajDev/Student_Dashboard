import { SlidersHorizontal } from 'lucide-react';
import SearchBar from './SearchBar';
import ExamFiltersDropdown from './ExamFiltersDropdown';
import useClickOutside from '../../../hooks/useClickOutside';

const ExamGlobalSearch = ({ query, setQuery, filters, setFilters }) => {
    const { ref: filterRef, isOpen: showFilters, setIsOpen: setShowFilters } = useClickOutside(false);

    return (
        <div className="relative w-full max-w-2xl mx-4 flex flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
                <SearchBar
                    value={query}
                    onChange={setQuery}
                    onClear={() => setQuery('')}
                    placeholder="Search exams by name..."
                    className="relative w-full"
                />
            </div>

            <div className="relative" ref={filterRef}>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`h-[50px] px-4 sm:px-6 rounded-full font-medium flex items-center justify-center gap-2 transition-all border shrink-0 ${
                        showFilters || filters.status !== 'all' || filters.mode !== 'all'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md hover:bg-indigo-700'
                            : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-slate-50'
                    }`}
                >
                    <SlidersHorizontal className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Filters</span>
                    {(filters.status !== 'all' || filters.mode !== 'all') && (
                        <span className="w-2 h-2 rounded-full bg-white ml-1 sm:ml-0"></span>
                    )}
                </button>

                {showFilters && (
                    <ExamFiltersDropdown 
                        filters={filters} 
                        setFilters={setFilters} 
                        onClose={() => setShowFilters(false)} 
                    />
                )}
            </div>
        </div>
    );
};

export default ExamGlobalSearch;
