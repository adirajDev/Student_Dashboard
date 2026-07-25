import { Plus, Trash2 } from 'lucide-react';

const FacultyFields = ({
    faculty,
    addFaculty,
    updateFaculty,
    removeFaculty,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h4 className="text-lg">Faculty Members</h4>
                <button
                    type="button"
                    onClick={addFaculty}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {faculty.map((member, idx) => (
                <div
                    key={idx}
                    className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-[var(--border)]"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <div>
                            <label className="block text-xs text-[var(--ring)] mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={member.name}
                                onChange={e =>
                                    updateFaculty(idx, 'name', e.target.value)
                                }
                                className="input-field text-sm"
                                placeholder="Dr. John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--ring)] mb-1">
                                Department
                            </label>
                            <input
                                type="text"
                                value={member.department}
                                onChange={e =>
                                    updateFaculty(
                                        idx,
                                        'department',
                                        e.target.value
                                    )
                                }
                                className="input-field text-sm"
                                placeholder="Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--ring)] mb-1">
                                Role
                            </label>
                            <input
                                type="text"
                                value={member.role}
                                onChange={e =>
                                    updateFaculty(idx, 'role', e.target.value)
                                }
                                className="input-field text-sm"
                                placeholder="Professor"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeFaculty(idx)}
                        className="p-2 mt-5 text-red-500 hover:bg-red-100 rounded-xl"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}

            {faculty.length === 0 && (
                <p className="text-sm text-[var(--ring)]">
                    No faculty members added yet.
                </p>
            )}
        </div>
    );
};

export default FacultyFields;
