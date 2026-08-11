import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

const ActionMenu = ({ actions }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={e => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                className="p-1.5 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--color-ink-50)] rounded-full transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-amber-500)]"
                title="Actions"
            >
                <MoreVertical className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[var(--card)] rounded-lg shadow-xl border border-[var(--border)] py-1 z-[60] origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    {actions.map((action, idx) => {
                        if (!action) return null; // Support conditionally null actions
                        return (
                            <button
                                key={idx}
                                onClick={e => {
                                    e.stopPropagation();
                                    setIsOpen(false);
                                    action.onClick();
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-[var(--color-ink-50)] transition-colors focus:outline-none focus:bg-[var(--color-ink-50)]
                                    ${action.danger ? 'text-red-600 hover:text-red-700 hover:bg-red-50 font-medium' : 'text-[var(--foreground)]'}`}
                            >
                                {action.icon && (
                                    <span className="shrink-0">
                                        {action.icon}
                                    </span>
                                )}
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ActionMenu;
