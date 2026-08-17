import { Plus, X } from 'lucide-react';

const ArrayListField = ({
    label,
    field,
    items,
    placeholder,
    onAdd,
    onUpdate,
    onRemove,
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-[var(--foreground)]">
                    {label}
                </label>
                <button
                    type="button"
                    onClick={() => onAdd(field)}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {items.length === 0 && (
                <p className="text-sm text-[var(--ring)]">None added yet.</p>
            )}

            <div className="space-y-2">
                {items.map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={value}
                            placeholder={placeholder}
                            onChange={e =>
                                onUpdate(field, index, e.target.value)
                            }
                            className="flex-1 px-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)]"
                        />
                        <button
                            type="button"
                            onClick={() => onRemove(field, index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            aria-label={`Remove ${label} item`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ArrayListField;
