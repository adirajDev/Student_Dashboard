const FormField = ({ id, label, type = 'text', value, onChange, placeholder, error }) => (
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
            className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder={placeholder}
            required
        />
    </div>
);

export default FormField;