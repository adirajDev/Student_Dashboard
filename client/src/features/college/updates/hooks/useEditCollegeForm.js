import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient.js';
import useCollegeUpdates from './useCollegeUpdates.js';

const useEditCollegeForm = user => {
    const {
        submitUpdate,
        loading: submitting,
        error: submitError,
    } = useCollegeUpdates();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        type: 'Private',
        city: '',
        state: '',
        collegeId: '',
        logo: '',
        overview: '',
        description: '',
        placementDetails: {
            averagePackage: '',
            highestPackage: '',
            placementPercentage: '',
        },
        recruiters: [],
        faculty: [],
        faqs: [],
    });

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const collegeId =
                    typeof user.college === 'object'
                        ? user.college._id
                        : user.college;
                if (!collegeId) {
                    setError('No college assigned to this user.');
                    return;
                }
                const res = await apiClient.get(`/colleges/${collegeId}`);
                const data = res.data;
                setCollege(data);

                // Pre-fill form
                setFormData({
                    name: data.name || '',
                    type: data.type || 'Private',
                    city: data.city || '',
                    state: data.state || '',
                    collegeId: data.collegeId || '',
                    logo: data.logo || '',
                    overview: data.overview || '',
                    description: data.description || '',
                    placementDetails: data.placementDetails || {
                        averagePackage: '',
                        highestPackage: '',
                        placementPercentage: '',
                    },
                    recruiters: data.recruiters || [],
                    faculty: data.faculty || [],
                    faqs: (data.faqs || []).map(f => ({
                        _id: f._id,
                        question: f.question || '',
                        answer: f.answer || '',
                    })),
                });
            } catch (err) {
                setError('Failed to load college data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [user.college]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlacementChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            placementDetails: { ...prev.placementDetails, [name]: value },
        }));
    };

    // Recruiter handlers
    const addRecruiter = () =>
        setFormData(prev => ({
            ...prev,
            recruiters: [...prev.recruiters, ''],
        }));
    const updateRecruiter = (index, value) => {
        const updated = [...formData.recruiters];
        updated[index] = value;
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };
    const removeRecruiter = index => {
        const updated = formData.recruiters.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };

    // Faculty handlers
    const addFaculty = () =>
        setFormData(prev => ({
            ...prev,
            faculty: [...prev.faculty, { name: '', department: '', role: '' }],
        }));
    const updateFaculty = (index, field, value) => {
        const updated = [...formData.faculty];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, faculty: updated }));
    };
    const removeFaculty = index => {
        const updated = formData.faculty.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, faculty: updated }));
    };

    // FAQ handlers. _key gives unsaved rows a stable React key.
    const setFaqs = faqs => setFormData(prev => ({ ...prev, faqs }));

    const buildFaqDelta = () => {
        const original = college?.faqs || [];

        const live = formData.faqs.filter(
            f => f.question.trim() !== '' && f.answer.trim() !== ''
        );

        const added = live
            .filter(f => !f._id)
            .map((f, i) => ({
                question: f.question.trim(),
                answer: f.answer.trim(),
                order: live.indexOf(f),
            }));

        const updated = live
            .filter(f => {
                if (!f._id) return false;
                const before = original.find(o => o._id === f._id);
                if (!before) return false;
                return (
                    before.question !== f.question.trim() ||
                    before.answer !== f.answer.trim()
                );
            })
            .map(f => ({
                _id: f._id,
                question: f.question.trim(),
                answer: f.answer.trim(),
            }));

        const liveIds = new Set(live.filter(f => f._id).map(f => f._id));
        const removed = original
            .filter(o => !liveIds.has(o._id))
            .map(o => o._id);

        if (!added.length && !updated.length && !removed.length) return null;

        return { added, updated, removed };
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSuccessMsg('');

        // Filter out empty recruiters/faculty
        const cleanData = {
            ...formData,
            recruiters: formData.recruiters.filter(r => r.trim() !== ''),
            faculty: formData.faculty.filter(f => f.name.trim() !== ''),
        };

        const faqDelta = buildFaqDelta();
        if (faqDelta) {
            cleanData.faqs = faqDelta;
        } else {
            // Omit entirely when unchanged — sending {} fails Joi's .min(1)
            delete cleanData.faqs;
        }

        try {
            await submitUpdate(cleanData);
            setSuccessMsg(
                'Update requested successfully! It is now pending admin approval.'
            );
        } catch (err) {
            // Error is handled by hook
        }
    };

    return {
        formData,
        loading,
        error,
        submitting,
        submitError,
        successMsg,
        handleInputChange,
        handlePlacementChange,
        addRecruiter,
        updateRecruiter,
        removeRecruiter,
        addFaculty,
        updateFaculty,
        removeFaculty,
        setFaqs,
        handleSubmit,
    };
};

export default useEditCollegeForm;
