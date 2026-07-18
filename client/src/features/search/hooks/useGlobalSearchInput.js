import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';

const useGlobalSearchInput = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    
    // We maintain a local state for the input value to allow fast typing
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '');

    // Sync input value with URL when navigating
    useEffect(() => {
        if (location.pathname === '/search') {
            setInputValue(searchParams.get('q') || '');
        } else {
            setInputValue(''); // Clear if we navigate away
        }
    }, [location.pathname, searchParams]);

    const handleSearch = (val) => {
        setInputValue(val);
        
        if (val.trim()) {
            navigate(`/search?q=${encodeURIComponent(val)}`, { replace: location.pathname === '/search' });
        } else if (location.pathname === '/search') {
            navigate('/search', { replace: true });
        }
    };

    const handleContainerClick = () => {
        if (location.pathname !== '/search') {
            navigate('/search');
        }
    };

    return {
        inputValue,
        handleSearch,
        handleContainerClick
    };
};

export default useGlobalSearchInput;
