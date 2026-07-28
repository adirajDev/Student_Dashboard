import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Star, MapPin } from 'lucide-react';
import SearchBar from '../../search/components/SearchBar';
import Loading from '../../../components/common/Loading';
import EmptyTable from '../../../components/common/EmptyTable';
import NoResultsFound from '../../../components/common/NoResultsFound';
import Error from '../../../components/common/Error';
import Pagination from '../../../components/common/Pagination';

const CollegeTable = ({
    colleges,
    isLoading,
    error,
    page,
    totalPages,
    onPageChange,
    searchTerm,
    setSearchTerm,
    minRating,
    setMinRating,
    onEdit,
    onDelete,
}) => {
    return (
        <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onClear={() => setSearchTerm('')}
                        placeholder="Search by name, location, or course..."
                    />
                </div>
                <div className="sm:w-48 relative mb-4">
                    <select
                        value={minRating}
                        onChange={e => setMinRating(e.target.value)}
                        className="w-full px-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-full shadow-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition appearance-none"
                    >
                        <option value="0">All Ratings</option>
                        <option value="3">3+ Stars</option>
                        <option value="4">4+ Stars</option>
                        <option value="4.5">4.5+ Stars</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--ring)]">
                        <svg
                            className="fill-current h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <Error error={error} />
            ) : !colleges || colleges.length === 0 ? (
                searchTerm || minRating !== '0' ? (
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
                                            College Name
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Location
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Type
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Rating
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {colleges.map(college => (
                                        <tr
                                            key={college._id}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-[var(--foreground)]">
                                                    {college.name}
                                                </span>
                                                {college.collegeId && (
                                                    <div className="text-xs text-[var(--ring)] mt-1">
                                                        ID: {college.collegeId}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-[var(--ring)] text-sm">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {college.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                                    college.type === 'Government' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    college.type === 'Private' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                }`}>
                                                    {college.type || 'Private'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <div className="flex items-center text-amber-500 font-medium">
                                                        <Star className="w-4 h-4 mr-1 fill-current" />
                                                        {college.averageRating >
                                                        0
                                                            ? college.averageRating.toFixed(
                                                                  1
                                                              )
                                                            : 'New'}
                                                    </div>
                                                    <div className="text-xs text-[var(--ring)] mt-1">
                                                        {college.totalRatings}{' '}
                                                        {college.totalRatings ===
                                                        1
                                                            ? 'rating'
                                                            : 'ratings'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {onEdit && (
                                                        <button
                                                            onClick={() =>
                                                                onEdit(college)
                                                            }
                                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                                            title="Edit College"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {onDelete && (
                                                        <button
                                                            onClick={() =>
                                                                onDelete(
                                                                    college
                                                                )
                                                            }
                                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                                                            title="Delete College"
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

export default CollegeTable;
