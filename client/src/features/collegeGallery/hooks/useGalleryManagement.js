import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient';

const useGalleryManagement = user => {
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const collegeId =
        typeof user?.college === 'object' ? user.college._id : user?.college;

    useEffect(() => {
        if (!collegeId) {
            setLoading(false);
            setError('No college associated with this user.');
            return;
        }
        fetchGallery();
    }, [collegeId]);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(
                `/college-gallery/${collegeId}/gallery`
            );
            setImages(res.data.images || []);
            setVideos(res.data.videos || []);
            setError(null);
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to load gallery data'
            );
        } finally {
            setLoading(false);
        }
    };

    const uploadImages = async files => {
        if (!files || files.length === 0) return;

        try {
            setActionLoading(true);
            const formData = new FormData();
            Array.from(files).forEach(file => {
                formData.append('images', file);
            });

            const res = await apiClient.post(
                `/college-gallery/${collegeId}/gallery/images`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            // Update local state instead of refetching everything
            setImages(res.data.college.images);
        } catch (err) {
            throw new Error(
                err.response?.data?.message || 'Failed to upload images'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const deleteImage = async imageId => {
        try {
            setActionLoading(true);
            const res = await apiClient.delete(
                `/college-gallery/${collegeId}/gallery/images/${imageId}`
            );
            setImages(res.data.college.images);
        } catch (err) {
            throw new Error(
                err.response?.data?.message || 'Failed to delete image'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const addVideo = async url => {
        if (!url) return;
        try {
            setActionLoading(true);
            const res = await apiClient.post(
                `/college-gallery/${collegeId}/gallery/videos`,
                { url }
            );
            setVideos(res.data.college.videos);
        } catch (err) {
            throw new Error(
                err.response?.data?.message || 'Failed to add video'
            );
        } finally {
            setActionLoading(false);
        }
    };

    const deleteVideo = async videoId => {
        try {
            setActionLoading(true);
            const res = await apiClient.delete(
                `/college-gallery/${collegeId}/gallery/videos/${videoId}`
            );
            setVideos(res.data.college.videos);
        } catch (err) {
            throw new Error(
                err.response?.data?.message || 'Failed to delete video'
            );
        } finally {
            setActionLoading(false);
        }
    };

    return {
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
    };
};

export default useGalleryManagement;
