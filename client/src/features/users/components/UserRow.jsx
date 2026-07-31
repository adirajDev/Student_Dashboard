import { Pencil, Trash2, Eye } from 'lucide-react';

const UserRow = ({ user, onEdit, onDelete, onViewDetails, showCourse }) => {
    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4">
                <div className="font-medium text-[var(--foreground)]">
                    {user.name}
                </div>
            </td>
            <td className="px-6 py-4 text-[var(--ring)]">{user.email}</td>

            {showCourse && (
                <>
                    <td className="px-6 py-4 text-[var(--ring)]">
                        {user.course?.name || user.course || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-[var(--ring)]">
                        {user.college?.name || user.college || 'N/A'}
                    </td>
                </>
            )}

            <td className="px-6 py-4 text-[var(--ring)]">{user.phone}</td>

            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                    {onViewDetails && (
                        <button
                            onClick={() => onViewDetails(user)}
                            title="View Details"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition cursor-pointer"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        onClick={() => onEdit(user)}
                        title="Edit"
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {onDelete && (
                        <button
                            onClick={() => onDelete(user)}
                            title="Delete"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
