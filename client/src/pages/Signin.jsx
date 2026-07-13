import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Loader2 } from 'lucide-react';

const Signin = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [step, setStep] = useState(1); // 1: Email, 2: Password or Set Password
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
            if (hasPassword) {
                // Login normally
                await apiClient.post('/signin', { email, password: passwordData.password });
            } else {
                // Set password for first time user
                await apiClient.post('/set-password', { email, password: passwordData.password });
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative animate-fade-in bg-gradient-to-tr from-blue-100 to-[var(--primary-50)] dark:from-slate-800 dark:to-slate-900">
            <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card)] shadow-md hover:scale-110 transition-transform">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            
            <div className="card w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-[var(--primary-600)] dark:text-[var(--primary-400)]">Welcome Back</h1>
                
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center animate-fade-in">{error}</div>}
                
                {step === 1 ? (
                    <form onSubmit={handleCheckUser} className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="john@example.com" />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center">
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Continue'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAuth} className="space-y-4 animate-fade-in">
                        <div className="flex items-center justify-between mb-4 text-sm text-[var(--ring)] bg-slate-100 dark:bg-slate-800 p-2 rounded">
                            <span>{email}</span>
                            <button type="button" onClick={() => setStep(1)} className="text-blue-500 hover:underline">Change</button>
                        </div>
                        
                        {!hasPassword && (
                            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm">
                                It looks like this is your first time signing in. Please set a password to continue.
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1">{hasPassword ? 'Password' : 'New Password'}</label>
                            <input type="password" required value={passwordData.password} onChange={(e) => setPasswordData({...passwordData, password: e.target.value})} className="input-field" placeholder="••••••••" />
                        </div>
                        
                        {!hasPassword && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <input type="password" required value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="input-field" placeholder="••••••••" />
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center">
                            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : (hasPassword ? 'Sign In' : 'Set Password & Sign In')}
                        </button>
                    </form>
                )}
                
                <p className="mt-6 text-center text-sm text-[var(--ring)]">
                    Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Signin;
