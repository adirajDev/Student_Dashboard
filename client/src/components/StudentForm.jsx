import useStudentForm from '../hooks/useStudentForm';
import FormField from '../utils/FormField';

const StudentForm = ({ onAdd, onUpdate, editingStudent, onCancelEdit }) => {
    const { formData, validationError, handleChange, handleSubmit } = useStudentForm({
        editingStudent,
        onAdd,
        onUpdate,
    });

    return (
        <div className="bg-[var(--card)] p-6 rounded-xl shadow-sm border border-[var(--border)]">
            {/* Dynamic Title */}
            <h2 className="text-xl font-semibold mb-5 text-[var(--foreground)]">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>

            {/* Render the error message if it exists */}
            {validationError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm">
                    {validationError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    id="name"
                    label="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Student Name"
                />

                <FormField
                    id="email"
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@mail.com"
                />

                <div>
                    <label htmlFor="course" className="block text-sm font-medium text-[var(--foreground)] mb-1">
                        Course
                    </label>
                    <select
                        id="course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                        required
                    >
                        <option value="">Select a course</option>
                        <option value="BTech">BTech</option>
                        <option value="BBA">BBA</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Management">Management</option>
                        <option value="Designing">Designing</option>
                    </select>
                </div>

                <FormField
                    id="phone"
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                />

                <div className="flex gap-3 mt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
                    >
                        {editingStudent ? 'Update Student' : 'Add Student'}
                    </button>

                    {/* Render a cancel button when editing */}
                    {editingStudent && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-[var(--foreground)] font-medium py-2.5 px-4 rounded-lg transition duration-200"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default StudentForm;
