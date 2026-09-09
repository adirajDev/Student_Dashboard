import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient.js';
import useCollegeUpdates from './useCollegeUpdates.js';
import { normaliseSlugInput } from '@/utils/slug.js';

// Scalar fields the form owns. `slug` is handled separately because it is
// normalised on the way in.
const SCALAR_FIELDS = [
    'name',
    'type',
    'city',
    'state',
    'collegeId',
    'logo',
    'overview',
    'description',
];

const txt = v => (v === undefined || v === null ? '' : String(v).trim());

const normalisePlacement = p => ({
    averagePackage: txt(p?.averagePackage),
    highestPackage: txt(p?.highestPackage),
    placementPercentage:
        p?.placementPercentage === undefined || p?.placementPercentage === null
            ? ''
            : txt(p.placementPercentage),
});

const normaliseRecruiters = list =>
    (list || []).map(r => txt(r)).filter(Boolean);

const normaliseFaculty = list =>
    (list || [])
        .filter(f => txt(f?.name) !== '')
        .map(f => ({
            name: txt(f.name),
            department: txt(f.department),
            role: txt(f.role),
        }));

const sameJson = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const EMPTY_FORM = {
    name: '',
    slug: '',
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
};

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

    const [formData, setFormData] = useState(EMPTY_FORM);

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
                    slug: data.slug || '',
                    type: data.type || 'Private',
                    city: data.city || '',
                    state: data.state || '',
                    collegeId: data.collegeId || '',
                    logo: data.logo || '',
                    overview: data.overview || '',
                    description: data.description || '',
                    placementDetails: {
                        averagePackage:
                            data.placementDetails?.averagePackage ?? '',
                        highestPackage:
                            data.placementDetails?.highestPackage ?? '',
                        placementPercentage:
                            data.placementDetails?.placementPercentage ?? '',
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

    const handleSlugChange = e => {
        setFormData(prev => ({
            ...prev,
            slug: normaliseSlugInput(e.target.value),
        }));
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
            f => txt(f.question) !== '' && txt(f.answer) !== ''
        );

        const added = live
            .filter(f => !f._id)
            .map(f => ({
                question: txt(f.question),
                answer: txt(f.answer),
                order: live.indexOf(f),
            }));

        const updated = live
            .filter(f => {
                if (!f._id) return false;
                const before = original.find(
                    o => String(o._id) === String(f._id)
                );
                if (!before) return false;
                return (
                    txt(before.question) !== txt(f.question) ||
                    txt(before.answer) !== txt(f.answer)
                );
            })
            .map(f => ({
                _id: f._id,
                question: txt(f.question),
                answer: txt(f.answer),
            }));

        const liveIds = new Set(
            live.filter(f => f._id).map(f => String(f._id))
        );
        const removed = original
            .filter(o => !liveIds.has(String(o._id)))
            .map(o => o._id);

        if (!added.length && !updated.length && !removed.length) return null;

        return { added, updated, removed };
    };

    /**
     * Build the payload from the difference between the form and the loaded
     * college, not from the whole form.
     *
     * Posting every field regardless of whether it changed makes the request
     * unreviewable: the admin modal and the history tab can only hide the
     * untouched fields for as long as there is something to compare them
     * against, so an approved request ends up listing the entire record.
     * Sending a real delta means proposedChanges only ever holds actual edits.
     */
    const buildChangedFields = () => {
        const changed = {};
        if (!college) return changed;

        for (const key of SCALAR_FIELDS) {
            if (txt(formData[key]) !== txt(college[key])) {
                changed[key] = txt(formData[key]);
            }
        }

        const slug = txt(formData.slug);
        if (slug && slug !== txt(college.slug)) {
            changed.slug = slug;
        }

        const placement = normalisePlacement(formData.placementDetails);
        if (
            !sameJson(placement, normalisePlacement(college.placementDetails))
        ) {
            changed.placementDetails = placement;
        }

        const recruiters = normaliseRecruiters(formData.recruiters);
        if (!sameJson(recruiters, normaliseRecruiters(college.recruiters))) {
            changed.recruiters = recruiters;
        }

        const faculty = normaliseFaculty(formData.faculty);
        if (!sameJson(faculty, normaliseFaculty(college.faculty))) {
            changed.faculty = faculty;
        }

        const faqDelta = buildFaqDelta();
        if (faqDelta) changed.faqs = faqDelta;

        return changed;
    };

    const changedFields = buildChangedFields();
    const hasChanges = Object.keys(changedFields).length > 0;

    const handleSubmit = async e => {
        e.preventDefault();
        setSuccessMsg('');
        setError('');

        const payload = buildChangedFields();

        // Joi's .min(1) would reject an empty object with a 400, so catch it here
        // and say something useful instead.
        if (Object.keys(payload).length === 0) {
            setError('Nothing has changed, so there is nothing to submit.');
            return;
        }

        try {
            await submitUpdate(payload);
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
        hasChanges,
        changedFieldCount: Object.keys(changedFields).length,
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
        handleSlugChange,
        originalSlug: college?.slug || '',
    };
};

export default useEditCollegeForm;
