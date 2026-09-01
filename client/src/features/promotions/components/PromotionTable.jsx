import { useState } from 'react';
import { Pencil, Trash2, ImageOff, ExternalLink } from 'lucide-react';
import ActionMenu from '@/components/common/ActionMenu';
import SearchBar from '../../search/components/SearchBar';
import Loading from '@/components/common/Loading';
import EmptyTable from '@/components/common/EmptyTable';
import NoResultsFound from '@/components/common/NoResultsFound';
import Error from '@/components/common/Error';
import Pagination from '@/components/common/Pagination';
import { getSlotConfig } from '../constants/promotionSlots';
import {
    getPromotionImageUrl,
    derivePromotionState,
    PROMOTION_STATE_STYLES,
    formatWindow,
} from '../utils/promotionUtils';

const ITEMS_PER_PAGE = 10;

const PromotionTable = ({
                            promotions,
                            isLoading,
                            error,
                            onEdit,
                            onDelete,
                        }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);

    // Client-side, matching NewsTable — the collection is small enough that
    // server-side paging would be premature.
    const term = searchTerm.toLowerCase();
    const filtered =
        promotions?.filter(
            item =>
                item.label?.toLowerCase().includes(term) ||
                item.slot?.toLowerCase().includes(term) ||
                item.targetUrl?.toLowerCase().includes(term)
        ) || [];

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
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
                        placeholder="Search by label, placement or URL..."
                    />
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : error ? (
                <Error error={error} />
            ) : filtered.length === 0 ? (
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
                                        Placement
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                        Banner
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                        State
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)]">
                                        Window
                                    </th>
                                    <th className="px-6 py-4 text-sm font-semibold text-[var(--foreground)] text-right">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border)]">
                                {paginated.map(item => {
                                    const state =
                                        derivePromotionState(item);
                                    const badge =
                                        PROMOTION_STATE_STYLES[state];
                                    const imageUrl =
                                        item.image?.mimeType
                                            ? getPromotionImageUrl(item)
                                            : null;

                                    return (
                                        <tr
                                            key={item._id}
                                            className="hover:bg-[var(--color-amber-50)] transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                        <span className="font-medium text-[var(--foreground)] truncate">
                                                            {item.label}
                                                        </span>
                                                    <span className="text-[var(--muted)] text-xs mt-1 truncate">
                                                            {getSlotConfig(
                                                                    item.slot
                                                                )?.label ||
                                                                item.slot}
                                                        </span>
                                                    <a
                                                        href={
                                                            item.targetUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer nofollow"
                                                        className="mt-1 inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline truncate"
                                                    >
                                                        <ExternalLink className="w-3 h-3 shrink-0" />
                                                        <span className="truncate">
                                                                {item.targetUrl}
                                                            </span>
                                                    </a>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt=""
                                                        loading="lazy"
                                                        className="w-20 h-12 object-cover rounded-[var(--radius-md)] border border-[var(--border)]"
                                                    />
                                                ) : (
                                                    <span className="status-pill bg-slate-100 text-slate-600">
                                                            <ImageOff className="w-3 h-3 shrink-0" />{' '}
                                                        None
                                                        </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                    <span
                                                        className={`status-pill ${badge.className}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                {item.priority > 0 && (
                                                    <span className="block mt-1 text-xs text-[var(--muted)]">
                                                            Priority{' '}
                                                        {item.priority}
                                                        </span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                    <span className="text-sm text-[var(--foreground)]">
                                                        {formatWindow(item)}
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

export default PromotionTable;