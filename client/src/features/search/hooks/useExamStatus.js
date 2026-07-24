const useExamStatus = (exam) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = exam.regStartingDate ? new Date(exam.regStartingDate) : null;
    const end = exam.regEndingDate ? new Date(exam.regEndingDate) : null;

    let statusText = 'Unknown';
    let statusClass = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';

    if (start && end) {
        if (today >= start && today <= end) {
            statusText = 'Registration Live';
            statusClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800';
        } else if (today < start) {
            statusText = 'Registration Upcoming';
            statusClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800';
        } else if (today > end) {
            statusText = 'Registration Closed';
            statusClass = 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800';
        }
    }

    return { statusText, statusClass };
};

export default useExamStatus;
