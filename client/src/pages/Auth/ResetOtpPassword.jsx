import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import apiClient from '../../services/apiClient';

const ResetOtpPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [formData, setFormData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!email) {
            navigate('/signin');
        }
    }, [email, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.post('/reset-otp-password', {
                email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });
            
            // After successful password set, the backend logs them in and sets cookie
            // We can redirect them to the dashboard based on their role
            window.location.href = `/${res.data.user.role}-dashboard`;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
            <div className="w-full max-w-md animate-fade-in">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12 shadow-sm">
                        <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400 -rotate-12" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3 tracking-tight">Account Setup</h1>
                    <p className="text-[var(--ring)] text-lg">Enter your OTP and set a new password</p>
                </div>

                <div className="card">
                    {error && <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-2xl text-sm font-medium text-center">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)] px-1">One Time Password (OTP)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="input-field pl-12 uppercase tracking-widest font-mono"
                                    placeholder="XXXXXX"
                                    maxLength={6}
                                    value={formData.otp}
                                    onChange={(e) => setFormData({...formData, otp: e.target.value.toUpperCase()})}
                                />
                                <ShieldCheck className="w-5 h-5 text-[var(--ring)] absolute left-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)] px-1">New Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field pl-12 pr-12"
                                    placeholder="Create a strong password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                />
                                <Lock className="w-5 h-5 text-[var(--ring)] absolute left-4 top-1/2 -translate-y-1/2" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ring)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-[var(--foreground)] px-1">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="input-field pl-12"
                                    placeholder="Confirm your new password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                                <Lock className="w-5 h-5 text-[var(--ring)] absolute left-4 top-1/2 -translate-y-1/2" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3.5 text-base mt-4 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set Password & Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ResetOtpPassword;
