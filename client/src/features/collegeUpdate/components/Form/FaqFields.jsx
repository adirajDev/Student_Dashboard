import { Plus, Trash2 } from 'lucide-react';

const MAX_FAQS = 10;
const QUESTION_MAX = 300;
const ANSWER_MAX = 5000;

const FaqFields = ({ faqs, addFaq, updateFaq, removeFaq }) => {
    const atLimit = faqs.length >= MAX_FAQS;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h4 className="text-lg">
                    FAQs{' '}
                    <span className="text-sm text-[var(--ring)]">
                        ({faqs.length}/{MAX_FAQS})
                    </span>
                </h4>
                <button
                    type="button"
                    onClick={addFaq}
                    disabled={atLimit}
                    className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {atLimit && (
                <p className="text-xs text-amber-600">
                    Maximum of {MAX_FAQS} FAQs reached. Remove one to add
                    another.
                </p>
            )}

            {faqs.map((faq, idx) => (
                <div
                    key={faq._id || faq._key}
                    className="flex items-start gap-2 bg-slate-50 p-4 rounded-2xl border border-[var(--border)]"
                >
                    <div className="flex-1 space-y-4">
                        <div>
                            <label className="block text-xs text-[var(--ring)] mb-1">
                                Question
                            </label>
                            <input
                                type="text"
                                value={faq.question}
                                onChange={e =>
                                    updateFaq(idx, 'question', e.target.value)
                                }
                                maxLength={QUESTION_MAX}
                                className="input-field text-sm"
                                placeholder="What is the admission process?"
                                required
                            />
                            <p className="text-xs text-[var(--ring)] mt-1 text-right">
                                {faq.question.length}/{QUESTION_MAX}
                            </p>
                        </div>
                        <div>
                            <label className="block text-xs text-[var(--ring)] mb-1">
                                Answer
                            </label>
                            <textarea
                                value={faq.answer}
                                onChange={e =>
                                    updateFaq(idx, 'answer', e.target.value)
                                }
                                maxLength={ANSWER_MAX}
                                rows={4}
                                className="input-field text-sm"
                                placeholder="Admissions are based on NEET scores..."
                                required
                            />
                            <p className="text-xs text-[var(--ring)] mt-1 text-right">
                                {faq.answer.length}/{ANSWER_MAX}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="p-2 mt-5 text-red-500 hover:bg-red-100 rounded-xl"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            ))}

            {faqs.length === 0 && (
                <p className="text-sm text-[var(--ring)]">No FAQs added yet.</p>
            )}
        </div>
    );
};

export default FaqFields;