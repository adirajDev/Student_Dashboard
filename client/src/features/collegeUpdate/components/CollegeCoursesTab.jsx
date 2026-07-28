import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, Plus, Trash2, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import SearchBar from '../../search/components/SearchBar';
import useCollegeCoursesForm from '../hooks/useCollegeCoursesForm';
import useCourseManagement from '../../courses/hooks/useCourseManagement';

const CourseCard = ({ course, actionButton }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-[var(--border)] rounded-2xl bg-[var(--card)] hover:border-blue-200 transition-colors gap-4">
        <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-[var(--foreground)]">
                    {course.shortName || course.name}
                </h4>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-100 text-blue-700">
                    {course.level}
                </span>
            </div>
            {course.specialization && (
                <div className="text-sm text-[var(--ring)] mb-1">
                    Specialization: {course.specialization}
                </div>
            )}
            <div className="text-xs text-[var(--ring)]">
                Duration: {course.duration ? `${Math.floor(course.duration / 12) > 0 ? `${Math.floor(course.duration / 12)} Yrs ` : ''}${course.duration % 12 > 0 ? `${course.duration % 12} Mos` : ''}` : 'N/A'}
            </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
            {actionButton}
        </div>
    </div>
);

const CollegeCoursesTab = () => {
    const { user } = useOutletContext();
    const {
        college,
        loading: formLoading,
        error: formError,
        submitting,
        submitError,
        successMsg,
        selectedCourses,
        addCourse,
        removeCourse,
        updateFee,
        handleSubmit,
    } = useCollegeCoursesForm(user);

    const {
        courses: globalCourses,
        isLoading: coursesLoading,
        searchTerm,
        setSearchTerm,
        filterLevel,
        setFilterLevel,
    } = useCourseManagement(true);

    if (formLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (formError) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {formError}
            </div>
        );
    }

    const availableGlobalCourses = globalCourses.filter(
        gc => !selectedCourses.some(sc => sc.course === gc._id)
    );

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in">
            {submitError && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium">Failed to submit update</h4>
                        <p className="text-sm opacity-90 mt-1">{submitError}</p>
                    </div>
                </div>
            )}

            {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium">Success!</h4>
                        <p className="text-sm opacity-90 mt-1">{successMsg}</p>
                    </div>
                </div>
            )}

            <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] p-6 md:p-8 mb-6">
                <h3 className="text-xl font-medium mb-2">Manage Courses</h3>
                <p className="text-[var(--ring)] text-sm mb-8">
                    Search for courses from the global registry, add them to your college, and set the tuition fees. 
                    Once you're done, submit the changes for admin approval.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Side: Global Search */}
                    <div className="flex flex-col border border-[var(--border)] rounded-2xl bg-slate-50/50 overflow-hidden h-[600px]">
                        <div className="p-4 border-b border-[var(--border)] bg-[var(--card)]">
                            <h4 className="font-medium mb-3">Global Courses</h4>
                            <div className="flex flex-col gap-3">
                                <SearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    onClear={() => setSearchTerm('')}
                                    placeholder="Search by name or specialization..."
                                />
                                <select
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                    className="w-full py-2.5 px-3 bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm appearance-none"
                                >
                                    <option value="">All Levels</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Advanced Diploma">Advanced Diploma</option>
                                    <option value="Bachelor's">Bachelor's</option>
                                    <option value="Master's">Master's</option>
                                    <option value="Doctorate">Doctorate</option>
                                    <option value="Post Doctorate">Post Doctorate</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {coursesLoading ? (
                                <div className="flex justify-center p-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-[var(--ring)]" />
                                </div>
                            ) : availableGlobalCourses.length === 0 ? (
                                <div className="text-center p-8 text-[var(--ring)] text-sm">
                                    No courses found. Try a different search term.
                                </div>
                            ) : (
                                availableGlobalCourses.map(course => (
                                    <CourseCard
                                        key={course._id}
                                        course={course}
                                        actionButton={
                                            <button
                                                type="button"
                                                onClick={() => addCourse(course._id, 0, course)}
                                                className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1 text-sm font-medium"
                                            >
                                                <Plus className="w-4 h-4" />
                                                <span>Add</span>
                                            </button>
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Side: Selected Courses */}
                    <div className="flex flex-col border border-[var(--border)] rounded-2xl bg-slate-50/50 overflow-hidden h-[600px]">
                        <div className="p-4 border-b border-[var(--border)] bg-[var(--card)]">
                            <h4 className="font-medium mb-1">Your Selected Courses</h4>
                            <p className="text-xs text-[var(--ring)]">Set the fee for each selected course</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {selectedCourses.length === 0 ? (
                                <div className="text-center p-8 text-[var(--ring)] text-sm">
                                    You haven't selected any courses yet. Add courses from the left.
                                </div>
                            ) : (
                                selectedCourses.map(sc => {
                                    const courseDetails = sc.courseDetails || {};
                                    const fallbackName = `Course ID: ${String(sc.course).substring(0,6)}`;

                                    return (
                                        <div key={sc.course} className="p-4 border border-blue-100 rounded-2xl bg-white shadow-sm flex flex-col gap-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-[var(--foreground)]">
                                                            {courseDetails.shortName || courseDetails.name || fallbackName}
                                                        </h4>
                                                        {courseDetails.level && (
                                                            <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-100 text-blue-700">
                                                                {courseDetails.level}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {courseDetails.specialization && (
                                                        <div className="text-xs text-[var(--ring)]">
                                                            Specialization: {courseDetails.specialization}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeCourse(sc.course)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl">
                                                <span className="text-sm font-medium text-[var(--ring)] ml-2">Fee (₹):</span>
                                                <input
                                                    type="number"
                                                    value={sc.fee || ''}
                                                    onChange={e => updateFee(sc.course, e.target.value)}
                                                    placeholder="Enter fee amount"
                                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium px-2 py-1 text-right"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 p-4 bg-[var(--card)]/80 backdrop-blur-md rounded-2xl border border-[var(--border)] shadow-sm">
                <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary px-8 py-2.5 flex items-center gap-2 shadow-sm"
                >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Submit for Approval
                </button>
            </div>
        </form>
    );
};

export default CollegeCoursesTab;
