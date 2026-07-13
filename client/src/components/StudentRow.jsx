const StudentRow = ({ student, onEdit, onDelete }) => {
    const studentId = student.id || student._id;

    return (
        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-4">
                <div className="font-medium text-[var(--foreground)]">{student.name}</div>
            </td>
            <td className="px-6 py-4 text-[var(--ring)]">
                {student.email}
            </td>
            <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                    {student.course}
                </span>
            </td>
            <td className="px-6 py-4 text-[var(--ring)]">
                {student.phone}
            </td>

            <td className="px-6 py-4 text-right space-x-4">
                <button
                    onClick={() => onEdit(student)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 font-medium text-sm transition cursor-pointer"
                >
                    Edit
                </button>

                <button
                    onClick={() => onDelete(student)}
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium text-sm transition cursor-pointer"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};

export default StudentRow;
