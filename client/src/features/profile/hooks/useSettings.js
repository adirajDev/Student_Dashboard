import { useState } from 'react';
import apiClient from '../../../services/apiClient';

const useSettings = (user, onUpdate, onClose) => {
    const [formData, setFormData] = useState({
        email: user.email || '',
        currentPassword: '',
        newPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        
        if (formData.newPassword && !formData.currentPassword) {
            setError('Current password is required to set a new password');
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.put('/update-settings', formData);
            setSuccess('Settings updated successfully');
            onUpdate(res.data.user);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, error, success, loading };
};

export default useSettings;
