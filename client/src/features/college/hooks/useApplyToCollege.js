import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const useApplyToCollege = (collegeId, user) => {
    const navigate = useNavigate();

    const getInitialStatus = () => {
        if (!user) return 'not-applied';
        const apps = user.applications;
        if (!apps || !Array.isArray(apps)) return 'not-applied';

        const app = apps.find(
            a =>
                (a.college?._id || a.college)?.toString() ===
                collegeId?.toString()
        );
        return app ? 'applied' : 'not-applied';
    };

    const [status, setStatus] = useState(getInitialStatus);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState('');

    const apply = async () => {
        if (!user) {
            navigate(`/signup?collegeId=${collegeId}`);
            return;
        }

        if (status !== 'not-applied' || isApplying) return;

        setIsApplying(true);
        setError('');
        try {
            await apiClient.post(`/students/${collegeId}/apply`);
            setStatus('applied');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to apply. Please try again.'
            );
        } finally {
            setIsApplying(false);
        }
    };

    return { status, isApplying, error, apply };
};

export default useApplyToCollege;
