/**
 * Label + optional leading icon + control, for the exam form only.
 *
 * Not components/common/FormField.jsx: that one has no icon slot, no textarea
 * or select, and styles through the `input-field` class. Reusing it would have
 * changed how this form looks.
 */
const ExamField = ({
    label,
    name,
    icon: Icon,
    as = 'input',
    required = false,
    hint,
    children,
    ...controlProps
}) => {
    const Control = as;
    const isTextarea = as === 'textarea';
    const isSelect = as === 'select';

    const controlClasses = [
        'w-full py-3 bg-[var(--background)] border border-[var(--border)]',
        'rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
        'transition-all outline-none',
        Icon ? 'pl-12 pr-4' : 'px-4',
        isTextarea && 'resize-none',
        isSelect && 'appearance-none',
    ]
        .filter(Boolean)
        .join(' ');

    const shared = {
        id: name,
        name,
        required,
        className: controlClasses,
        ...controlProps,
    };

    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium mb-2 text-[var(--foreground)]"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                {Icon && (
                    <Icon
                        className={[
                            'absolute left-4 w-5 h-5 text-[var(--ring)]',
                            isTextarea ? 'top-3' : 'top-1/2 -translate-y-1/2',
                            isSelect && 'pointer-events-none',
                        ]
                            .filter(Boolean)
                            .join(' ')}
                    />
                )}
                {isSelect ? (
                    <Control {...shared}>{children}</Control>
                ) : (
                    <Control {...shared} />
                )}
            </div>
            {hint}
        </div>
    );
};

export default ExamField;
