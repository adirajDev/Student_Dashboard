import { useEffect, useRef } from 'react';
import { Video } from 'lucide-react';

/**
 * Horizontal thumbnail row. Videos share the strip with photos — they get a
 * placeholder tile, and the viewer swaps to an iframe when one is selected.
 */
const GalleryFilmstrip = ({ media, activeIndex, onSelect }) => {
    const scrollerRef = useRef(null);

    // Keep the selected thumbnail in view when arrows or keys move the index.
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;
        const thumb = el.querySelector(`[data-index="${activeIndex}"]`);
        thumb?.scrollIntoView({
            behavior: 'smooth',
            inline: 'nearest',
            block: 'nearest',
        });
    }, [activeIndex]);

    if (!media || media.length === 0) return null;

    return (
        <div
            ref={scrollerRef}
            className="flex gap-3 overflow-x-auto pb-2 snap-x gallery-filmstrip"
            style={{ scrollbarWidth: 'none' }}
        >
            {media.map((item, index) => {
                const isActive = index === activeIndex;

                return (
                    <button
                        key={item.key}
                        type="button"
                        data-index={index}
                        onClick={() => onSelect(index)}
                        aria-label={item.label}
                        aria-current={isActive}
                        className={`relative shrink-0 snap-start w-28 sm:w-36 aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border-2 transition-all ${
                            isActive
                                ? 'border-[var(--color-amber-600)]'
                                : 'border-[var(--border)] opacity-70 hover:opacity-100'
                        }`}
                    >
                        {item.type === 'image' ? (
                            <img
                                src={item.src}
                                alt={item.label}
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="w-full h-full surface-wash flex items-center justify-center">
                                <Video className="w-6 h-6 text-[var(--muted)]" />
                            </span>
                        )}
                    </button>
                );
            })}

            <style
                dangerouslySetInnerHTML={{
                    __html: `.gallery-filmstrip::-webkit-scrollbar { display: none; }`,
                }}
            />
        </div>
    );
};

export default GalleryFilmstrip;
