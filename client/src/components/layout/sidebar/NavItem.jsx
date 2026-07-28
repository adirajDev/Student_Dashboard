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
                cursor-pointer flex items-center p-3 rounded-full transition-all duration-200 justify-start px-4
                ${
                    isActive && !hideActive
                        ? 'text-blue-600 font-medium'
                        : 'text-[var(--foreground)] hover:bg-slate-100/50'
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
