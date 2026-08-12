import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';
const useCollegeApply = ({ college, user }) => {
    const navigate = useNavigate();
    const getInitialStatus = () => {
        if (!user) return 'not-applied';
        const apps = user.applications;
        if (!apps || !Array.isArray(apps)) return 'not-applied';
        const app = apps.find(
            a =>
                (a.college?._id || a.college)?.toString() ===
                college._id?.toString()
        );
        return app ? 'applied' : 'not-applied';
    };
    const [applyStatus, setApplyStatus] = useState(getInitialStatus);
    const [isApplying, setIsApplying] = useState(false);
    const [applyError, setApplyError] = useState('');
    const handleApply = async () => {
        // Unauthenticated → redirect to signup with college pre-selected
        if (!user) {
            navigate(`/signup?collegeId=${college._id}`);
            return;
        }
        if (applyStatus !== 'not-applied' || isApplying) return;
        setIsApplying(true);
        setApplyError('');
        try {
            await apiClient.post(`/applications/${college._id}`);
            setApplyStatus('applied');
        } catch (err) {
            setApplyError(
                err.response?.data?.message ||
                    'Failed to apply. Please try again.'
            );
        } finally {
            setIsApplying(false);
        }
    };
    return { applyStatus, isApplying, applyError, handleApply };
};
export default useCollegeApply;
