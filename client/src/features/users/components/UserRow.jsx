import { Pencil, Trash2 } from 'lucide-react';

const UserRow = ({ user, onEdit, onDelete, showCourse }) => {
    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
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
                    <button
                        onClick={() => onEdit(user)}
                        title="Edit"
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition cursor-pointer"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {onDelete && (
                        <button
                            onClick={() => onDelete(user)}
                            title="Delete"
                            className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition cursor-pointer"
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
