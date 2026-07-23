import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Calendar, Monitor, Book } from 'lucide-react';
import SearchBar from '../../search/components/SearchBar';
import Loading from '../../../components/common/Loading';
import EmptyTable from '../../../components/common/EmptyTable';
import NoResultsFound from '../../../components/common/NoResultsFound';
import Error from '../../../components/common/Error';
import Pagination from '../../../components/common/Pagination';

const ExamTable = ({
    exams,
    isLoading,
    error,
    onEdit,
    onDelete,
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    
    // Client-side pagination and searching since we don't have it on backend for exams
    const filteredExams = exams?.filter(exam => 
        exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.examMode.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const paginatedExams = filteredExams.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchBar
                        value={searchTerm}
                        onChange={(val) => { setSearchTerm(val); setPage(1); }}
                        onClear={() => { setSearchTerm(''); setPage(1); }}
                        placeholder="Search by exam name..."
                    />
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <Error error={error} />
            ) : (!filteredExams || filteredExams.length === 0) ? (
                searchTerm ? (
                    <NoResultsFound searchTerm={searchTerm} />
                ) : (
                    <EmptyTable />
                )
            ) : (
                <>
                    <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border)]">
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
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <Link
                                                    to={`/exam/${exam._id}`}
                                                    className="font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    {exam.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    {exam.examMode === 'Online' ? (
                                                        <span className="px-2.5 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                            <Monitor className="w-3 h-3" /> Online
                                                        </span>
                                                    ) : (
                                                        <span className="px-2.5 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                            <Book className="w-3 h-3" /> Offline
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col text-[var(--foreground)] text-sm">
                                                    <span className="font-semibold flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                                        {new Date(exam.examDate).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[var(--ring)] text-xs mt-1 ml-5">
                                                        {exam.examTime} ({exam.examDuration >= 60 ? `${Math.floor(exam.examDuration/60)}hr ` : ''}{exam.examDuration % 60 ? `${exam.examDuration % 60}m` : ''})
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {onEdit && (
                                                        <button
                                                            onClick={() => onEdit(exam)}
                                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                            title="Edit Exam"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() => onDelete(exam)}
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                            title="Delete Exam"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
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
