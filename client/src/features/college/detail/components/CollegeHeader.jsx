import {
    MapPin,
    Star,
    Image as ImageIcon,
    Send,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/apiClient.js';
import useApplyToCollege from '@/features/college/detail/hooks/useApplyToCollege.js';
import { formatLocation } from '@/constants/states.js';

/**
 * Masthead only — banner, logo, name, meta row, actions.
 *
 * The tab strip is deliberately NOT rendered here: this root div has
 * `overflow-hidden` (needed to clip the banner corners), which would kill
 * position:sticky on any descendant.
 */
const CollegeHeader = ({ college, onViewGallery, user, apply: applyState }) => {
    const { status, isApplying, error: applyError, apply } = applyState || {};
    const hasCoverImage = college.images && college.images.length > 0;
    const coverImageUrl = hasCoverImage
        ? `${apiClient.defaults.baseURL}/college-gallery/${college._id}/gallery/images/${college.images[0]._id}`
        : null;

    const imageCount = college.imageCount ?? college.images?.length ?? 0;
    const videoCount = college.videoCount ?? college.videos?.length ?? 0;
    const mediaCount = imageCount + videoCount;

    const hasRating = college.totalRatings > 0;

    return (
        <div className="card p-0 overflow-hidden rounded-b-none border-b-0">
            {/* Banner */}
            <div
                className={`relative w-full h-40 sm:h-48 md:h-56 ${
                    !hasCoverImage
                        ? 'bg-gradient-to-r from-[var(--color-ink-50)] to-[var(--color-ink-100)]'
                        : 'bg-slate-200'
                }`}
            >
                {hasCoverImage && (
                    <img
                        src={coverImageUrl}
                        alt={`${college.name} campus`}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
                {mediaCount > 0 && (
                    <button
                        type="button"
                        onClick={onViewGallery}
                        className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors"
                    >
                        <ImageIcon className="w-4 h-4" />
                        {videoCount > 0 &&
                            `${videoCount} Video${videoCount === 1 ? '' : 's'}, `}
                        {imageCount} Photo{imageCount === 1 ? '' : 's'}
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="px-6 pb-6 sm:px-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start relative">
                    {college.logo && (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-white p-2 shadow-md border border-slate-100 shrink-0 flex items-center justify-center overflow-hidden -mt-12 sm:-mt-16 relative z-10">
                            <img
                                src={college.logo}
                                alt={`${college.name} logo`}
                                className="w-full h-full object-contain"
                                onError={e => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}

                    <div
                        className={`flex-1 min-w-0 ${!college.logo ? 'pt-6' : 'pt-4'}`}
                    >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="min-w-0">
                                <h1 className="text-2xl sm:text-3xl text-[var(--foreground)] font-display leading-tight mb-2">
                                    {college.name}
                                </h1>

                                {/* Meta row */}
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--muted)] font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-[var(--color-ink-400)]" />
                                        {formatLocation(college)}
                                    </span>

                                    {hasRating && (
                                        <>
                                            <span className="text-[var(--border)]">
                                                |
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Star className="w-4 h-4 fill-[var(--color-amber-500)] text-[var(--color-amber-500)]" />
                                                <span className="text-[var(--foreground)] font-semibold">
                                                    {Number(
                                                        college.averageRating
                                                    ).toFixed(1)}
                                                </span>
                                                <span>/5</span>
                                                <span className="text-[var(--color-amber-600)]">
                                                    ({college.totalRatings}{' '}
                                                    Review
                                                    {college.totalRatings === 1
                                                        ? ''
                                                        : 's'}
                                                    )
                                                </span>
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Chips */}
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    {college.type && (
                                        <span className="px-3 py-1 rounded-[var(--radius-sm)] surface-wash border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                                            {college.type}
                                        </span>
                                    )}
                                    {college.collegeId && (
                                        <span className="px-3 py-1 rounded-[var(--radius-sm)] surface-wash border border-[var(--border)] text-xs font-semibold text-[var(--foreground)]">
                                            ID: {college.collegeId}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 flex-wrap shrink-0">
                                {status === 'applied' ? (
                                    <>
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 text-sm font-semibold cursor-default">
                                            <CheckCircle className="w-4 h-4" />
                                            Applied
                                        </div>
                                        <Link
                                            to="/applications"
                                            className="px-5 py-2.5 rounded-[var(--radius-md)] border border-[var(--border)] surface-wash text-[var(--foreground)] hover:bg-[var(--color-ink-50)] text-sm font-semibold transition-colors"
                                        >
                                            View Application
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={apply}
                                        disabled={isApplying}
                                        className="btn-primary"
                                    >
                                        {isApplying ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        {isApplying
                                            ? 'Applying...'
                                            : 'Apply Now'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {college.description && (
                            <p className="prose max-w-none text-[var(--muted)] text-sm sm:text-base leading-relaxed mt-4">
                                {college.description}
                            </p>
                        )}

                        {applyError && (
                            <p className="text-sm text-red-600 font-medium mt-3">
                                {applyError}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;
