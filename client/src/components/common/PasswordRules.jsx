import { Check, Circle } from 'lucide-react';

// Keep in sync with server/src/common/validation/password.validation.js
export const PASSWORD_RULES = [
    { label: 'At least 6 characters', test: v => v.length >= 6 },
    { label: 'One uppercase letter', test: v => /[A-Z]/.test(v) },
    { label: 'One number', test: v => /[0-9]/.test(v) },
    { label: 'One special character', test: v => /[^A-Za-z0-9]/.test(v) },
];

/**
 * Password requirement hints.
 * Pass `value` to tick rules off as they're met; omit it for a static list.
 */
const PasswordRules = ({ value }) => {
    const isLive = typeof value === 'string';

    return (
        <ul className="mt-2 space-y-1">
            {PASSWORD_RULES.map(rule => {
                const met = isLive && rule.test(value);

                return (
                    <li
                        key={rule.label}
                        className={`flex items-center gap-2 text-xs transition-colors ${
                            met
                                ? 'text-[var(--color-ink-700)]'
                                : 'text-[var(--muted)]'
                        }`}
                    >
                        {met ? (
                            <Check className="w-3.5 h-3.5 flex-shrink-0" />
                        ) : (
                            <Circle className="w-3 h-3 flex-shrink-0 opacity-50" />
                        )}
                        <span>{rule.label}</span>
                    </li>
                );
            })}
        </ul>
    );
};

export default PasswordRules;