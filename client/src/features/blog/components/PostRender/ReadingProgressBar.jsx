import useReadingProgress from '../../hooks/useReadingProgress.js';

const ReadingProgressBar = ({ targetRef }) => {
    const progress = useReadingProgress(targetRef);

    return (
        <div className="fixed inset-x-0 top-0 z-40 h-0.5" aria-hidden="true">
            <div
                className="h-full bg-[var(--color-amber-500)] transition-[width] duration-150 ease-out motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ReadingProgressBar;
