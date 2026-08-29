import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';

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

    /**
     * `user` arrives after the first render — PublicLayout fetches it in the
     * background — so the initial status is computed against a null user and
     * would otherwise stay 'not-applied' for the whole session.
     *
     * Only ever upgrades to 'applied'. A downgrade would undo the optimistic
     * state set by apply() below, since `user.applications` isn't refetched
     * after a successful POST.
     */
    useEffect(() => {
        if (getInitialStatus() === 'applied') setStatus('applied');
    }, [user, collegeId]);

    const apply = async () => {
        if (!user) {
            navigate(`/signup?collegeId=${collegeId}`);
            return;
        }

        if (status !== 'not-applied' || isApplying) return;

        setIsApplying(true);
        setError('');
        try {
            await apiClient.post(`/applications/${collegeId}`);
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