import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';
import ExamCard from '@/features/exam/components/ExamCard';
import useExamSearch from '@/features/search/hooks/useExamSearch';
import Error from '@/components/common/Error';
import ExamSearchLoading from '../Search/ExamSearchLoading';
import ExamSearchEmpty from '../Search/ExamSearchEmpty';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const ExamListingPage = () => {
    const navigate = useNavigate();
    const { filters, setFilters, results, isLoading, error } =
        useExamSearch('');

    const handleExamClick = exam => {
        navigate(`/exam/${exam._id}`);
    };

    const handleModeChange = modeValue => {
        const currentModes = Array.isArray(filters.mode) ? filters.mode : [];
        if (currentModes.includes(modeValue)) {
            setFilters({
                ...filters,
                mode: currentModes.filter(m => m !== modeValue),
            });
        } else {
            setFilters({ ...filters, mode: [...currentModes, modeValue] });
        }
    };

    return (
        <div className="min-h-screen surface-paper animate-fade-in pt-2 pb-8">
            <main className="max-w-6xl mx-auto px-4 mt-4">
                <div className="mb-8">
                    <h1 className="text-3xl text-[var(--foreground)] font-display mb-2">
                        Available Exams
                    </h1>
                    <p className="text-[var(--muted)]">
                        Explore and apply for upcoming examinations
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List Column */}
                    <div className="flex-1">
                        <div className="mb-4 flex justify-between items-center text-sm font-medium text-[var(--muted)]">
                            <span>Showing {results.length} exams</span>
                        </div>

                        {error && <Error error={error} />}

                        {isLoading ? (
                            <ExamSearchLoading />
                        ) : results.length > 0 ? (
                            <div className="grid gap-6">
                                {results.map(exam => (
                                    <ExamCard
                                        key={exam._id}
                                        exam={exam}
                                        onClick={handleExamClick}
                                    />
                                ))}
                            </div>
                        ) : (
                            <ExamSearchEmpty query="" filters={filters} />
                        )}
                    </div>

                    {/* Right Sidebar for Filters */}
                    <div className="w-full lg:w-80 shrink-0">
                        <div className="sticky top-[100px]">
                            <div className="">
                                <div className="flex items-center gap-2 mb-6 border-b border-[var(--border)] pb-4">
                                    <Filter className="w-5 h-5 text-[var(--color-ink-600)]" />
                                    <h3 className="text-lg text-[var(--foreground)] font-display">
                                        Filter Exams
                                    </h3>
                                </div>

                                <div className="space-y-8">
                                    {/* Registration Status (Segmented Control) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                            Registration Status
                                        </label>
                                        <div className="flex bg-[var(--color-ink-50)] p-1 rounded-[var(--radius-md)]">
                                            {['all', 'live', 'upcoming'].map(
                                                statusOption => (
                                                    <button
                                                        key={statusOption}
                                                        onClick={() =>
                                                            setFilters({
                                                                ...filters,
                                                                status: statusOption,
                                                            })
                                                        }
                                                        className={`flex-1 py-2 text-sm font-medium rounded-[var(--radius-sm)] capitalize transition-all ${
                                                            filters.status ===
                                                            statusOption
                                                                ? 'bg-[var(--card)] text-[var(--color-ink-700)] shadow-sm'
                                                                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                                                        }`}
                                                    >
                                                        {statusOption === 'all'
                                                            ? 'All'
                                                            : statusOption}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {/* Exam Mode (Checkboxes) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                            Exam Mode
                                        </label>
                                        <div className="space-y-3">
                                            {['Online', 'Offline'].map(
                                                modeValue => {
                                                    const isChecked =
                                                        Array.isArray(
                                                            filters.mode
                                                        ) &&
                                                        filters.mode.includes(
                                                            modeValue
                                                        );
                                                    return (
                                                        <label
                                                            key={modeValue}
                                                            className="flex items-center gap-3 cursor-pointer group"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={
                                                                    isChecked
                                                                }
                                                                onChange={() =>
                                                                    handleModeChange(
                                                                        modeValue
                                                                    )
                                                                }
                                                            />
                                                            <div
                                                                className={`w-5 h-5 rounded-[var(--radius-sm)] flex items-center justify-center transition-colors ${
                                                                    isChecked
                                                                        ? 'bg-[var(--color-ink-800)] border-[var(--color-ink-800)]'
                                                                        : 'border border-[var(--color-ink-300)] bg-[var(--card)] group-hover:border-[var(--color-ink-500)]'
                                                                }`}
                                                            >
                                                                {isChecked && (
                                                                    <svg
                                                                        className="w-3 h-3 text-white"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                        strokeWidth={
                                                                            3
                                                                        }
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M5 13l4 4L19 7"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-medium text-[var(--foreground)]">
                                                                {modeValue}
                                                            </span>
                                                        </label>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>

                                    {/* Month (Select Dropdown) */}
                                    <div>
                                        <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
                                            Exam Month
                                        </label>
                                        <select
                                            value={filters.month || 'all'}
                                            onChange={e =>
                                                setFilters({
                                                    ...filters,
                                                    month: e.target.value,
                                                })
                                            }
                                            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] px-4 py-3 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--color-ink-500)] focus:ring-1 focus:ring-[var(--color-ink-500)] transition-colors"
                                        >
                                            <option value="all">
                                                Any Month
                                            </option>
                                            {MONTHS.map((m, i) => (
                                                <option
                                                    key={i}
                                                    value={i.toString()}
                                                >
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {(filters.status !== 'all' ||
                                        (Array.isArray(filters.mode) &&
                                            filters.mode.length > 0) ||
                                        filters.month !== 'all') && (
                                        <button
                                            onClick={() => {
                                                setFilters({
                                                    status: 'all',
                                                    mode: [],
                                                    month: 'all',
                                                });
                                            }}
                                            className="w-full py-3 mt-4 rounded-[var(--radius-md)] text-sm font-medium text-[var(--color-danger)] bg-red-50 hover:bg-[var(--color-danger)]/10 transition-colors"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ExamListingPage;
