import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useUserForm = editingUser => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        college: '',
        customCollege: '',
        phone: '',
    });

    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collegeRes, courseRes] = await Promise.all([
                    apiClient.get('/colleges?limit=1000'),
                    apiClient.get('/courses?limit=1000'),
                ]);
                setColleges(collegeRes.data.data || collegeRes.data);
                setCourses(courseRes.data.data || courseRes.data);
            } catch (err) {
                console.error('Failed to fetch colleges/courses', err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                course: editingUser.course?._id || editingUser.course || '',
                college: editingUser.college?._id || editingUser.college || '',
                customCollege: '',
                phone: editingUser.phone || '',
            });
        }
    }, [editingUser]);

    // Effect to handle resetting course when college changes
    useEffect(() => {
        if (colleges.length > 0 && courses.length > 0) {
            if (formData.college && formData.college !== 'others') {
                const selectedCollege = colleges.find(
                    c => c._id === formData.college
                );
                if (selectedCollege) {
                    const availableCourses = courses.filter(c =>
                        selectedCollege.availableCourses?.some(
                            ac => (ac._id || ac) === c._id
                        )
                    );
                    const isCurrentCourseValid = availableCourses.some(
                        c => c._id === formData.course
                    );
                    if (!isCurrentCourseValid) {
                        setFormData(prev => ({
                            ...prev,
                            course:
                                availableCourses.length > 0
                                    ? availableCourses[0]._id
                                    : '',
                        }));
                    }
                }
            } else if (formData.college === 'others') {
                const isCurrentCourseValid = courses.some(
                    c => c._id === formData.course
                );
                if (!isCurrentCourseValid) {
                    setFormData(prev => ({
                        ...prev,
                        course: courses.length > 0 ? courses[0]._id : '',
                    }));
                }
            }
        }
    }, [formData.college, colleges, courses]);

    const handleChange = e => {
        const { id, name, value } = e.target;
        const key = id || name; // Support both id and name attributes
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e, onAdd, onUpdate, showCourse) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            setValidationError('Name, email, and phone number are required.');
            return;
        }

        if (showCourse && (!formData.course || !formData.college)) {
            setValidationError('Course and College are required for students.');
            return;
        }

        try {
            const submitData = { ...formData };
            if (submitData.college === 'others') {
                submitData.college = submitData.customCollege;
                if (!submitData.customCollege?.trim()) {
                    setValidationError('Please enter the custom college name.');
                    return;
                }
            }

            if (editingUser) {
                const id = editingUser.id || editingUser._id;
                await onUpdate(id, submitData);
            } else {
                await onAdd(submitData);
            }
        } catch (err) {
            setValidationError(err.response?.data?.error || 'Operation failed');
            throw err;
        }
    };

    return {
        formData,
        validationError,
        handleChange,
        handleSubmit,
        colleges,
        courses,
    };
};

export default useUserForm;
