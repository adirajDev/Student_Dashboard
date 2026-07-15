import { useState } from 'react';
import { Plus } from 'lucide-react';
import UserTable from './UserTable';
import UserFormModal from './UserFormModal';
import DeleteConfirmModal from '../../../components/common/DeleteConfirmModal';
import useUserManagement from '../hooks/useUserManagement';

const UserManagementSection = ({ title, role, showCourse, canAdd, canDelete, shouldFetch }) => {
    const { users, isLoading, error, addUser, updateUser, deleteUser } = useUserManagement(role, shouldFetch);
    const [editingUser, setEditingUser] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);

    if (!shouldFetch) return null;

    return (
        <div className="mt-10">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">{title}</h3>
                {canAdd && (
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowFormModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add {role.charAt(0).toUpperCase() + role.slice(1)}
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
                    title={editingUser ? `Edit ${role.charAt(0).toUpperCase() + role.slice(1)}` : `Add New ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                    onAdd={addUser}
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
