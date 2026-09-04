import { useMemo, useState } from 'react';
import { Users } from 'lucide-react';
import FacultyCard from '@/features/college/detail/components/parts/FacultyCard.jsx';

/**
 * The whole faculty roster. The old page sliced to 6 and pushed the rest
 * into a ListModal — a dedicated tab has the room, so both are gone.
 */
const FacultyTab = ({ college }) => {
    const faculty = college.faculty || [];
    const [department, setDepartment] = useState('all');

    const departments = useMemo(() => {
        const set = new Set(faculty.map(m => m.department).filter(Boolean));
        return Array.from(set).sort();
    }, [faculty]);

    const visible =
        department === 'all'
            ? faculty
            : faculty.filter(m => m.department === department);

    if (faculty.length === 0) {
        return (
            <div className="p-8 text-center border border-[var(--border)] border-dashed rounded-[var(--radius-xl)] text-[var(--muted)]">
                No faculty listed for this college yet.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl text-[var(--foreground)] font-display flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[var(--color-ink-500)]" />
                    Faculty ({visible.length})
                </h2>

                {departments.length > 1 && (
                    <select
                        value={department}
                        onChange={event => setDepartment(event.target.value)}
                        className="px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border)] surface-wash text-sm text-[var(--foreground)] font-medium"
                    >
                        <option value="all">All departments</option>
                        {departments.map(item => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map((member, idx) => (
                    <FacultyCard
                        key={member._id || `${member.name}-${idx}`}
                        member={member}
                    />
                ))}
            </div>
        </div>
    );
};

export default FacultyTab;
