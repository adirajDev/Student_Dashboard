import { useEffect, useState } from 'react';
import Loading from '@/components/common/Loading';
import GalleryFilmstrip from '@/features/collegeGallery/components/GalleryFilmstrip';
import GalleryViewer from '@/features/collegeGallery/components/GalleryViewer';
import useCollegeGallery from '@/features/collegeGallery/hooks/useCollegeGallery';

/**
 * Filmstrip on top, selected item shown large below it. The old GalleryModal
 * lightbox is gone — nothing else imported it, so that file can be deleted.
 *
 * Media comes from its own endpoint rather than the college payload, which
 * now carries only the cover image.
 */
const GalleryTab = ({ college }) => {
    const { media, isLoading, error } = useCollegeGallery(college._id);
    const [activeIndex, setActiveIndex] = useState(0);

    const total = media.length;

    // A shorter list after a delete could leave the index out of range.
    useEffect(() => {
        if (activeIndex > total - 1) setActiveIndex(0);
    }, [total, activeIndex]);

    const goPrev = () => setActiveIndex(i => (i - 1 + total) % total);
    const goNext = () => setActiveIndex(i => (i + 1) % total);

    useEffect(() => {
        if (total < 2) return;

        const onKeyDown = event => {
            // Don't hijack arrows while the user is typing somewhere.
            const tag = document.activeElement?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT')
                return;

            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                goPrev();
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                goNext();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [total]);

    if (isLoading)
        return <Loading inline message="Loading images and videos..." />;

    if (error) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                {error}
            </div>
        );
    }

    if (total === 0) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                No photos or videos have been uploaded yet.
            </div>
        );
    }

    const photoCount = media.filter(item => item.type === 'image').length;
    const videoCount = total - photoCount;

    return (
        <div className="space-y-4">
            <p className="text-sm text-[var(--muted)] font-medium">
                {photoCount} photo{photoCount === 1 ? '' : 's'}
                {videoCount > 0 &&
                    ` · ${videoCount} video${videoCount === 1 ? '' : 's'}`}
            </p>

            <GalleryFilmstrip
                media={media}
                activeIndex={activeIndex}
                onSelect={setActiveIndex}
            />

            <GalleryViewer
                item={media[activeIndex]}
                index={activeIndex}
                total={total}
                onPrev={goPrev}
                onNext={goNext}
            />
        </div>
    );
};

export default GalleryTab;
