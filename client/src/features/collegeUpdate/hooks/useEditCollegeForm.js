import { useState, useEffect } from 'react';
import apiClient from '../../../../services/apiClient';
import useCollegeUpdates from './useCollegeUpdates';

const useEditCollegeForm = (user) => {
    const { submitUpdate, loading: submitting, error: submitError } = useCollegeUpdates();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        overview: '',
        description: '',
        placementDetails: { averagePackage: '', highestPackage: '', placementPercentage: '' },
        recruiters: [],
        faculty: []
    });

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const collegeId = typeof user.college === 'object' ? user.college._id : user.college;
                if (!collegeId) {
                    setError('No college assigned to this user.');
                    return;
                }
                const res = await apiClient.get(`/colleges/get-college/${collegeId}`);
                const data = res.data;
                setCollege(data);
                
                // Pre-fill form
                setFormData({
                    name: data.name || '',
                    overview: data.overview || '',
                    description: data.description || '',
                    placementDetails: data.placementDetails || { averagePackage: '', highestPackage: '', placementPercentage: '' },
                    recruiters: data.recruiters || [],
                    faculty: data.faculty || []
                });
            } catch (err) {
                setError('Failed to load college data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [user.college]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlacementChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            placementDetails: { ...prev.placementDetails, [name]: value }
        }));
    };

    // Recruiter handlers
    const addRecruiter = () => setFormData(prev => ({ ...prev, recruiters: [...prev.recruiters, ''] }));
    const updateRecruiter = (index, value) => {
        const updated = [...formData.recruiters];
        updated[index] = value;
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };
    const removeRecruiter = (index) => {
        const updated = formData.recruiters.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };

    // Faculty handlers
    const addFaculty = () => setFormData(prev => ({ ...prev, faculty: [...prev.faculty, { name: '', department: '', role: '' }] }));
    const updateFaculty = (index, field, value) => {
        const updated = [...formData.faculty];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, faculty: updated }));
    };
    const removeFaculty = (index) => {
        const updated = formData.faculty.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, faculty: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        
        // Filter out empty recruiters/faculty
        const cleanData = {
            ...formData,
            recruiters: formData.recruiters.filter(r => r.trim() !== ''),
            faculty: formData.faculty.filter(f => f.name.trim() !== '')
        };

        try {
            await submitUpdate(cleanData);
            setSuccessMsg('Update requested successfully! It is now pending admin approval.');
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
        handleSubmit
    };
};

export default useEditCollegeForm;
