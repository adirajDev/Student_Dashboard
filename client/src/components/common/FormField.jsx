const FormField = ({ id, label, type = 'text', value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-[var(--foreground)] mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--ring)] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder={placeholder}
            required
        />
    </div>
);

export default FormField;