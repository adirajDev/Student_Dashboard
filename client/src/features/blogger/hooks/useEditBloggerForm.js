import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../services/apiClient.js';

const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB — keep in sync with backend Joi schema
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

const EMPTY_FORM = {
    about: '',
    achievements: [],
    specializations: [],
    profileImage: null, // { data, mimeType, sizeBytes } | null
};

export const useEditBloggerForm = user => {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // ---- Fetch existing profile on mount ----
    useEffect(() => {
        if (!user?._id) {
            setError('User not found.');
            setLoading(false);
            return;
        }


        let cancelled = false;

        const fetchBlogger = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await apiClient.get(`/blogger/${user._id}`);
                const blogger = res.data.data;

                if (cancelled) return;
                setFormData({
                    about: blogger.about ?? '',
                    achievements: blogger.achievements ?? [],
                    specializations: blogger.specializations ?? [],
                    profileImage: blogger.profileImage ?? null,
                });
            } catch (err) {
                if (cancelled) return;
                setError(
                    err.response?.data?.message ??
                        'Failed to load your profile. Please try again.'
                );
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchBlogger();
        return () => {
            cancelled = true;
        };
    }, [user?._id]);

    // ---- Simple field change (about, etc.) ----
    const handleInputChange = useCallback(e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // ---- Generic array field helpers (achievements / specializations) ----
    const addArrayItem = useCallback(field => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], ''],
        }));
    }, []);

    const updateArrayItem = useCallback((field, index, value) => {
        setFormData(prev => {
            const updated = [...prev[field]];
            updated[index] = value;
            return { ...prev, [field]: updated };
        });
    }, []);

    const removeArrayItem = useCallback((field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index),
        }));
    }, []);

    // ---- Profile image ----
    const handleImageChange = useCallback(file => {
        setSubmitError(null);

        if (!file) {
            setFormData(prev => ({ ...prev, profileImage: null }));
            return;
        }

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setSubmitError('Image must be JPEG, PNG, or WebP.');
            return;
        }

        if (file.size > MAX_IMAGE_BYTES) {
            setSubmitError('Image must be smaller than 1MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            // reader.result looks like "data:image/png;base64,iVBORw0..."
            const base64Data = reader.result.split(',')[1];
            setFormData(prev => ({
                ...prev,
                profileImage: {
                    data: base64Data,
                    mimeType: file.type,
                    sizeBytes: file.size,
                },
            }));
        };
        reader.onerror = () => {
            setSubmitError('Failed to read image file. Please try again.');
        };
        reader.readAsDataURL(file);
    }, []);

    const removeImage = useCallback(() => {
        setFormData(prev => ({ ...prev, profileImage: null }));
    }, []);

    // ---- Submit ----
    const handleSubmit = useCallback(
        async e => {
            e.preventDefault();
            setSubmitError(null);
            setSuccessMsg(null);

            // Strip empty strings from array fields before sending
            const payload = {
                about: formData.about,
                achievements: formData.achievements.filter(
                    a => a.trim() !== ''
                ),
                specializations: formData.specializations.filter(
                    s => s.trim() !== ''
                ),
                profileImage: formData.profileImage,
            };

            try {
                setSubmitting(true);
                const res = await apiClient.patch('/blogger/profile', payload);
                const updated = res.data.data;

                setFormData({
                    about: updated.about ?? '',
                    achievements: updated.achievements ?? [],
                    specializations: updated.specializations ?? [],
                    profileImage: updated.profileImage ?? null,
                });
                setSuccessMsg('Profile updated successfully.');
            } catch (err) {
                setSubmitError(
                    err.response?.data?.message ??
                        'Failed to update profile. Please try again.'
                );
            } finally {
                setSubmitting(false);
            }
        },
        [formData]
    );

    return {
        formData,
        loading,
        error,
        submitting,
        submitError,
        successMsg,
        handleInputChange,
        addArrayItem,
        updateArrayItem,
        removeArrayItem,
        handleImageChange,
        removeImage,
        handleSubmit,
    };
};
