import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Loader2 } from 'lucide-react';
import CollegeCard from '@/features/college/components/CollegeCard.jsx';
import FilterCheckboxGroup from '@/features/college/components/FilterCheckboxGroup.jsx';
import FilterRadioGroup from '@/features/college/components/FilterRadioGroup.jsx';
import useCollegeSearch from '@/features/college/hooks/useCollegeSearch';
import Error from '@/components/common/Error';
import PromotionSlot from '@/features/promotions/components/PromotionSlot.jsx';

const CollegeListingPage = () => {
    const navigate = useNavigate();
    const {
        filters,
        toggleFilter,
        setFilter,
        clearFilters,
        activeFilterCount,
        stateOptions,
        typeOptions,
        ratingOptions,
        courseOptions,
        results,
        isLoading,
        error,
    } = useCollegeSearch('');

    // A banner sits after every Nth card. 4 puts the first one below the fold
    // on desktop but above it on mobile, which is usually the sweet spot.
    const PROMOTION_EVERY = 4;

    const handleCollegeClick = college => {
        navigate(`/college/${college._id}`);
    };

    return (
        <div className="min-h-screen surface-paper animate-fade-in pb-12">
            <main className="max-w-6xl mx-auto px-4 mt-4">
                <div className="mb-8">
                    <h1 className="text-3xl text-[var(--foreground)] font-display mb-2">
                        Top Colleges
                    </h1>
                    <p className="text-[var(--muted)]">
                        Explore and apply for top institutions
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main List Column */}
                    <div className="flex-1">
                        <div className="mb-4 flex justify-between items-center text-sm font-medium text-[var(--muted)]">
                            <span>Showing {results.length} colleges</span>
                        </div>

                        {error && <Error error={error} />}

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-12 text-[var(--muted)]">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <p className="text-lg">Loading colleges...</p>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="grid gap-6">
                                {results.map((college, index) => (
                                    <Fragment key={college._id}>
                                        <CollegeCard
                                            college={college}
                                            onClick={handleCollegeClick}
                                        />
                                        {(index + 1) % PROMOTION_EVERY === 0 && (
                                            <PromotionSlot slot="collegeListing:inline" />
                                        )}
                                    </Fragment>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center bg-[var(--card)] rounded-[var(--radius-xl)] border border-[var(--border)]">
                                <h3 className="text-xl mb-2 text-[var(--foreground)] font-display">
                                    No colleges found
                                </h3>
                                <p className="text-[var(--muted)]">
                                    Try adjusting your filters to see more
                                    results.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar for Filters */}
                    <div className="w-full lg:w-80 shrink-0">
                        {/*
                          The sticky column scrolls on its own only once it
                          outgrows the viewport, and only on large screens —
                          on mobile it sits inline below the list and scrolls
                          with the page.
                        */}
                        <div className="lg:top-[100px] lg:max-h-[calc(100vh-120px)] pr-1 custom-scrollbar">
                            <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-4">
                                <Filter className="w-5 h-5 text-[var(--color-ink-600)]" />
                                <h3 className="text-lg text-[var(--foreground)] font-display flex-1">
                                    Filter Colleges
                                </h3>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-sm font-medium text-[var(--color-danger)] hover:underline"
                                    >
                                        Clear ({activeFilterCount})
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/*
                                  Course and state are the two filters people
                                  actually arrive wanting, so they open by
                                  default. Type and rating are refinements.
                                */}
                                <FilterCheckboxGroup
                                    label="Course"
                                    options={courseOptions}
                                    selected={filters.course}
                                    onToggle={value =>
                                        toggleFilter('course', value)
                                    }
                                    defaultOpen
                                    searchPlaceholder="Search courses…"
                                />

                                <FilterCheckboxGroup
                                    label="State / Union Territory"
                                    options={stateOptions}
                                    selected={filters.state}
                                    onToggle={value =>
                                        toggleFilter('state', value)
                                    }
                                    defaultOpen
                                    searchPlaceholder="Search states…"
                                />

                                <FilterCheckboxGroup
                                    label="College Type"
                                    options={typeOptions}
                                    selected={filters.type}
                                    onToggle={value =>
                                        toggleFilter('type', value)
                                    }
                                    defaultOpen={false}
                                />

                                <FilterRadioGroup
                                    label="Rating"
                                    name="college-rating"
                                    options={ratingOptions}
                                    value={filters.minRating}
                                    onChange={value =>
                                        setFilter('minRating', value)
                                    }
                                    defaultOpen={false}
                                    showStars
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CollegeListingPage;