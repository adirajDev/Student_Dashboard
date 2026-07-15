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
                if (courseRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, course: courseRes.data[0]._id }));
                }
                if (collegeRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, college: collegeRes.data[0]._id }));
                }
            } catch (err) {
                console.error("Failed to fetch colleges/courses", err);
            }
        };
        fetchData();
    }, []);

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
