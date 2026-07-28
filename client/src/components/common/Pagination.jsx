import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
    // Helper to generate page numbers to display
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5; // Show at most 5 page numbers

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Complex logic for ellipses can go here if needed,
            // but for simplicity, just show current, first, last, and neighbors.
            pages.push(1);
            if (currentPage > 3) pages.push('...');

            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                title="Previous Page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() =>
                            typeof page === 'number' && onPageChange(page)
                        }
                        disabled={
                            typeof page !== 'number' || page === currentPage
                        }
                        className={`
                            w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors
                            ${
                                page === currentPage
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : typeof page === 'number'
                                      ? 'hover:bg-slate-100 text-[var(--foreground)] border border-[var(--border)] bg-[var(--card)]'
                                      : 'text-[var(--ring)] cursor-default'
                            }
                        `}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                title="Next Page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
