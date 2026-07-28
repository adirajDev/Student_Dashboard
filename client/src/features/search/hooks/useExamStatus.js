const useExamStatus = exam => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = exam.regStartingDate ? new Date(exam.regStartingDate) : null;
    const end = exam.regEndingDate ? new Date(exam.regEndingDate) : null;

    let statusText = 'Unknown';
    let statusClass = 'bg-slate-100 text-slate-700';

    if (start && end) {
        if (today >= start && today <= end) {
            statusText = 'Live';
            statusClass = 'bg-green-100 text-green-700';
        } else if (today < start) {
            statusText = 'Upcoming';
            statusClass = 'bg-blue-100 text-blue-700';
        } else if (today > end) {
            statusText = 'Closed';
            statusClass = 'bg-red-100 text-red-700';
        }
    }

    return { statusText, statusClass };
};

export default useExamStatus;
