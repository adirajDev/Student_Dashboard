import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * The large panel below the filmstrip. Renders an <img> for photos and an
 * embedded iframe for videos, with wrap-around prev/next controls.
 */
const GalleryViewer = ({ item, index, total, onPrev, onNext }) => {
    if (!item) return null;

    const showControls = total > 1;

    return (
        <div className="relative rounded-[var(--radius-lg)] overflow-hidden border border-[var(--border)] bg-[var(--color-ink-50)]">
            <div className="aspect-video w-full flex items-center justify-center">
                {item.type === 'image' ? (
                    <img
                        key={item.key}
                        src={item.src}
                        alt={item.label}
                        className="max-w-full max-h-full object-contain animate-fade-in"
                    />
                ) : (
                    <iframe
                        key={item.key}
                        src={item.src}
                        title={item.label}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}
            </div>

            {showControls && (
                <>
                    <button
                        type="button"
                        onClick={onPrev}
                        aria-label="Previous item"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--card)]/90 border border-[var(--border)] shadow-sm text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onClick={onNext}
                        aria-label="Next item"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[var(--card)]/90 border border-[var(--border)] shadow-sm text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-xs font-medium backdrop-blur-sm">
                        {index + 1} / {total}
                    </span>
                </>
            )}
        </div>
    );
};

export default GalleryViewer;
