import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { Loader2 } from 'lucide-react';

const ForcePasswordReset = () => {
    const { user } = useOutletContext();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            await apiClient.post('/auth/reset-initial-password', { newPassword: password });
            
            // On success, force reload to get updated context with isFirstLogin: false
            window.location.href = '/college/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 card text-center">
            <h2 className="text-3xl mb-4 text-[var(--primary-600)] dark:text-[var(--primary-400)]">Welcome!</h2>
            <p className="text-[var(--ring)] mb-6 text-sm">
                Since this is your first time logging in as a College Administrator, you must reset your password to securely access your dashboard.
            </p>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-2xl text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input 
                        type="password" 
                        required 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="input-field" 
                        placeholder="••••••••" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input 
                        type="password" 
                        required 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        className="input-field" 
                        placeholder="••••••••" 
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center mt-6">
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Set Password & Continue'}
                </button>
            </form>
        </div>
    );
};

export default ForcePasswordReset;
