import { X } from 'lucide-react';

const ExamFiltersDropdown = ({ filters, setFilters, onClose }) => {
    return (
        <div className="absolute right-0 mt-3 w-72 bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-xl rounded-3xl p-6 z-50 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[var(--foreground)]">Filter Exams</h3>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-slate-100 text-[var(--ring)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Registration Status
                    </label>
                    <select
                        value={filters.status}
                        onChange={e =>
                            setFilters({
                                ...filters,
                                status: e.target.value,
                            })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    >
                        <option value="all">All Statuses</option>
                        <option value="live">Live Now</option>
                        <option value="upcoming">Upcoming</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Exam Mode
                    </label>
                    <select
                        value={filters.mode}
                        onChange={e =>
                            setFilters({
                                ...filters,
                                mode: e.target.value,
                            })
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    >
                        <option value="all">All Modes</option>
                        <option value="Online">Online</option>
                        <option value="Offline">Offline</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        setFilters({ status: 'all', mode: 'all' });
                    }}
                    className="w-full mt-2 py-2 text-sm text-[var(--ring)] hover:text-indigo-600 transition-colors font-medium"
                >
                    Clear all filters
                </button>
            </div>
        </div>
    );
};

export default ExamFiltersDropdown;
