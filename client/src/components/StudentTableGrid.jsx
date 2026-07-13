import StudentRow from './StudentRow';

const StudentTableGrid = ({ students, onEdit, onDelete }) => (
    <div className="bg-[var(--card)] rounded-xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border)]">
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--ring)] uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--ring)] uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--ring)] uppercase tracking-wider">Course</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--ring)] uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--ring)] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {students.map((student) => (
                        <StudentRow
                            key={student.id || student._id}
                            student={student}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default StudentTableGrid;
