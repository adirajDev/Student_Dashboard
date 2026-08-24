import { Newspaper, Calendar, Clock } from 'lucide-react';
import {
    getImageSrc,
    getExcerpt,
    getReadingTime,
    formatPublishedDate,
} from '../utils/newsUtils';

const NewsCard = ({ news, onClick }) => {
    const imageSrc = getImageSrc(news.coverImage);

    return (
        <div
            onClick={() => onClick?.(news)}
            className="card-interactive cursor-pointer flex flex-col group h-full overflow-hidden"
        >
            {/* Cover */}
            <div className="relative w-full aspect-[16/9] bg-[var(--color-ink-50)] border-b border-[var(--border)] overflow-hidden">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={news.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-600)]">
                        <Newspaper className="w-8 h-8" />
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-xl text-[var(--foreground)] font-display line-clamp-2">
                    {news.title}
                </h3>

                {news.content && (
                    <p className="mt-2 text-sm text-[var(--muted)] line-clamp-3 flex-1">
                        {getExcerpt(news.content, 160)}
                    </p>
                )}

                <hr className="border-[var(--border)] my-4" />

                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                        {formatPublishedDate(news)}
                    </span>
                    <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 shrink-0" />
                        {getReadingTime(news.content)} min read
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;