import { useState, useEffect } from 'react';
import apiClient from '../../../services/apiClient';
import useCollegeUpdates from './useCollegeUpdates';

const useCollegeCoursesForm = user => {
    const {
        submitUpdate,
        loading: submitting,
        error: submitError,
    } = useCollegeUpdates();
    const [college, setCollege] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Original courses as fetched from the database
    const [originalCourses, setOriginalCourses] = useState([]);
    // Current state of courses being edited
    const [selectedCourses, setSelectedCourses] = useState([]);

    useEffect(() => {
        const fetchCollege = async () => {
            try {
                const collegeId =
                    typeof user.college === 'object'
                        ? user.college._id
                        : user.college;
                if (!collegeId) {
                    setError('No college assigned to this user.');
                    return;
                }
                const res = await apiClient.get(`/colleges/${collegeId}`);
                const data = res.data;
                setCollege(data);

                // Map available courses to our local state
                const currentCourses = (data.availableCourses || []).map(ac => {
                    const courseId = ac.course?._id || ac.course;
                    let cDetails = ac.course;
                    
                    if (!cDetails || typeof cDetails === 'string') {
                        cDetails = { 
                            name: 'Populating...', 
                            shortName: 'Loading ID: ' + String(courseId).substring(0, 4) 
                        };
                    }
                    
                    return {
                        course: courseId,
                        courseDetails: cDetails,
                        fee: ac.fee,
                    };
                });
                
                setOriginalCourses(currentCourses);
                setSelectedCourses(currentCourses);
            } catch (err) {
                setError('Failed to load college courses data.');
            } finally {
                setLoading(false);
            }
        };

        fetchCollege();
    }, [user.college]);

    const addCourse = (courseId, fee, courseDetails) => {
        setSelectedCourses(prev => {
            // Prevent duplicates
            if (prev.some(c => c.course === courseId)) return prev;
            return [...prev, { course: courseId, fee: Number(fee) || 0, courseDetails }];
        });
    };

    const removeCourse = courseId => {
        setSelectedCourses(prev => prev.filter(c => c.course !== courseId));
    };

    const updateFee = (courseId, fee) => {
        setSelectedCourses(prev =>
            prev.map(c =>
                c.course === courseId ? { ...c, fee: Number(fee) || 0 } : c
            )
        );
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setSuccessMsg('');

        // Calculate delta (added, updated, removed)
        const added = [];
        const updated = [];
        const removed = [];

        // Find added and updated
        selectedCourses.forEach(sc => {
            const original = originalCourses.find(oc => oc.course === sc.course);
            if (!original) {
                // Remove courseDetails from payload
                added.push({ course: sc.course, fee: sc.fee });
            } else if (original.fee !== sc.fee) {
                updated.push({ course: sc.course, fee: sc.fee });
            }
        });

        // Find removed
        originalCourses.forEach(oc => {
            if (!selectedCourses.some(sc => sc.course === oc.course)) {
                removed.push(oc.course);
            }
        });

        if (added.length === 0 && updated.length === 0 && removed.length === 0) {
            setError("No changes were made to courses.");
            return;
        }

        const proposedChanges = {
            courseUpdates: {
                added,
                updated,
                removed
            }
        };

        try {
            await submitUpdate(proposedChanges);
            setSuccessMsg(
                'Course update requested successfully! It is now pending admin approval.'
            );
        } catch (err) {
            // Error handled by submitUpdate hook
        }
    };

    return {
        college,
        loading,
        error,
        submitting,
        submitError,
        successMsg,
        selectedCourses,
        addCourse,
        removeCourse,
        updateFee,
        handleSubmit,
    };
};

export default useCollegeCoursesForm;
