import { useState } from 'react';
import { Plus } from 'lucide-react';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import useUserManagement from '../hooks/useUserManagement';

const UserManagementSection = ({ title, role, showCourse, showCollegeOnly, canAdd, canDelete, shouldFetch }) => {
    const { users, isLoading, error, addUser, updateUser, deleteUser } = useUserManagement(role, shouldFetch);
    const [editingUser, setEditingUser] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    if (!shouldFetch) return null;

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl">{title}</h3>
                {canAdd && (
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowFormModal(true);
                        }}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add {role.replace('User', '').charAt(0).toUpperCase() + role.replace('User', '').slice(1)}
                    </button>
                )}
            </div>

            <UserTable
                users={users}
                isLoading={isLoading}
                error={error}
                showCourse={showCourse}
                onDelete={canDelete ? setDeletingUser : null}
                onEdit={(u) => {
                    setEditingUser(u);
                    setShowFormModal(true);
                }}
            />

            {showFormModal && (
                <UserFormModal
                    editingUser={editingUser}
                    showCourse={showCourse}
                    showCollegeOnly={showCollegeOnly}
                    title={editingUser ? `Edit ${role.replace('User', '').charAt(0).toUpperCase() + role.replace('User', '').slice(1)}` : `Add New ${role.replace('User', '').charAt(0).toUpperCase() + role.replace('User', '').slice(1)}`}
                    onAdd={async (data) => {
                        const newUser = await addUser(data);
                        if (newUser?.generatedOtp) {
                            alert(`COLLEGE USER CREATED!\n\nPlease securely share this One-Time Password with the user:\n\nOTP: ${newUser.generatedOtp}\n\nThey will need this to log in and set their actual password.`);
                        }
                    }}
                    onUpdate={updateUser}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditingUser(null);
                    }}
                />
            )}

            {deletingUser && (
                <DeleteConfirmModal
                    studentName={deletingUser.name} // Prop name left as studentName for backward compatibility with DeleteConfirmModal
                    onConfirm={async () => {
                        await deleteUser(deletingUser._id || deletingUser.id);
                        setDeletingUser(null);
                    }}
                    onClose={() => setDeletingUser(null)}
                />
            )}
        </div>
    );
};

export default UserManagementSection;
