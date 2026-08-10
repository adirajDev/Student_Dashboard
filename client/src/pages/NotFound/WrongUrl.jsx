import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const WrongUrl = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-[var(--background)] surface-paper">
            <AlertCircle className="w-20 h-20 text-[var(--color-amber-500)] mb-6" />
            <h1 className="text-4xl md:text-5xl text-[var(--foreground)] font-display mb-3">
                Page Not Found
            </h1>
            <p className="text-lg text-[var(--muted)] mb-8 max-w-md">
                Oops! The URL you are requesting doesn't exist or has been
                moved.
            </p>
            <Link to="/signin" className="btn-primary">
                Return to Login
            </Link>
        </div>
    );
};

export default WrongUrl;
