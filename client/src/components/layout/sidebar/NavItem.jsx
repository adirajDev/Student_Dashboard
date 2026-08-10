const NavItem = ({
    icon,
    label,
    isActive,
    onClick,
    hideActive,
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            className={`
                cursor-pointer flex items-center p-3 rounded-[var(--radius-md)] transition-all duration-200 justify-start px-4
                ${
                    isActive && !hideActive
                        ? 'bg-[var(--color-amber-100)] text-[var(--color-amber-800)] font-semibold'
                        : 'text-[var(--muted)] hover:text-[var(--color-amber-900)] hover:bg-[var(--color-amber-50)] font-medium'
                }
                ${className}
            `}
        >
            <div className="flex-shrink-0">{icon}</div>
            <span className="ml-3 font-medium whitespace-nowrap">{label}</span>
        </button>
    );
};

export default NavItem;
