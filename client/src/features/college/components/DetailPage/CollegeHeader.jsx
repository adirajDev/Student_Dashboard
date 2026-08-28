import {
    MapPin,
    Building2,
    Image as ImageIcon,
    Send,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '@/services/apiClient.js';
import useApplyToCollege from '../../hooks/useApplyToCollege.js';
import { formatLocation } from '@/constants/states.js';

const CollegeHeader = ({ college, onOpenGallery, user }) => {
    const hasCoverImage = college.images && college.images.length > 0;
    const coverImageUrl = hasCoverImage
        ? `${apiClient.defaults.baseURL}/college-gallery/${college._id}/gallery/images/${college.images[0]._id}`
        : null;
    const mediaCount =
        (college.images?.length || 0) + (college.videos?.length || 0);

    const {
        status,
        isApplying,
        error: applyError,
        apply,
    } = useApplyToCollege(college._id, user);

    return (
        <div className="card mb-8 p-0 overflow-hidden">
            {/* Banner Section */}
            <div
                className={`relative w-full h-40 sm:h-48 md:h-56 ${!hasCoverImage ? 'bg-gradient-to-r from-[var(--color-ink-50)] to-[var(--color-ink-100)]' : 'bg-slate-200'}`}
            >
                {hasCoverImage && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${coverImageUrl})` }}
                    />
                )}

                {mediaCount > 0 && (
                    <button
                        onClick={onOpenGallery}
                        className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-colors"
                    >
                        <ImageIcon className="w-4 h-4" />
                        {mediaCount} {mediaCount === 1 ? 'Media' : 'Photos'}
                    </button>
                )}
            </div>

            {/* Content Section */}
            <div className="px-6 pb-8 sm:px-8">
                <div className="flex flex-col sm:flex-row gap-6 items-start relative">
                    {/* Logo (Overlapping Banner) */}
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

                    {/* Details */}
                    <div
                        className={`flex-1 ${!college.logo ? 'pt-6' : 'pt-4 sm:pt-4'}`}
                    >
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-2xl sm:text-3xl text-[var(--foreground)] font-display leading-tight">
                                {college.name}
                            </h1>
                            {college.type && (
                                <span className="hidden sm:inline-block px-3 py-1 bg-[var(--color-amber-50)] text-[var(--color-amber-700)] text-xs font-bold uppercase tracking-wider rounded-full border border-[var(--color-amber-200)]">
                                    {college.type}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[var(--muted)] mb-4 text-sm font-medium">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-[var(--color-ink-400)]" />
                                <span>{formatLocation(college)}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-[var(--color-ink-400)]" />
                                <span>
                                    ID:{' '}
                                    {college.collegeId ||
                                        college._id.substring(0, 8)}
                                </span>
                            </div>
                        </div>

                        {college.description && (
                            <div className="prose max-w-none text-[var(--muted)] text-sm sm:text-base leading-relaxed mb-4">
                                <p>{college.description}</p>
                            </div>
                        )}

                        {/* Apply Button */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {status === 'applied' ? (
                                <div className="flex items-center gap-3">
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
                                </div>
                            ) : (
                                <button
                                    onClick={apply}
                                    disabled={isApplying}
                                    className="btn-primary"
                                >
                                    {isApplying ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {isApplying ? 'Applying...' : 'Apply Now'}
                                </button>
                            )}
                            {applyError && (
                                <p className="text-sm text-red-600 font-medium">
                                    {applyError}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;
