import { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import useNewsById from '@/features/news/hooks/useNewsById.js';
import NewsBody from '@/features/news/components/NewsRender/NewsBody';
import NewsCover from '@/features/news/components/NewsRender/NewsCover';
import NewsErrorState from '@/features/news/components/NewsRender/NewsErrorState';
import NewsMasthead from '@/features/news/components/NewsRender/NewsMasthead';
import NewsSkeleton from '@/features/news/components/NewsRender/NewsSkeleton';
import ReadingProgressBar from '@/features/blog/components/PostRender/ReadingProgressBar';
import {
    getReadingTime,
    formatPublishedDate,
} from '@/features/news/utils/newsUtils';

const NewsDetail = () => {
    const { id } = useParams();
    const articleRef = useRef(null);
    const { news, status, error, retry } = useNewsById(id);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [id]);

    useEffect(() => {
        if (news?.title) document.title = `${news.title} — News`;
    }, [news?.title]);

    if (status === 'loading') return <NewsSkeleton />;

    if (status !== 'ready') {
        return (
            <NewsErrorState
                notFound={status === 'notFound'}
                message={error}
                onRetry={retry}
            />
        );
    }

    return (
        <>
            <ReadingProgressBar targetRef={articleRef} />
            <article ref={articleRef} className="surface-paper pb-24">
                <NewsMasthead
                    title={news.title}
                    publishedAt={formatPublishedDate(news)}
                    readingTime={getReadingTime(news.content)}
                />
                <div className="mx-auto max-w-3xl px-5">
                    <NewsCover
                        coverImage={news.coverImage}
                        alt={news.title}
                    />
                    <NewsBody content={news.content} />
                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-6">
                        <p className="text-sm text-[var(--muted)]">
                            More announcements, updates and notices.
                        </p>
                        <Link to="/news" className="btn-primary">
                            Browse all news
                        </Link>
                    </div>
                </div>
            </article>
        </>
    );
};

export default NewsDetail;