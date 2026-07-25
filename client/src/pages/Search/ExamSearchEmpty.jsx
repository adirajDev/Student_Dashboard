import { Search } from 'lucide-react';

const ExamSearchEmpty = ({ query, filters }) => {
    return (
        <div className="text-center py-20 px-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-[var(--ring)]" />
            </div>
            <h3 className="text-2xl text-[var(--foreground)] mb-3">
                No exams found
            </h3>
            <p className="text-[var(--ring)] max-w-md mx-auto">
                We couldn't find any exams matching "{query}" with the current filters.
                Try adjusting your search terms or clearing the filters.
            </p>
        </div>
    );
};

export default ExamSearchEmpty;
