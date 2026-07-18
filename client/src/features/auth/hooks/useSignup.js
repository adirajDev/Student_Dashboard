import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../services/apiClient';

const useSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        course: '',
        college: '',
        customCollege: ''
    });
    
    const [colleges, setColleges] = useState([]);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [collegeRes, courseRes] = await Promise.all([
                    apiClient.get('/data/colleges'),
                    apiClient.get('/data/courses')
                ]);
                setColleges(collegeRes.data);
                setCourses(courseRes.data);
                
                // Set defaults if available
                let defaultCollege = '';
                let defaultCourse = '';
                if (collegeRes.data.length > 0) {
                    defaultCollege = collegeRes.data[0]._id;
                    const availableCourses = courseRes.data.filter(c => collegeRes.data[0].availableCourses?.includes(c._id));
                    if (availableCourses.length > 0) {
                        defaultCourse = availableCourses[0]._id;
                    }
                }
                setFormData(prev => ({ ...prev, college: defaultCollege, course: defaultCourse }));
            } catch (err) {
                console.error("Failed to fetch colleges/courses", err);
            }
        };
        fetchData();
    }, []);

    // Effect to handle resetting course when college changes
    useEffect(() => {
        if (colleges.length > 0 && courses.length > 0) {
            if (formData.college && formData.college !== 'others') {
                const selectedCollege = colleges.find(c => c._id === formData.college);
                if (selectedCollege) {
                    const availableCourses = courses.filter(c => selectedCollege.availableCourses?.includes(c._id));
                    const isCurrentCourseValid = availableCourses.some(c => c._id === formData.course);
                    if (!isCurrentCourseValid) {
                        setFormData(prev => ({ ...prev, course: availableCourses.length > 0 ? availableCourses[0]._id : '' }));
                    }
                }
            } else if (formData.college === 'others') {
                const isCurrentCourseValid = courses.some(c => c._id === formData.course);
                if (!isCurrentCourseValid) {
                     setFormData(prev => ({ ...prev, course: courses.length > 0 ? courses[0]._id : '' }));
                }
            }
        }
    }, [formData.college, colleges, courses]);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const submitData = { ...formData };
            if (submitData.college === 'others') {
                submitData.college = submitData.customCollege;
                if (!submitData.customCollege.trim()) {
                    throw new Error("Please enter your college name");
                }
            }
            
            await apiClient.post('/signup', submitData);
            navigate('/signin');
        } catch (err) {
            setError(err.response?.data?.message || err.message || `Failed to sign up`);
        } finally {
            setLoading(false);
        }
    };

    return { formData, handleChange, handleSubmit, error, loading, colleges, courses };
};

export default useSignup;
