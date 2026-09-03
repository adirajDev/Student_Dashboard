import { Plus, Trash2 } from 'lucide-react';
import { FAQ_ANSWER_MAX, FAQ_QUESTION_MAX, MAX_FAQS } from '@/constants/faq.js';

const FaqFields = ({ value = [], onChange, heading = 'FAQs' }) => {
    const atLimit = value.length >= MAX_FAQS;

    const addFaq = () =>
        onChange([
            ...value,
            { _key: crypto.randomUUID(), question: '', answer: '' },
        ]);

    const updateFaq = (index, field, fieldValue) =>
        onChange(
            value.map((faq, i) =>
                i === index ? { ...faq, [field]: fieldValue } : faq
            )
        );

    const removeFaq = index => onChange(value.filter((_, i) => i !== index));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <h4 className="text-lg">
                    {heading}
                    <span className="text-sm text-[var(--ring)]">
                        ({value.length}/{MAX_FAQS})
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

            {value.map((faq, idx) => (
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
                                maxLength={FAQ_QUESTION_MAX}
                                className="input-field text-sm"
                                placeholder="What is the admission process?"
                            />
                            <p className="text-xs text-[var(--ring)] mt-1 text-right">
                                {faq.question.length}/{FAQ_QUESTION_MAX}
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
                                maxLength={FAQ_ANSWER_MAX}
                                rows={4}
                                className="input-field text-sm"
                                placeholder="Admissions are based on NEET scores..."
                            />
                            <p className="text-xs text-[var(--ring)] mt-1 text-right">
                                {faq.answer.length}/{FAQ_ANSWER_MAX}
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

            {value.length === 0 && (
                <p className="text-sm text-[var(--ring)]">No FAQs added yet.</p>
            )}
        </div>
    );
};

/**
 * Form array -> API payload. Drops blank rows and the local `_key`,
 * keeps `_id` on existing FAQs, and derives `order` from array position.
 */
export const serializeFaqs = (faqs = []) =>
    faqs
        .filter(f => f.question.trim() && f.answer.trim())
        .map(({ _id, question, answer }, index) => ({
            ...(_id ? { _id } : {}),
            question: question.trim(),
            answer: answer.trim(),
            order: index,
        }));

export default FaqFields;
