import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient.js';

const useExamDetails = slug => {
    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExamDetails = async () => {
            setIsLoading(true);
            try {
                const res = await apiClient.get(
                    `/exams/slug/${encodeURIComponent(slug)}`
                );
                setExam(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    console.error('Failed to fetch exam:', err);
                    setError(
                        err.response?.data?.message || 'Failed to load exam details'
                    );
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (slug) {
            fetchExamDetails();
        }
    }, [slug]);

    const formatTimeRange = (timeStr, durationMinutes) => {
        if (!timeStr) return 'TBA';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const startDate = new Date();
        startDate.setHours(hours, minutes, 0, 0);

        const formatAMPM = date => {
            let h = date.getHours();
            let m = date.getMinutes();
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            m = m < 10 ? '0' + m : m;
            return `${h}:${m} ${ampm}`;
        };

        const startFormatted = formatAMPM(startDate);

        if (durationMinutes) {
            const endDate = new Date(
                startDate.getTime() + durationMinutes * 60000
            );
            const endFormatted = formatAMPM(endDate);
            return `${startFormatted} - ${endFormatted}`;
        }

        return startFormatted;
    };

    return { exam, isLoading, error, notFound, formatTimeRange };
};

export default useExamDetails;
