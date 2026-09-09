import { renderDiff } from './primitives.jsx';

export const FaqsDiff = ({ faqs, currentFaqs }) => {
    const findCurrent = id =>
        (currentFaqs || []).find(f => String(f._id) === String(id));

    const { added = [], updated = [], removed = [] } = faqs;

    return (
        <div className="space-y-4 mt-2">
            {added.length > 0 && (
                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <h4 className="text-sm font-semibold text-emerald-800 mb-2">
                        Added FAQs
                    </h4>
                    <div className="grid gap-3">
                        {added.map((item, i) => (
                            <div key={`fqa-${i}`} className="text-sm">
                                <p className="font-medium">{item.question}</p>
                                <p className="text-xs opacity-80 mt-1 whitespace-pre-wrap">
                                    {item.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {updated.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">
                        Edited FAQs
                    </h4>
                    <div className="grid gap-4">
                        {updated.map((item, i) => {
                            const before = findCurrent(item._id);
                            return (
                                <div
                                    key={`fqu-${i}`}
                                    className="text-sm space-y-2"
                                >
                                    {renderDiff(
                                        'Question',
                                        before
                                            ? before.question
                                            : 'FAQ no longer exists',
                                        item.question,
                                        `fqu-q-${i}`
                                    )}
                                    {renderDiff(
                                        'Answer',
                                        before
                                            ? before.answer
                                            : 'FAQ no longer exists',
                                        item.answer,
                                        `fqu-a-${i}`
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {removed.length > 0 && (
                <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">
                        Removed FAQs
                    </h4>
                    <div className="grid gap-2">
                        {removed.map((id, i) => {
                            const before = findCurrent(id);
                            return (
                                <div
                                    key={`fqr-${i}`}
                                    className="text-sm line-through opacity-70 text-red-700"
                                >
                                    {before?.question || (
                                        <span className="italic">
                                            Already deleted ({String(id)})
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
