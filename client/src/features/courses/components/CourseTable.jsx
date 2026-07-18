import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import SearchBar from "../../../components/common/SearchBar";
import Loading from "../../../components/common/Loading";
import EmptyTable from "../../../components/common/EmptyTable";
import NoResultsFound from "../../../components/common/NoResultsFound";
import Error from "../../../components/common/Error";

const CourseTable = ({ courses, isLoading, error, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Loading
    if (isLoading) return <Loading />;

    // Error getting data
    if (error) return <Error error={error} />;

    // UI State: No courses at all
    if (!courses || courses.length === 0) return <EmptyTable />;

    const filteredCourses = courses.filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.level.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // UI State: Data Render
    return (
        <div>
            <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm("")}
                placeholder="Search by course name or level..."
            />

            {filteredCourses.length === 0 ? (
                <NoResultsFound searchTerm={searchTerm} />
            ) : (
                <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-[var(--border)]">
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Course Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">Level</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border)]">
                                {filteredCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[var(--foreground)]">{course.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize
                                                ${course.level === 'diploma' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : ''}
                                                ${course.level === 'bachelors' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                                                ${course.level === 'masters' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                                            `}>
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {onEdit && (
                                                    <button 
                                                        onClick={() => onEdit(course)}
                                                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                        title="Edit Course"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button 
                                                        onClick={() => onDelete(course)}
                                                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                        title="Delete Course"
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
            )}
        </div>
    );
};

export default CourseTable;
