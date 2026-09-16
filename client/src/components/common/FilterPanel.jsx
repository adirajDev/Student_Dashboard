import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Filter, X } from 'lucide-react';
import useMediaQuery from '@/hooks/useMediaQuery.js';

/**
 * Filter container for listing pages.
 * - lg and up: sticky sidebar with its own scrollbar.
 * - Below lg: a "Filters" button that opens a popup whose body scrolls.
 *
 * The popup is portalled to <body> because page wrappers use
 * animate-fade-in, whose leftover transform breaks position: fixed.
 */
const FilterPanel = ({
    title,
    activeCount = 0,
    onClear,
    resultLabel = 'Show results',
    children,
}) => {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isDesktop) setIsOpen(false);
    }, [isDesktop]);

    useEffect(() => {
        if (!isOpen) return;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = e => e.key === 'Escape' && setIsOpen(false);
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen]);

    const clearButton = activeCount > 0 && onClear && (
        <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-[var(--color-danger)] hover:underline"
        >
            Clear ({activeCount})
        </button>
    );

    if (isDesktop) {
        return (
            <div className="sticky top-[100px] max-h-[calc(100vh-120px)] overflow-y-auto overscroll-contain pr-2">
                <div className="sticky top-0 z-10 bg-[var(--background)] flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-4">
                    <Filter className="w-5 h-5 text-[var(--color-ink-600)]" />
                    <h3 className="text-lg text-[var(--foreground)] font-display flex-1">
                        {title}
                    </h3>
                    {clearButton}
                </div>
                {children}
            </div>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="btn-secondary w-full py-2.5"
            >
                <Filter className="w-4 h-4" />
                Filters
                {activeCount > 0 && (
                    <span className="min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-amber-500)] text-[var(--color-ink-950)] text-xs font-semibold flex items-center justify-center">
                        {activeCount}
                    </span>
                )}
            </button>

            {isOpen &&
                createPortal(
                    <div
                        className="modal-overlay z-[60] flex items-end sm:items-center justify-center sm:p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={title}
                            onClick={e => e.stopPropagation()}
                            className="w-full sm:max-w-md max-h-[85dvh] flex flex-col bg-[var(--card)] border border-[var(--border)] shadow-2xl rounded-t-[var(--radius-xl)] sm:rounded-[var(--radius-xl)]"
                        >
                            <div className="shrink-0 flex items-center gap-2 px-5 py-4 border-b border-[var(--border)]">
                                <Filter className="w-5 h-5 text-[var(--color-ink-600)]" />
                                <h3 className="text-lg text-[var(--foreground)] font-display flex-1">
                                    {title}
                                </h3>
                                {clearButton}
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close filters"
                                    className="p-1.5 -mr-1.5 rounded-full text-[var(--muted)] hover:bg-[var(--color-ink-50)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-4">
                                {children}
                            </div>

                            <div className="shrink-0 px-5 py-4 border-t border-[var(--border)]">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="btn-primary w-full"
                                >
                                    {resultLabel}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default FilterPanel;
