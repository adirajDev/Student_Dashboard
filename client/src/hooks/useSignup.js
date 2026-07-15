import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const useSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: 'BTech'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiClient.post('/signup', formData);
            navigate('/signin');
        } catch (err) {
            setError(err.response?.data?.message || `Failed to sign up due to: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, error, loading };
};

export default useSignup;
