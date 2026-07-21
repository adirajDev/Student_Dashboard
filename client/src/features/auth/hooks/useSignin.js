import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const useSignin = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [hasPassword, setHasPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({ password: '', confirmPassword: '' });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckUser = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiClient.post('/check-user', { email });
            setHasPassword(res.data.hasPassword);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'User not found');
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!hasPassword && passwordData.password !== passwordData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            let res;
            if (hasPassword) {
                res = await apiClient.post('/signin', { email, password: passwordData.password });
            } else {
                res = await apiClient.post('/set-password', { email, password: passwordData.password });
            }

            const user = res.data.user;
            const userRole = user.role; 
            
            if (userRole === 'college' && user.isFirstLogin) {
                navigate('/force-password-reset');
                return;
            }

            if (userRole === 'admin' || userRole === 'editor') {
                navigate('/admin/dashboard');
            } else if (userRole === 'college') {
                navigate('/college/dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || `Authentication failed due to: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        step,
        setStep,
        email,
        setEmail,
        hasPassword,
        passwordData,
        setPasswordData,
        error,
        loading,
        handleCheckUser,
        handleAuth
    };
};

export default useSignin;
