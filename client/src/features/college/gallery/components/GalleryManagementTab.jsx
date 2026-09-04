import { useState, useRef } from 'react';
import {
    Image as ImageIcon,
    Video,
    Trash2,
    Plus,
    Upload,
    X,
} from 'lucide-react';
import useGalleryManagement from '../hooks/useGalleryManagement.js';
import Loading from '@/components/common/Loading.jsx';
import apiClient from '@/services/apiClient.js';

const GalleryManagementTab = ({ user }) => {
    const {
        collegeId,
        images,
        videos,
        loading,
        error,
        actionLoading,
        uploadImages,
        deleteImage,
        addVideo,
        deleteVideo,
    } = useGalleryManagement(user);

    const [videoUrl, setVideoUrl] = useState('');
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const handleFileSelect = async e => {
        setUploadError('');
        const files = Array.from(e.target.files);

        if (files.length === 0) return;

        // Check for 2MB limit on frontend
        const oversized = files.find(f => f.size > 2 * 1024 * 1024);
        if (oversized) {
            setUploadError('One or more files exceed the 2MB limit.');
            return;
        }

        try {
            await uploadImages(files);
        } catch (err) {
            setUploadError(err.message);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleAddVideo = async e => {
        e.preventDefault();
        setUploadError('');
        if (!videoUrl) return;

        try {
            await addVideo(videoUrl);
            setVideoUrl('');
        } catch (err) {
            setUploadError(err.message);
        }
    };

    if (loading) return <Loading message="Loading gallery..." />;

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-700 rounded-2xl">
                {error}
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <ImageIcon className="w-6 h-6 text-blue-500" />
                    <h3 className="text-2xl">Manage Images</h3>
                </div>
                <p className="text-sm text-[var(--ring)] mb-6">
                    Upload images to showcase your college campus, events, and
                    facilities. Maximum file size is 2MB.
                </p>

                {uploadError && (
                    <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl flex items-center justify-between">
                        {uploadError}
                        <button onClick={() => setUploadError('')}>
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {images.map(img => (
                        <div
                            key={img._id}
                            className="relative group rounded-xl overflow-hidden aspect-square border border-[var(--border)]"
                        >
                            <img
                                src={`${apiClient.defaults.baseURL}/college-gallery/${collegeId}/gallery/images/${img._id}`}
                                alt="Gallery item"
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => deleteImage(img._id)}
                                    disabled={actionLoading}
                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <label className="border-2 border-dashed border-[var(--border)] rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/5 transition-colors group">
                        <Upload className="w-8 h-8 text-[var(--ring)] group-hover:text-blue-500 mb-2 transition-colors" />
                        <span className="text-sm text-[var(--ring)] group-hover:text-blue-500 font-medium">
                            Upload Images
                        </span>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            disabled={actionLoading}
                        />
                    </label>
                </div>
            </div>

            <div className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <Video className="w-6 h-6 text-red-500" />
                    <h3 className="text-2xl">Manage Videos</h3>
                </div>
                <p className="text-sm text-[var(--ring)] mb-6">
                    Add YouTube or Vimeo URLs to feature college tours and
                    promotional videos.
                </p>

                <form onSubmit={handleAddVideo} className="flex gap-4 mb-8">
                    <input
                        type="url"
                        placeholder="https://youtube.com/watch?v=..."
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        required
                        className="input-field flex-1"
                        disabled={actionLoading}
                    />
                    <button
                        type="submit"
                        disabled={actionLoading || !videoUrl}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Add Video
                    </button>
                </form>

                <div className="space-y-4">
                    {videos.map(vid => (
                        <div
                            key={vid._id}
                            className="flex items-center justify-between p-4 bg-[var(--background)] border border-[var(--border)] rounded-xl"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <Video className="w-5 h-5 text-[var(--ring)] flex-shrink-0" />
                                <a
                                    href={vid.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline truncate"
                                >
                                    {vid.url}
                                </a>
                            </div>
                            <button
                                onClick={() => deleteVideo(vid._id)}
                                disabled={actionLoading}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-4 flex-shrink-0 disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}

                    {videos.length === 0 && (
                        <div className="text-center py-8 text-[var(--ring)]">
                            No videos added yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GalleryManagementTab;
