import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Loader2 } from 'lucide-react';
import useSignup from '../../features/auth/hooks/useSignup';

import SearchableSelect from '../../components/common/SearchableSelect';

const Signup = () => {
    const { theme, toggleTheme } = useTheme();
    const { formData, handleChange, handleSubmit, error, loading, colleges, courses } = useSignup();

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative animate-fade-in bg-gradient-to-br from-[var(--primary-50)] to-blue-100 dark:from-slate-900 dark:to-slate-800">
            <button onClick={toggleTheme} className="absolute top-4 right-4 p-2 rounded-full bg-[var(--card)] shadow-md hover:scale-110 transition-transform">
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            
            <div className="card w-full max-w-md">
                <h1 className="text-3xl text-center mb-6 text-[var(--primary-600)] dark:text-[var(--primary-400)]">Create Account</h1>
                
                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-2xl text-sm text-center">{error}</div>}
                
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
                        <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="input-field" placeholder="+1234567890" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">College</label>
                        <SearchableSelect 
                            name="college"
                            options={colleges}
                            value={formData.college}
                            onChange={handleChange}
                            placeholder="Search for a college..."
                        />
                    </div>

                    {formData.college === 'others' && (
                        <div className="animate-fade-in">
                            <label className="block text-sm font-medium mb-1 text-blue-600 dark:text-blue-400">College Name</label>
                            <input 
                                type="text" 
                                name="customCollege" 
                                required 
                                value={formData.customCollege} 
                                onChange={handleChange} 
                                className="input-field rounded-xl border-blue-300 dark:border-blue-700 focus:ring-blue-500" 
                                placeholder="Enter your college name" 
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Course</label>
                        <select 
                            name="course" 
                            required 
                            value={formData.course} 
                            onChange={handleChange} 
                            className="input-field disabled:opacity-50"
                            disabled={!formData.college}
                        >
                            <option value="" disabled>Select a course...</option>
                            {(() => {
                                let displayedCourses = courses;
                                if (formData.college && formData.college !== 'others') {
                                    const selectedCollegeData = colleges.find(c => c._id === formData.college);
                                    if (selectedCollegeData) {
                                        displayedCourses = courses.filter(c => selectedCollegeData.availableCourses?.includes(c._id));
                                    }
                                }
                                return displayedCourses.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ));
                            })()}
                        </select>
                    </div>
                    
                    <button type="submit" disabled={loading} className="btn-primary rounded-full w-full py-3 mt-4 text-lg flex justify-center items-center">
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
