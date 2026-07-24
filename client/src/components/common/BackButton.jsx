import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton = ({ onClick, label = 'Back', className = 'mb-6' }) => {
    const navigate = useNavigate();

    return (
        <button
            onClick={onClick || (() => navigate(-1))}
            className={`flex items-center text-sm font-medium text-[var(--ring)] hover:text-[var(--foreground)] transition-colors ${className}`}
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            {label}
        </button>
    );
};

export default BackButton;
