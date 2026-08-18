import { useState } from 'react';
import apiClient from '@/services/apiClient';

const useApplications = (user, onUpdate) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loadingMap, setLoadingMap] = useState({}); // Track loading state per application ID

    const deleteApplication = async applicationId => {
        setError('');
        setSuccess('');
        setLoadingMap(prev => ({ ...prev, [applicationId]: true }));
        try {
            const res = await apiClient.delete(
                `/applications/${applicationId}`
            );
            onUpdate({ ...user, applications: res.data.applications });
            setSuccess('Application deleted successfully');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete application'
            );
        } finally {
            setLoadingMap(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    const updateApplicationCourse = async (applicationId, courseId) => {
        setError('');
        setSuccess('');
        setLoadingMap(prev => ({ ...prev, [applicationId]: true }));
        try {
            const res = await apiClient.patch(
                `/applications/${applicationId}/course`,
                { courseId }
            );
            onUpdate({ ...user, applications: res.data.applications });
            setSuccess('Course updated successfully');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Failed to update application course'
            );
        } finally {
            setLoadingMap(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    return {
        error,
        success,
        loadingMap,
        deleteApplication,
        updateApplicationCourse,
        setError,
        setSuccess,
    };
};

export default useApplications;
