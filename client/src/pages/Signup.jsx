import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Loader2 } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
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

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative animate-fade-in bg-gradient-to-br from-[var(--primary-50)] to-blue-100 dark:from-slate-900 dark:to-slate-800">
            <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card)] shadow-md hover:scale-110 transition-transform">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            
            <div className="card w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-6 text-[var(--primary-600)] dark:text-[var(--primary-400)]">Create Account</h1>
                
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input type="email" name="email" required value={formData.email} onChange={handleChange} className="input-field" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Phone Number</label>
                        <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="input-field" placeholder="+1234567890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Course</label>
                        <select name="course" required value={formData.course} onChange={handleChange} className="input-field">
                            {['BTech', 'BBA', 'Commerce', 'Management', 'Designing'].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary w-full flex justify-center items-center mt-6">
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
                    </button>
                </form>
                
                <p className="mt-6 text-center text-sm text-[var(--ring)]">
                    Already have an account? <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
