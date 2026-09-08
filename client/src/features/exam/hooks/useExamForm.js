import { useState, useEffect } from 'react';
import { serializeFaqs } from '@/components/common/FaqFields.jsx';
import { normaliseSlugInput, slugify } from '@/utils/slug.js';

const useExamForm = ({ editingExam, onAdd, onUpdate, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        requirement: '',
        regStartingDate: '',
        regEndingDate: '',
        examMode: 'Offline',
        examDescription: '',
        examLink: '',
        examDate: '',
        examTime: '',
        examDurationHours: '',
        examDurationMinutes: '',
        faqs: [],
    });
    const [slugTouched, setSlugTouched] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Format date for datetime-local input
    const formatDateForInput = dateString => {
        if (!dateString) return '';
        const d = new Date(dateString);
        // Needs to be in YYYY-MM-DD format for date inputs
        return d.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (editingExam) {
            setFormData({
                name: editingExam.name || '',
                slug: editingExam.slug || '',
                requirement: editingExam.requirement || '',
                regStartingDate: formatDateForInput(
                    editingExam.regStartingDate
                ),
                regEndingDate: formatDateForInput(editingExam.regEndingDate),
                examMode: editingExam.examMode || 'Offline',
                examDescription: editingExam.examDescription || '',
                examLink: editingExam.examLink || '',
                examDate: formatDateForInput(editingExam.examDate),
                examTime: editingExam.examTime || '',
                examDurationHours: editingExam.examDuration
                    ? Math.floor(editingExam.examDuration / 60)
                    : '',
                examDurationMinutes: editingExam.examDuration
                    ? editingExam.examDuration % 60
                    : '',
                faqs: (editingExam.faqs || []).map(f => ({
                    _id: f._id,
                    question: f.question || '',
                    answer: f.answer || '',
                })),
            });

            setSlugTouched(true);
        } else {
            setSlugTouched(false);
        }
    }, [editingExam]);

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const submissionData = {
                ...formData,
                slug: slugify(formData.slug || formData.name),
                examDuration:
                    (parseInt(formData.examDurationHours) || 0) * 60 +
                    (parseInt(formData.examDurationMinutes) || 0),
                faqs: serializeFaqs(formData.faqs),
            };

            // Clean up temporary UI state from payload
            delete submissionData.examDurationHours;
            delete submissionData.examDurationMinutes;

            let res;
            if (editingExam) {
                res = await onUpdate(editingExam._id, submissionData);
            } else {
                res = await onAdd(submissionData);
            }

            if (res.success) {
                onClose();
            } else {
                setError(res.error || 'Operation failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNameChange = e => {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: slugTouched ? prev.slug : slugify(name),
        }));
    };

    const handleSlugChange = e => {
        setSlugTouched(true);
        setFormData(prev => ({
            ...prev,
            slug: normaliseSlugInput(e.target.value),
        }));
    };

    const setFaqs = faqs => setFormData(prev => ({ ...prev, faqs }));

    return {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleNameChange,
        handleSlugChange,
        handleSubmit,
        setFaqs,
    };
};

export default useExamForm;
