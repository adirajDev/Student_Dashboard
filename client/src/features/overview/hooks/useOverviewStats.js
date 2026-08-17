import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useOverviewStats = shouldFetch => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!shouldFetch) return;

        let isMounted = true;
        setIsLoading(true);
        setError(null);

        apiClient
            .get('/stats/stats')
            .then(res => {
                if (isMounted) setStats(res.data);
            })
            .catch(err => {
                console.error(err);
                if (isMounted) setError('Failed to load stats');
            })
            .finally(() => {
                if (isMounted) setIsLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [shouldFetch]);

    return { stats, isLoading, error };
};

export default useOverviewStats;
