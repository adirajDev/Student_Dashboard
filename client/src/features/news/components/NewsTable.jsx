import { useState } from 'react';
import { Pencil, Trash2, Calendar, ImageOff } from 'lucide-react';
import ActionMenu from '@/components/common/ActionMenu';
import SearchBar from '../../search/components/SearchBar';
import Loading from '@/components/common/Loading';
import EmptyTable from '@/components/common/EmptyTable';
import NoResultsFound from '@/components/common/NoResultsFound';
import Error from '@/components/common/Error';
import Pagination from '@/components/common/Pagination';
import {
    getImageSrc,
    getExcerpt,
    formatPublishedDate,
} from '../utils/newsUtils';

const NewsTable = ({ news, isLoading, error, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    // Client-side pagination and searching since we don't have it on backend for news
    const filteredNews =
        news?.filter(
            item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice(
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
                        placeholder="Search by title or content..."
                    />
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <Error error={error} />
            ) : !filteredNews || filteredNews.length === 0 ? (
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
                                            Title
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Cover
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                            Published
                                        </th>
                                        <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                    {paginatedNews.map(item => {
                                        const imageSrc = getImageSrc(
                                            item.coverImage
                                        );

                                        return (
                                            <tr
                                                key={item._id}
                                                className="hover:bg-[var(--color-amber-50)] transition-colors group"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col max-w-md">
                                                        <span className="font-medium text-[var(--foreground)] truncate">
                                                            {item.title}
                                                        </span>
                                                        <span className="text-[var(--muted)] text-xs mt-1 truncate">
                                                            {getExcerpt(
                                                                item.content,
                                                                90
                                                            )}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {imageSrc ? (
                                                        <img
                                                            src={imageSrc}
                                                            alt={item.title}
                                                            loading="lazy"
                                                            className="w-16 h-10 object-cover rounded-[var(--radius-md)] border border-[var(--border)]"
                                                        />
                                                    ) : (
                                                        <span className="status-pill bg-slate-100 text-slate-600">
                                                            <ImageOff className="w-3 h-3 shrink-0" />{' '}
                                                            None
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold flex items-center gap-2 text-[var(--foreground)] text-sm">
                                                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                                                        {formatPublishedDate(
                                                            item
                                                        )}
                                                    </span>
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
                                                                    onClick:
                                                                        () =>
                                                                            onEdit(
                                                                                item
                                                                            ),
                                                                },
                                                                onDelete && {
                                                                    label: 'Delete',
                                                                    icon: (
                                                                        <Trash2 className="w-4 h-4" />
                                                                    ),
                                                                    danger: true,
                                                                    onClick:
                                                                        () =>
                                                                            onDelete(
                                                                                item
                                                                            ),
                                                                },
                                                            ].filter(Boolean)}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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

export default NewsTable;
