import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import ActionMenu from '../../../components/common/ActionMenu';
import SearchBar from '../../search/components/SearchBar';
import Loading from '../../../components/common/Loading';
import EmptyTable from '../../../components/common/EmptyTable';
import NoResultsFound from '../../../components/common/NoResultsFound';
import Error from '../../../components/common/Error';
import Pagination from '../../../components/common/Pagination';

const CourseTable = ({
    courses,
    isLoading,
    error,
    page,
    totalPages,
    onPageChange,
    searchTerm,
    setSearchTerm,
    filterLevel,
    setFilterLevel,
    onEdit,
    onDelete,
}) => {
    // UI State: Data Render
    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search by course name or specialization..."
                        className="relative"
                    />
                </div>
                <div className="w-full sm:w-48 shrink-0">
                    <select
                        value={filterLevel}
                        onChange={e => setFilterLevel(e.target.value)}
                        className="w-full py-3 px-4 bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-amber-500)] appearance-none text-sm font-medium"
                    >
                        <option value="">All Levels</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Advanced Diploma">
                            Advanced Diploma
                        </option>
                        <option value="Bachelor's">Bachelor's</option>
                        <option value="Master's">Master's</option>
                        <option value="Doctorate">Doctorate</option>
                        <option value="Post Doctorate">Post Doctorate</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <Error error={error} />
            ) : !courses || courses.length === 0 ? (
                searchTerm ? (
                    <NoResultsFound searchTerm={searchTerm} />
                ) : (
                    <EmptyTable />
                )
            ) : (
                <>
                    <div className="bg-[var(--card)] rounded-[var(--radius-md)] shadow-sm border border-[var(--border)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-[var(--color-ink-50)]/50 border-b border-[var(--border)]">
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Course
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Level
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Duration
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {courses.map(course => (
                                        <tr
                                            key={course._id}
                                            className="hover:bg-[var(--color-amber-50)] transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-[var(--foreground)]">
                                                    {course.name}
                                                </div>
                                                <div className="text-sm text-[var(--muted)] mt-1">
                                                    {course.shortName}{' '}
                                                    {course.specialization
                                                        ? `- ${course.specialization}`
                                                        : ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`status-pill
                                                ${course.level?.toLowerCase().includes('diploma') ? 'bg-orange-100 text-orange-700' : ''}
                                                ${course.level?.toLowerCase().includes('bachelor') ? 'bg-blue-100 text-blue-700' : ''}
                                                ${course.level?.toLowerCase().includes('master') || course.level?.toLowerCase().includes('doctorate') ? 'bg-purple-100 text-purple-700' : ''}
                                                ${!course.level?.toLowerCase().includes('diploma') && !course.level?.toLowerCase().includes('bachelor') && !course.level?.toLowerCase().includes('master') && !course.level?.toLowerCase().includes('doctorate') ? 'bg-green-100 text-green-700' : ''}
                                            `}
                                                >
                                                    {course.level}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--muted)]">
                                                {course.duration
                                                    ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}`
                                                    : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <ActionMenu
                                                        actions={[
                                                            onEdit && {
                                                                label: 'Edit',
                                                                icon: (
                                                                    <Pencil className="w-4 h-4" />
                                                                ),
                                                                onClick: () =>
                                                                    onEdit(
                                                                        course
                                                                    ),
                                                            },
                                                            onDelete && {
                                                                label: 'Delete',
                                                                icon: (
                                                                    <Trash2 className="w-4 h-4" />
                                                                ),
                                                                danger: true,
                                                                onClick: () =>
                                                                    onDelete(
                                                                        course
                                                                    ),
                                                            },
                                                        ].filter(Boolean)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-[var(--border)] pt-4">
                        <Pagination
                            currentPage={page || 1}
                            totalPages={totalPages || 1}
                            onPageChange={onPageChange}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default CourseTable;
