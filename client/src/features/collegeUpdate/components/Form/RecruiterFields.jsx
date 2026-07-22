import { Plus, Trash2 } from 'lucide-react';

const RecruiterFields = ({
    recruiters,
    addRecruiter,
    updateRecruiter,
    removeRecruiter,
}) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h4 className="text-lg font-medium">Top Recruiters</h4>
                <button
                    type="button"
                    onClick={addRecruiter}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {recruiters.map((recruiter, idx) => (
                <div key={idx} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={recruiter}
                        onChange={e => updateRecruiter(idx, e.target.value)}
                        className="input-field"
                        placeholder="Company Name"
                    />
                    <button
                        type="button"
                        onClick={() => removeRecruiter(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}

            {recruiters.length === 0 && (
                <p className="text-sm text-[var(--ring)]">
                    No recruiters added yet.
                </p>
            )}
        </div>
    );
};

export default RecruiterFields;
