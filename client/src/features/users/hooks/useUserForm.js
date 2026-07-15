import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useUserForm = (editingUser) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        college: '',
        customCollege: '',
        phone: ''
    });
    
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collegeRes, courseRes] = await Promise.all([
                    apiClient.get('/data/colleges'),
                    apiClient.get('/data/courses')
                ]);
                setColleges(collegeRes.data);
                setCourses(courseRes.data);
            } catch (err) {
                console.error("Failed to fetch colleges/courses", err);
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
                phone: editingUser.phone || ''
            });
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { id, name, value } = e.target;
        const key = id || name; // Support both id and name attributes
        setFormData((prev) => ({
            ...prev,
            [key]: value
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
        courses
    };
};

export default useUserForm;
