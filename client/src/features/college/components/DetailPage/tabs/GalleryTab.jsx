import { useState } from 'react';
import { Play, Video } from 'lucide-react';
import apiClient from '@/services/apiClient';
import GalleryModal from '@/features/collegeGallery/components/GalleryModal';

/**
 * Inline media grid. Clicking a thumbnail opens the existing GalleryModal
 * as a lightbox.
 *
 * `initialIndex` requires a small additive change to GalleryModal — see the
 * note in the summary. Without it the modal always opens on the first item;
 * the grid still works, it just ignores which tile was clicked.
 */
const GalleryTab = ({ college }) => {
    const [openIndex, setOpenIndex] = useState(null);

    const images = college.images || [];
    const videos = college.videos || [];

    const imageUrl = image =>
        `${apiClient.defaults.baseURL}/college-gallery/${college._id}/gallery/images/${image._id}`;

    const total = images.length + videos.length;

    if (total === 0) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                No photos or videos have been uploaded yet.
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <p className="text-sm text-[var(--muted)] font-medium">
                    {images.length} photo{images.length === 1 ? '' : 's'}
                    {videos.length > 0 &&
                        ` · ${videos.length} video${videos.length === 1 ? '' : 's'}`}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {images.map((image, idx) => (
                        <button
                            key={image._id}
                            type="button"
                            onClick={() => setOpenIndex(idx)}
                            className="group relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] bg-[var(--color-ink-50)]"
                        >
                            <img
                                src={imageUrl(image)}
                                alt={`${college.name} campus ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </button>
                    ))}

                    {videos.map((video, idx) => (
                        <button
                            key={video._id || `video-${idx}`}
                            type="button"
                            onClick={() => setOpenIndex(images.length + idx)}
                            className="group relative aspect-[4/3] rounded-[var(--radius-md)] overflow-hidden border border-[var(--border)] surface-wash flex items-center justify-center"
                        >
                            <Video className="w-8 h-8 text-[var(--muted)]" />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                                <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <GalleryModal
                key={openIndex}
                isOpen={openIndex !== null}
                onClose={() => setOpenIndex(null)}
                collegeId={college._id}
                images={images}
                videos={videos}
                initialIndex={openIndex ?? 0}
            />
        </>
    );
};

export default GalleryTab;
