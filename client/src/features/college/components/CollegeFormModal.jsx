import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';
import FormField from '../../../components/common/FormField';
import useCourseManagement from '../../courses/hooks/useCourseManagement';

const CollegeFormModal = ({ onAdd, onUpdate, editingCollege, onClose, title }) => {
    const { courses } = useCourseManagement(true);
    
    const [formData, setFormData] = useState({
        name: '',
        collegeId: '',
        location: '',
        description: '',
        availableCourses: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (editingCollege) {
            setFormData({
                name: editingCollege.name || '',
                collegeId: editingCollege.collegeId || '',
                location: editingCollege.location || '',
                description: editingCollege.description || '',
                availableCourses: editingCollege.availableCourses?.map(c => c._id) || []
            });
        }
    }, [editingCollege]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCourseToggle = (courseId) => {
        setFormData(prev => {
            const isSelected = prev.availableCourses.includes(courseId);
            if (isSelected) {
                return { ...prev, availableCourses: prev.availableCourses.filter(id => id !== courseId) };
            } else {
                return { ...prev, availableCourses: [...prev.availableCourses, courseId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let res;
        if (editingCollege) {
            res = await onUpdate(editingCollege._id, formData);
        } else {
            res = await onAdd(formData);
        }

        if (res?.success) {
            onClose();
        } else {
            setError(res?.error || 'Failed to save college');
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
                
                <div className="flex items-center justify-between p-6 border-b border-[var(--border)] shrink-0">
                    <h2 className="text-xl text-[var(--foreground)]">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[var(--ring)] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-900/30">
                            {error}
                        </div>
                    )}

                    <form id="college-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                label="College Name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Stanford University"
                            />
                            <FormField
                                label="College ID (Optional)"
                                id="collegeId"
                                value={formData.collegeId}
                                onChange={handleChange}
                                placeholder="e.g. STANFORD"
                                required={false}
                            />
                        </div>
                        
                        <FormField
                            label="Location"
                            id="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Stanford, California"
                        />
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Brief description about the college..."
                                rows={3}
                                className="input-field resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                                Available Courses
                            </label>
                            <div className="border border-[var(--border)] rounded-2xl p-4 max-h-48 overflow-y-auto bg-slate-50 dark:bg-slate-800/30">
                                {courses.length === 0 ? (
                                    <div className="text-sm text-[var(--ring)] text-center py-4">No courses available. Create courses first.</div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {courses.map(course => (
                                            <label key={course._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    checked={formData.availableCourses.includes(course._id)}
                                                    onChange={() => handleCourseToggle(course._id)}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-[var(--foreground)]">{course.name}</span>
                                                    <span className="text-xs text-[var(--ring)] capitalize">{course.level}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-[var(--border)] shrink-0 flex justify-end gap-3 bg-[var(--card)]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full border border-[var(--border)] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="college-form"
                        disabled={loading}
                        className="btn-primary px-8 py-2.5 flex items-center gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {editingCollege ? 'Save Changes' : 'Create College'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CollegeFormModal;
