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
            className="card-interactive cursor-pointer flex flex-col sm:flex-row group overflow-hidden min-h-[160px]"
        >
            {/* Cover */}
            <div className="relative w-full rounded-md sm:w-2/5 sm:max-w-[220px] aspect-[16/9] sm:h-auto shrink-0 bg-[var(--color-ink-50)] border-b sm:border-b-0 sm:border-r border-[var(--border)] overflow-hidden">
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
            <div className="p-5 flex flex-col flex-1 min-w-0 justify-center">
                <h3 className="text-lg sm:text-xl text-[var(--foreground)] font-display line-clamp-2">
                    {news.title}
                </h3>

                {news.content && (
                    <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">
                        {getExcerpt(news.content, 140)}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-[var(--muted)] mt-3 pt-3 border-t border-[var(--border)]">
                    <span className="flex items-center gap-2 truncate">
                        <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="truncate">
                            {formatPublishedDate(news)}
                        </span>
                    </span>
                    <span className="flex items-center gap-2 shrink-0">
                        <Clock className="w-4 h-4 shrink-0" />
                        {getReadingTime(news.content)} min read
                    </span>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
