import { useMemo } from 'react';
import { wordCountOf } from '../components/PostRender/utils/postFormatters.js';

const WORDS_PER_MINUTE = 220;

// The schema stores no reading time, so it's derived from the doc on render.
const useReadingTime = content =>
    useMemo(() => {
        if (!content) return 1;
        return Math.max(1, Math.round(wordCountOf(content) / WORDS_PER_MINUTE));
    }, [content]);

export default useReadingTime;
