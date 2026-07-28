import { useState, useEffect } from 'react';
import useExams from './useExams';

const useExamDetails = id => {
    const { getExamById } = useExams(false);
    const [exam, setExam] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExamDetails = async () => {
            setIsLoading(true);
            const res = await getExamById(id);
            if (res.success) {
                setExam(res.data);
            } else {
                setError(res.error || 'Failed to load exam details');
            }
            setIsLoading(false);
        };

        if (id) {
            fetchExamDetails();
        }
    }, [id, getExamById]);

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

    return { exam, isLoading, error, formatTimeRange };
};

export default useExamDetails;
