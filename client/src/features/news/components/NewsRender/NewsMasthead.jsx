import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

const NewsMasthead = ({ title, publishedAt, readingTime }) => {
    return (
        <header className="mx-auto max-w-3xl px-5 pt-10 pb-8">
            <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                All news
            </Link>

            <h1 className="mt-6 text-4xl leading-tight text-[var(--foreground)] font-display">
                {title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                    {publishedAt}
                </span>
                <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 shrink-0" />
                    {readingTime} min read
                </span>
            </div>
        </header>
    );
};

export default NewsMasthead;
