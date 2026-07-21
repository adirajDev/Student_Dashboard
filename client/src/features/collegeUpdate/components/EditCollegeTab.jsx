import { useState, useEffect } from 'react';
import { Building2, Save, Plus, Trash2 } from 'lucide-react';
import apiClient from '../../../services/apiClient';
import useCollegeUpdates from '../hooks/useCollegeUpdates';
import Loading from '../../../components/common/Loading';

const EditCollegeTab = ({ user }) => {
    const { submitUpdate, loading: submitting, error: submitError } = useCollegeUpdates();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        overview: '',
        description: '',
        placementDetails: { averagePackage: '', highestPackage: '', placementPercentage: '' },
        recruiters: [],
        faculty: []
    });

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const collegeId = typeof user.college === 'object' ? user.college._id : user.college;
                if (!collegeId) {
                    setError('No college assigned to this user.');
                    return;
                }
                const res = await apiClient.get(`/colleges/get-college/${collegeId}`);
                const data = res.data;
                setCollege(data);
                
                // Pre-fill form
                setFormData({
                    name: data.name || '',
                    overview: data.overview || '',
                    description: data.description || '',
                    placementDetails: data.placementDetails || { averagePackage: '', highestPackage: '', placementPercentage: '' },
                    recruiters: data.recruiters || [],
                    faculty: data.faculty || []
                });
            } catch (err) {
                setError('Failed to load college data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [user.college]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlacementChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            placementDetails: { ...prev.placementDetails, [name]: value }
        }));
    };

    // Recruiter handlers
    const addRecruiter = () => setFormData(prev => ({ ...prev, recruiters: [...prev.recruiters, ''] }));
    const updateRecruiter = (index, value) => {
        const updated = [...formData.recruiters];
        updated[index] = value;
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };
    const removeRecruiter = (index) => {
        const updated = formData.recruiters.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, recruiters: updated }));
    };

    // Faculty handlers
    const addFaculty = () => setFormData(prev => ({ ...prev, faculty: [...prev.faculty, { name: '', department: '', role: '' }] }));
    const updateFaculty = (index, field, value) => {
        const updated = [...formData.faculty];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, faculty: updated }));
    };
    const removeFaculty = (index) => {
        const updated = formData.faculty.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, faculty: updated }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMsg('');
        
        // Filter out empty recruiters/faculty
        const cleanData = {
            ...formData,
            recruiters: formData.recruiters.filter(r => r.trim() !== ''),
            faculty: formData.faculty.filter(f => f.name.trim() !== '')
        };

        try {
            await submitUpdate(cleanData);
            setSuccessMsg('Update requested successfully! It is now pending admin approval.');
        } catch (err) {
            // Error is handled by hook
        }
    };

    if (loading) return <Loading />;
    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-2xl">{error}</div>;

    return (
        <div className="animate-fade-in bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <Building2 className="w-6 h-6 text-blue-500" />
                <h3 className="text-2xl font-semibold">Edit College Details</h3>
            </div>
            
            <p className="text-sm text-[var(--ring)] mb-8">
                Changes made here will be submitted to the administration for review. Once approved, they will go live.
            </p>

            {submitError && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">{submitError}</div>}
            {successMsg && <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-xl">{successMsg}</div>}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <div className="space-y-4">
                    <h4 className="text-lg font-medium border-b border-[var(--border)] pb-2">Basic Information</h4>
                    <div>
                        <label className="block text-sm font-medium mb-1">College Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="input-field" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Overview / Description</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field min-h-[100px]" />
                    </div>
                </div>

                {/* Placements */}
                <div className="space-y-4">
                    <h4 className="text-lg font-medium border-b border-[var(--border)] pb-2">Placement Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Average Package</label>
                            <input type="text" name="averagePackage" value={formData.placementDetails.averagePackage} onChange={handlePlacementChange} className="input-field" placeholder="e.g. 8 LPA" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Highest Package</label>
                            <input type="text" name="highestPackage" value={formData.placementDetails.highestPackage} onChange={handlePlacementChange} className="input-field" placeholder="e.g. 42 LPA" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Placement %</label>
                            <input type="number" name="placementPercentage" value={formData.placementDetails.placementPercentage || ''} onChange={handlePlacementChange} className="input-field" placeholder="e.g. 95" min="0" max="100" />
                        </div>
                    </div>
                </div>

                {/* Recruiters */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <h4 className="text-lg font-medium">Top Recruiters</h4>
                        <button type="button" onClick={addRecruiter} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                    {formData.recruiters.map((recruiter, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input type="text" value={recruiter} onChange={(e) => updateRecruiter(idx, e.target.value)} className="input-field" placeholder="Company Name" />
                            <button type="button" onClick={() => removeRecruiter(idx)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {formData.recruiters.length === 0 && <p className="text-sm text-[var(--ring)]">No recruiters added yet.</p>}
                </div>

                {/* Faculty */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                        <h4 className="text-lg font-medium">Faculty Members</h4>
                        <button type="button" onClick={addFaculty} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                            <Plus className="w-4 h-4" /> Add
                        </button>
                    </div>
                    {formData.faculty.map((member, idx) => (
                        <div key={idx} className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-[var(--border)]">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                                <div>
                                    <label className="block text-xs text-[var(--ring)] mb-1">Name</label>
                                    <input type="text" value={member.name} onChange={(e) => updateFaculty(idx, 'name', e.target.value)} className="input-field text-sm" placeholder="Dr. John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--ring)] mb-1">Department</label>
                                    <input type="text" value={member.department} onChange={(e) => updateFaculty(idx, 'department', e.target.value)} className="input-field text-sm" placeholder="Computer Science" />
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--ring)] mb-1">Role</label>
                                    <input type="text" value={member.role} onChange={(e) => updateFaculty(idx, 'role', e.target.value)} className="input-field text-sm" placeholder="Professor" />
                                </div>
                            </div>
                            <button type="button" onClick={() => removeFaculty(idx)} className="p-2 mt-5 text-red-500 hover:bg-red-100 rounded-xl">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {formData.faculty.length === 0 && <p className="text-sm text-[var(--ring)]">No faculty members added yet.</p>}
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={submitting} className="btn-primary w-full md:w-auto flex justify-center items-center gap-2">
                        {submitting ? 'Submitting...' : <><Save className="w-4 h-4" /> Submit for Approval</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCollegeTab;
