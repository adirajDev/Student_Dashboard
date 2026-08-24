import { Book } from 'lucide-react';

const ExamDescription = ({ description }) => {
    return (
        <div className="md:col-span-2 order-3 card p-8">
            <h2 className="text-2xl font-display mb-6 flex items-center gap-3">
                <Book className="w-6 h-6 text-[var(--color-ink-500)]" />
                About the Exam
            </h2>
            <div className="prose max-w-none text-[var(--foreground)]">
                <p className="whitespace-pre-line leading-relaxed text-lg">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default ExamDescription;
