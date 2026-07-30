import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const useSignup = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedCollegeId = searchParams.get('collegeId');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        customCollege: '',
    });

    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collegeRes, courseRes] = await Promise.all([
                    apiClient.get('/colleges?limit=1000'),
                    apiClient.get('/courses?limit=1000'),
                ]);

                const collegeData = collegeRes.data.data || collegeRes.data;
                const courseData = courseRes.data.data || courseRes.data;

                setColleges(collegeData);
                setCourses(courseData);

                // If a collegeId was passed in the URL, pre-select it
                let defaultCollege = '';
                let defaultCourse = '';

                const preselected = preselectedCollegeId
                    ? collegeData.find(c => c._id === preselectedCollegeId)
                    : null;

                if (preselected) {
                    defaultCollege = preselected._id;
                    const availableCourses = courseData.filter(c =>
                        preselected.availableCourses?.some(
                            ac =>
                                (ac.course?._id ||
                                    ac.course ||
                                    ac._id ||
                                    ac) === c._id
                        )
                    );
                    if (availableCourses.length > 0) {
                        defaultCourse = availableCourses[0]._id;
                    }
                } else if (collegeData.length > 0) {
                    defaultCollege = collegeData[0]._id;
                    const availableCourses = courseData.filter(c =>
                        collegeData[0].availableCourses?.some(
                            ac =>
                                (ac.course?._id ||
                                    ac.course ||
                                    ac._id ||
                                    ac) === c._id
                        )
                    );
                    if (availableCourses.length > 0) {
                        defaultCourse = availableCourses[0]._id;
                    }
                }
                setFormData(prev => ({
                    ...prev,
                    college: defaultCollege,
                    course: defaultCourse,
                }));
            } catch (err) {
                console.error('Failed to fetch colleges/courses', err);
            }
        };
        fetchData();
    }, [preselectedCollegeId]);

    // Effect to handle resetting course when college changes
    useEffect(() => {
        if (colleges.length > 0 && courses.length > 0) {
            if (formData.college && formData.college !== 'others') {
                const selectedCollege = colleges.find(
                    c => c._id === formData.college
                );
                if (selectedCollege) {
                    const availableCourses = courses.filter(c =>
                        selectedCollege.availableCourses?.some(
                            ac =>
                                (ac.course?._id ||
                                    ac.course ||
                                    ac._id ||
                                    ac) === c._id
                        )
                    );
                    const isCurrentCourseValid = availableCourses.some(
                        c => c._id === formData.course
                    );
                    if (!isCurrentCourseValid) {
                        setFormData(prev => ({
                            ...prev,
                            course:
                                availableCourses.length > 0
                                    ? availableCourses[0]._id
                                    : '',
                        }));
                    }
                }
            } else if (formData.college === 'others') {
                const isCurrentCourseValid = courses.some(
                    c => c._id === formData.course
                );
                if (!isCurrentCourseValid) {
                    setFormData(prev => ({
                        ...prev,
                        course: courses.length > 0 ? courses[0]._id : '',
                    }));
                }
            }
        }
    }, [formData.college, colleges, courses]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const submitData = { ...formData };
            if (submitData.college === 'others') {
                submitData.college = submitData.customCollege;
                if (!submitData.customCollege.trim()) {
                    throw new Error('Please enter your college name');
                }
            }

            await apiClient.post('/signup', submitData);
            navigate('/signin');
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    `Failed to sign up`
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        error,
        loading,
        colleges,
        courses,
    };
};

export default useSignup;
