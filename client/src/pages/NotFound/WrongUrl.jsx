import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const WrongUrl = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <AlertCircle className="w-20 h-20 text-indigo-500 mb-6" />
            <h1 className="text-4xl md:text-5xl text-[var(--foreground)] mb-3">
                Page Not Found
            </h1>
            <p className="text-lg text-[var(--ring)] mb-8 max-w-md">
                Oops! The URL you are requesting doesn't exist or has been moved.
            </p>
            <Link 
                to="/signin" 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
            >
                Return to Login
            </Link>
        </div>
    );
};

export default WrongUrl;
