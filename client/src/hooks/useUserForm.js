import { useState, useEffect } from 'react';

const useUserForm = (editingUser) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        course: '',
        phone: ''
    });
    
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        if (editingUser) {
            setFormData({
                name: editingUser.name || '',
                email: editingUser.email || '',
                course: editingUser.course || '',
                phone: editingUser.phone || ''
            });
        }
    }, [editingUser]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e, onAdd, onUpdate, showCourse) => {
        e.preventDefault();
        
        // Basic frontend validation
        if (!formData.name || !formData.email || !formData.phone) {
            setValidationError('Name, email, and phone number are required.');
            return;
        }

        if (showCourse && !formData.course) {
            setValidationError('Course is required for students.');
            return;
        }

        try {
            if (editingUser) {
                const id = editingUser.id || editingUser._id;
                await onUpdate(id, formData);
            } else {
                await onAdd(formData);
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
        handleSubmit
    };
};

export default useUserForm;
