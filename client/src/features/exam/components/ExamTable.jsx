import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Calendar, Monitor, Book } from 'lucide-react';
import ActionMenu from '@/components/common/ActionMenu';
import SearchBar from '../../search/components/SearchBar';
import Loading from '@/components/common/Loading';
import EmptyTable from '@/components/common/EmptyTable';
import NoResultsFound from '@/components/common/NoResultsFound';
import Error from '@/components/common/Error';
import Pagination from '@/components/common/Pagination';

const ExamTable = ({ exams, isLoading, error, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    // Client-side pagination and searching since we don't have it on backend for exams
    const filteredExams =
        exams?.filter(
            exam =>
                exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.examMode.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const paginatedExams = filteredExams.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchBar
                        value={searchTerm}
                        onChange={val => {
                            setSearchTerm(val);
                            setPage(1);
                        }}
                        onClear={() => {
                            setSearchTerm('');
                            setPage(1);
                        }}
                        placeholder="Search by exam name..."
                    />
                </div>
            </div>

            {isLoading ? (
                <Loading message="Loading exams..." />
            ) : error ? (
                <Error error={error} />
            ) : !filteredExams || filteredExams.length === 0 ? (
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
                                            Exam Name
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Mode
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Exam Date
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {paginatedExams.map(exam => (
                                        <tr
                                            key={exam._id}
                                            className="hover:bg-[var(--color-amber-50)] transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-[var(--foreground)]">
                                                    {exam.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {exam.examMode ===
                                                    'Online' ? (
                                                        <span className="status-pill bg-emerald-100 text-emerald-700">
                                                            <Monitor className="w-3 h-3 shrink-0" />{' '}
                                                            Online
                                                        </span>
                                                    ) : (
                                                        <span className="status-pill bg-purple-100 text-purple-700">
                                                            <Book className="w-3 h-3 shrink-0" />{' '}
                                                            Offline
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-[var(--foreground)] text-sm">
                                                    <span className="font-semibold flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                                                        {new Date(
                                                            exam.examDate
                                                        ).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[var(--muted)] text-xs mt-1 ml-6">
                                                        {exam.examTime} (
                                                        {exam.examDuration >= 60
                                                            ? `${Math.floor(exam.examDuration / 60)}hr `
                                                            : ''}
                                                        {exam.examDuration % 60
                                                            ? `${exam.examDuration % 60}m`
                                                            : ''}
                                                        )
                                                    </span>
                                                </div>
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
                                                                        exam
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
                                                                        exam
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
                    {totalPages > 1 && (
                        <div className="mt-6 border-t border-[var(--border)] pt-4">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExamTable;
