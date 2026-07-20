import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useCollegeDetails = (id, locationHash) => {
    const [college, setCollege] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch college data
    useEffect(() => {
        const fetchCollege = async () => {
            setIsLoading(true);
            try {
                const response = await apiClient.get(`/colleges/${id}`);
                setCollege(response.data);
            } catch (err) {
                console.error("Failed to fetch college:", err);
                setError(err.response?.data?.message || "Failed to load college details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchCollege();
        }
    }, [id]);

    // Handle scroll to hash
    useEffect(() => {
        if (!isLoading && college && locationHash) {
            // Remove the '#' character
            const elementId = locationHash.substring(1);
            const element = document.getElementById(elementId);
            
            if (element) {
                // Short timeout to ensure DOM is fully painted
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight the element briefly
                    element.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50', 'dark:bg-blue-900/20');
                    setTimeout(() => {
                        element.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-50', 'bg-blue-50', 'dark:bg-blue-900/20');
                    }, 2000);
                }, 100);
            }
        }
    }, [isLoading, college, locationHash]);

    return {
        college,
        isLoading,
        error
    };
};

export default useCollegeDetails;
