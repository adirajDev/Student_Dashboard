import { Book } from 'lucide-react';

const ExamDescription = ({ description }) => {
    return (
        <div className="md:col-span-2 order-3 bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl mb-6 flex items-center gap-3">
                <Book className="w-6 h-6 text-indigo-500" />
                About the Exam
            </h2>
            <div className="prose dark:prose-invert max-w-none text-[var(--foreground)]">
                <p className="whitespace-pre-line leading-relaxed text-lg">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ExamDescription;
