import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';

const useAdminStudentApplications = (user, onUserApplicationsUpdate) => {
    const [applications, setApplications] = useState(user?.applications || []);
    const [colleges, setColleges] = useState([]);
    const [isLoadingColleges, setIsLoadingColleges] = useState(false);
    const [loadingMap, setLoadingMap] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    // Keep applications state synced with user prop
    useEffect(() => {
        setApplications(user?.applications || []);
    }, [user]);

    // Fetch colleges list for adding new applications
    useEffect(() => {
        if (user?.role === 'student') {
            setIsLoadingColleges(true);
            apiClient
                .get('/colleges?limit=1000')
                .then(res => {
                    const list =
                        res.data.data ||
                        res.data.colleges ||
                        (Array.isArray(res.data) ? res.data : []);
                    setColleges(list);
                })
                .catch(err => {
                    console.error('Failed to fetch colleges list:', err);
                })
                .finally(() => {
                    setIsLoadingColleges(false);
                });
        }
    }, [user]);

    const addApplication = async (collegeId, courseId = '') => {
        if (applications.length >= 3) {
            setError('Student already has the maximum of 3 applications.');
            return false;
        }

        setError('');
        setSuccess('');
        setLoadingMap(prev => ({ ...prev, add: true }));
        try {
            const res = await apiClient.post(
                `/applications/${user._id || user.id}`,
                {
                    collegeId,
                    courseId: courseId || null,
                }
            );
            setApplications(res.data.applications);
            if (onUserApplicationsUpdate) {
                onUserApplicationsUpdate(res.data.applications);
            }
            setSuccess('Application added successfully');
            setIsAdding(false);
            return true;
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to add application'
            );
            return false;
        } finally {
            setLoadingMap(prev => ({ ...prev, add: false }));
        }
    };

    const updateApplicationCourse = async (applicationId, courseId) => {
        setError('');
        setSuccess('');
        setLoadingMap(prev => ({ ...prev, [applicationId]: true }));
        try {
            const res = await apiClient.patch(
                `/applications/${user._id || user.id}/${applicationId}/course`,
                { courseId }
            );
            setApplications(res.data.applications);
            if (onUserApplicationsUpdate) {
                onUserApplicationsUpdate(res.data.applications);
            }
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

    const deleteApplication = async applicationId => {
        setError('');
        setSuccess('');
        setLoadingMap(prev => ({ ...prev, [applicationId]: true }));
        try {
            const res = await apiClient.delete(
                `/applications/${user._id || user.id}/${applicationId}`
            );
            setApplications(res.data.applications);
            if (onUserApplicationsUpdate) {
                onUserApplicationsUpdate(res.data.applications);
            }
            setSuccess('Application deleted successfully');
        } catch (err) {
            setError(
                err.response?.data?.message || 'Failed to delete application'
            );
        } finally {
            setLoadingMap(prev => ({ ...prev, [applicationId]: false }));
        }
    };

    return {
        applications,
        colleges,
        isLoadingColleges,
        loadingMap,
        error,
        success,
        isAdding,
        setIsAdding,
        addApplication,
        updateApplicationCourse,
        deleteApplication,
        setError,
        setSuccess,
    };
};

export default useAdminStudentApplications;
