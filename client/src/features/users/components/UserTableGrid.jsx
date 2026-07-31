import UserRow from './UserRow';

const UserTableGrid = ({ users, onEdit, onDelete, onViewDetails, showCourse }) => (
    <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 border-b border-[var(--border)]">
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                            Name
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                            Email
                        </th>
                        {showCourse && (
                            <>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                    College
                                </th>
                            </>
                        )}
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                            Phone
                        </th>
                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                    {users.map(user => (
                        <UserRow
                            key={user.id || user._id}
                            user={user}
                            showCourse={showCourse}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onViewDetails={onViewDetails}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

export default UserTableGrid;
