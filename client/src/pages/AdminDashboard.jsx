import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import SettingsModal from '../components/SettingsModal';
import UserTable from '../components/UserTable';
import UserFormModal from '../components/UserFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Plus } from 'lucide-react';
import Header from '../components/Header';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Students State
    const [students, setStudents] = useState([]);
    const [isLoadingStudents, setIsLoadingStudents] = useState(true);
    const [studentsError, setStudentsError] = useState(null);

    // Editors State
    const [editors, setEditors] = useState([]);
    const [isLoadingEditors, setIsLoadingEditors] = useState(false);
    const [editorsError, setEditorsError] = useState(null);

    // Modal UI State
    const [editingUser, setEditingUser] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [activeGroup, setActiveGroup] = useState('student'); // 'student' or 'editor'

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

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (user) {
            fetchStudents();
            if (isAdmin) {
                fetchEditors();
            }
        }
    }, [user]);

    // --- STUDENT LOGIC ---
    const fetchStudents = async () => {
        try {
            setIsLoadingStudents(true);
            setStudentsError(null);
            const res = await apiClient.get('/students/get-students');
            setStudents(res.data);
        } catch (err) {
            setStudentsError(err.response?.data?.error || 'Failed to fetch students.');
        } finally {
            setIsLoadingStudents(false);
        }
    };

    const addStudent = async (studentData) => {
        const res = await apiClient.post('/students/create-student', studentData);
        setStudents((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const updateStudent = async (id, studentData) => {
        const res = await apiClient.put(`/students/update-student/${id}`, studentData);
        setStudents((prev) => prev.map((s) => (s._id === id ? res.data : s)).sort((a, b) => a.name.localeCompare(b.name)));
        setEditingUser(null);
    };

    const deleteStudent = async (id) => {
        await apiClient.delete(`/students/delete-student/${id}`);
        setStudents((prev) => prev.filter((s) => s._id !== id));
        setDeletingUser(null);
    };

    // --- EDITOR LOGIC ---
    const fetchEditors = async () => {
        try {
            setIsLoadingEditors(true);
            setEditorsError(null);
            const res = await apiClient.get('/editors/get-editors');
            setEditors(res.data);
        } catch (err) {
            setEditorsError(err.response?.data?.error || 'Failed to fetch editors.');
        } finally {
            setIsLoadingEditors(false);
        }
    };

    const addEditor = async (editorData) => {
        const res = await apiClient.post('/editors/create-editor', editorData);
        setEditors((prev) => [...prev, res.data].sort((a, b) => a.name.localeCompare(b.name)));
    };

    const updateEditor = async (id, editorData) => {
        const res = await apiClient.put(`/editors/update-editor/${id}`, editorData);
        setEditors((prev) => prev.map((e) => (e._id === id ? res.data : e)).sort((a, b) => a.name.localeCompare(b.name)));
        setEditingUser(null);
    };

    const deleteEditor = async (id) => {
        await apiClient.delete(`/editors/delete-editor/${id}`);
        setEditors((prev) => prev.filter((e) => e._id !== id));
        setDeletingUser(null);
    };

    const handleLogout = async () => {
        try {
            await apiClient.post('/logout');
            navigate('/signin');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleDelete = (userToDelete) => {
        setActiveGroup(userToDelete.role);
        setDeletingUser(userToDelete);
    };

    const handleConfirmDelete = async () => {
        if (activeGroup === 'student') await deleteStudent(deletingUser._id);
        else await deleteEditor(deletingUser._id);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen relative animate-fade-in bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <Header onSettingsOpen={() => setIsSettingsOpen(true)} onLogout={handleLogout}/>            

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                    <p className="text-[var(--ring)]">Here is an overview of your management portal.</p>
                </div>

                {/* --- STUDENT SECTION --- */}
                <div className="mt-10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold">Student Directory</h3>
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setActiveGroup('student');
                                    setEditingUser(null);
                                    setShowFormModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Student
                            </button>
                        )}
                    </div>

                    <UserTable
                        users={students}
                        isLoading={isLoadingStudents}
                        error={studentsError}
                        showCourse={true}
                        onDelete={isAdmin ? handleDelete : null}
                        onEdit={(u) => {
                            setActiveGroup('student');
                            setEditingUser(u);
                            setShowFormModal(true);
                        }}
                    />
                </div>

                {/* --- EDITOR SECTION (Admin Only) --- */}
                {isAdmin && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold">Editor Directory</h3>
                            <button
                                onClick={() => {
                                    setActiveGroup('editor');
                                    setEditingUser(null);
                                    setShowFormModal(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add Editor
                            </button>
                        </div>

                        <UserTable
                            users={editors}
                            isLoading={isLoadingEditors}
                            error={editorsError}
                            showCourse={false}
                            onDelete={handleDelete}
                            onEdit={(u) => {
                                setActiveGroup('editor');
                                setEditingUser(u);
                                setShowFormModal(true);
                            }}
                        />
                    </div>
                )}
            </main>

            {isSettingsOpen && (
                <SettingsModal 
                    user={user} 
                    onClose={() => setIsSettingsOpen(false)} 
                    onUpdate={(updatedUser) => setUser(updatedUser)}
                />
            )}

            {showFormModal && (
                <UserFormModal
                    editingUser={editingUser}
                    showCourse={activeGroup === 'student'}
                    title={editingUser ? `Edit ${activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)}` : `Add New ${activeGroup.charAt(0).toUpperCase() + activeGroup.slice(1)}`}
                    onAdd={activeGroup === 'student' ? addStudent : addEditor}
                    onUpdate={activeGroup === 'student' ? updateStudent : updateEditor}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingUser(null);
                    }}
                />
            )}

            {deletingUser && (
                <DeleteConfirmModal
                    studentName={deletingUser.name} // Keeps naming simple for the modal
                    onConfirm={handleConfirmDelete}
                    onClose={() => setDeletingUser(null)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
