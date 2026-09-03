import { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient.js';
import { PROMOTION_SLOT_IDS } from '../constants/promotionSlots';

/**
 * Public, read-only. Returns everything currently eligible for one slot; the
 * component decides which one to show.
 *
 * Deliberately has no error state in its return value. A failed promotion
 * fetch must never surface anything on a content page — PromotionSlot just
 * renders nothing, and the page is unaffected.
 */
const useSlotPromotions = slot => {
    const [promotions, setPromotions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Guard against a typo'd slot reaching the network at all.
        if (!slot || !PROMOTION_SLOT_IDS.includes(slot)) {
            if (import.meta.env.DEV && slot) {
                console.warn(`[promotions] unknown slot: ${slot}`);
            }
            setPromotions([]);
            setIsLoading(false);
            return;
        }

        // Guards against a late response from a previous slot overwriting the
        // current one after the prop changes or the page unmounts.
        let active = true;

        setIsLoading(true);

        apiClient
            .get(`/promotions/slot/${encodeURIComponent(slot)}`)
            .then(({ data }) => {
                if (active) setPromotions(data?.data || []);
            })
            .catch(() => {
                if (active) setPromotions([]);
            })
            .finally(() => {
                if (active) setIsLoading(false);
            });

        return () => {
            active = false;
        };
    }, [slot]);

    return { promotions, isLoading };
};

export default useSlotPromotions;
