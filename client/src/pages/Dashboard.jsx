import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import SettingsModal from '../components/SettingsModal';
import StudentTable from '../components/StudentTable';
import StudentFormModal from '../components/StudentFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { User as UserIcon, BookOpen, Phone, Mail, Plus } from 'lucide-react';
import Header from '../components/Header';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingStudent, setDeletingStudent] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiClient.get('/me');
                setUser(res.data);
            } catch (error) {
                navigate('/signin');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await apiClient.get('/students/get-students');
            setStudents(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch students.');
        } finally {
            setIsLoading(false);
        }
    };

    const addStudent = async (studentData) => {
        const res = await apiClient.post('/students/create-student', studentData);
        setStudents((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const handleUpdateStudent = async (id, studentData) => {
        const res = await apiClient.put(`/students/update-student/${id}`, studentData);
        setStudents((prev) => prev.map((s) => (s._id === id ? res.data : s)).sort((a, b) => a.name.localeCompare(b.name)));
        setEditingStudent(null);
    };

    const deleteStudent = async (id) => {
        await apiClient.delete(`/students/delete-student/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
        setDeletingStudent(null);
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout');
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (!user) return null; // Or TODO: a loader(later)

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout}/>            

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-[var(--ring)]">Here is an overview of your student profile.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <UserIcon className="w-5 h-5" />
                            <span className="text-sm font-medium">Full Name</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.name}</p>
                    </div>
                    
                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <Mail className="w-5 h-5" />
                            <span className="text-sm font-medium">Email Address</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)] truncate" title={user.email}>{user.email}</p>
                    </div>

                    <div className="bg-[var(--card)] p-phone5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">Enrolled Course</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.course}</p>
                    </div>

                    <div className="bg-[var(--card)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-2 text-[var(--ring)] group-hover:text-[var(--foreground)] transition-colors">
                            <Phone className="w-5 h-5" />
                            <span className="text-sm font-medium">Phone Number</span>
                        </div>
                        <p className="text-xl font-semibold text-[var(--foreground)]">{user.phone}</p>
                    </div>
                </div>

                {/* Student Management Section */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Student Directory</h3>
                        <button
                            onClick={() => {
                                setEditingStudent(null);
                                setShowFormModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Student
                        </button>
                    </div>

                    <StudentTable
                        students={students}
                        isLoading={isLoading}
                        error={error}
                        onDelete={(student) => setDeletingStudent(student)}
                        onEdit={(student) => {
                            setEditingStudent(student);
                            setShowFormModal(true);
                        }}
                    />
                </div>
            </main>

            {isSettingsOpen && (
                <SettingsModal 
                    user={user} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onUpdate={(updatedUser) => setUser(updatedUser)}
                />
            )}

            {showFormModal && (
                <StudentFormModal
                    editingStudent={editingStudent}
                    onAdd={addStudent}
                    onUpdate={handleUpdateStudent}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingStudent(null);
                    }}
                />
            )}

            {deletingStudent && (
                <DeleteConfirmModal
                    studentName={deletingStudent.name}
                    onConfirm={() => deleteStudent(deletingStudent._id)}
                    onClose={() => setDeletingStudent(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;
