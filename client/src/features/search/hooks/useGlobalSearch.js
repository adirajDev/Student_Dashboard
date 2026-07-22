import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useGlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await apiClient.get(
                    `/data/search?q=${encodeURIComponent(query)}`
                );
                if (Array.isArray(response.data)) {
                    setResults(response.data);
                } else {
                    console.error('Unexpected API response:', response.data);
                    setResults([]);
                }
            } catch (err) {
                console.error('Global search error:', err);
                setError('Failed to fetch results');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [query]);

    return {
        query,
        setQuery,
        results,
        isLoading,
        error,
        isOpen,
        setIsOpen,
    };
};

export default useGlobalSearch;
