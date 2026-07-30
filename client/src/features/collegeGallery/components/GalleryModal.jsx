import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Video } from 'lucide-react';
import apiClient from '../../../services/apiClient';

const GalleryModal = ({ isOpen, onClose, collegeId, images, videos }) => {
    const [selectedMedia, setSelectedMedia] = useState(null);

    // Initialize with first item when opened
    useEffect(() => {
        if (isOpen && !selectedMedia) {
            if (images && images.length > 0) {
                setSelectedMedia({ ...images[0], type: 'image', index: 0 });
            } else if (videos && videos.length > 0) {
                setSelectedMedia({ ...videos[0], type: 'video', index: 0 });
            }
        }
    }, [isOpen, images, videos, selectedMedia]);

    if (!isOpen) return null;

    const allMedia = [
        ...(images || []).map((img, idx) => ({ ...img, type: 'image', index: idx })),
        ...(videos || []).map((vid, idx) => ({ ...vid, type: 'video', index: (images?.length || 0) + idx }))
    ];

    const modalContent = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white animate-in fade-in duration-300">
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors z-50"
            >
                <X className="w-8 h-8" />
            </button>

            {allMedia.length === 0 ? (
                <div className="text-slate-500 text-xl">No gallery media available.</div>
            ) : (
                <div className="w-full h-full flex flex-col md:flex-row p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
                    {/* Left Side: Scrollable Thumbnails */}
                    <div className="w-full md:w-48 lg:w-64 flex-shrink-0 flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0 hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
                        {allMedia.map((media) => {
                            const isSelected = selectedMedia?.index === media.index;
                            
                            return (
                                <button
                                    key={media._id}
                                    onClick={() => setSelectedMedia(media)}
                                    className={`relative flex-shrink-0 w-24 md:w-full aspect-video md:aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                        isSelected ? 'border-blue-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-[0.98]'
                                    }`}
                                >
                                    {media.type === 'image' ? (
                                        <img 
                                            src={`${apiClient.defaults.baseURL}/college-gallery/${collegeId}/gallery/images/${media._id}`}
                                            alt="Thumbnail"
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <Video className="w-8 h-8 text-slate-400" />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Side: Main Viewer */}
                    <div className="flex-1 flex items-center justify-center relative rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                        {selectedMedia?.type === 'image' ? (
                            <img 
                                src={`${apiClient.defaults.baseURL}/college-gallery/${collegeId}/gallery/images/${selectedMedia._id}`}
                                key={selectedMedia._id} // force re-render for animation
                                alt="Main Gallery View"
                                className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-300"
                            />
                        ) : selectedMedia?.type === 'video' ? (
                            <iframe 
                                key={selectedMedia._id} // force re-render for animation
                                src={selectedMedia.url.replace('watch?v=', 'embed/')} 
                                className="w-full h-full max-w-5xl aspect-video rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-300"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : null}
                    </div>
                </div>
            )}
            
            {/* Inject small style to hide scrollbar for webkit (Chrome/Safari) */}
            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default GalleryModal;
