import { MapPin, Building2, Image as ImageIcon } from 'lucide-react';
import apiClient from '../../../services/apiClient';

const CollegeHeader = ({ college, onOpenGallery }) => {
    const hasCoverImage = college.images && college.images.length > 0;
    const coverImageUrl = hasCoverImage ? `${apiClient.defaults.baseURL}/college-gallery/${college._id}/gallery/images/${college.images[0]._id}` : null;
    const mediaCount = (college.images?.length || 0) + (college.videos?.length || 0);

    return (
        <div className="card mb-8 p-0 overflow-hidden bg-white border border-slate-100 shadow-sm">
            {/* Banner Section */}
            <div 
                className={`relative w-full h-48 sm:h-64 md:h-72 ${!hasCoverImage ? 'bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100' : 'bg-slate-200'}`}
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
                    <div className={`flex-1 ${!college.logo ? 'pt-6' : 'pt-4 sm:pt-4'}`}>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl sm:text-3xl text-[var(--foreground)] font-bold leading-tight">
                                {college.name}
                            </h1>
                            {college.type && (
                                <span className="hidden sm:inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-100">
                                    {college.type}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-4 text-sm font-medium">
                            {college.location && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{college.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                <span>
                                    ID: {college.collegeId || college._id.substring(0, 8)}
                                </span>
                            </div>
                        </div>

                        {college.description && (
                            <div className="prose max-w-none text-slate-600 text-sm sm:text-base leading-relaxed">
                                <p>{college.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeHeader;
