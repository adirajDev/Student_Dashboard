import { Pencil, Trash2, Eye } from 'lucide-react';
import ActionMenu from '../../../components/common/ActionMenu';

const UserRow = ({
    user,
    onEdit,
    onDelete,
    onViewDetails,
    showCourse,
    showCollegeOnly,
}) => {
    return (
        <tr className="hover:bg-[var(--color-amber-50)] transition-colors">
            <td className="px-6 py-4">
                <div className="font-medium text-[var(--foreground)]">
                    {user.name}
                </div>
            </td>
            <td className="px-6 py-4 text-[var(--muted)]">{user.email}</td>

            {showCourse && (
                <>
                    <td className="px-6 py-4 text-[var(--muted)]">
                        {user.course?.name || user.course || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-[var(--muted)]">
                        {user.college?.name || user.college || 'N/A'}
                    </td>
                </>
            )}

            {showCollegeOnly && !showCourse && (
                <td className="px-6 py-4 text-[var(--muted)]">
                    {user.college?.name || user.college || 'N/A'}
                </td>
            )}

            <td className="px-6 py-4 text-[var(--muted)]">{user.phone}</td>

            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    <ActionMenu
                        actions={[
                            onViewDetails && {
                                label: 'View Details',
                                icon: <Eye className="w-4 h-4" />,
                                onClick: () => onViewDetails(user),
                            },
                            onEdit && {
                                label: 'Edit',
                                icon: <Pencil className="w-4 h-4" />,
                                onClick: () => onEdit(user),
                            },
                            onDelete && {
                                label: 'Delete',
                                icon: <Trash2 className="w-4 h-4" />,
                                danger: true,
                                onClick: () => onDelete(user),
                            },
                        ].filter(Boolean)}
                    />
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
