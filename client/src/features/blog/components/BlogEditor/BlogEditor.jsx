import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { AlertTriangle, ImagePlus, X } from 'lucide-react';
import Toolbar from './Toolbar';
import ImageNode from './extensions/ImageNode';
import YoutubeNode from './extensions/YoutubeNode';
import { compressImage } from './utils/compressImage';
import FormField from '../../../../components/common/FormField';
import '../tiptapContent.css';

const EMPTY_DOC = { type: 'doc', content: [{ type: 'paragraph' }] };

const slugify = value =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const BlogEditor = ({ initialPost, onSaveDraft, onSubmitForReview, isSubmitting, error }) => {
    const [title, setTitle] = useState(initialPost?.title || '');
    const [slug, setSlug] = useState(initialPost?.slug || '');
    const [slugTouched, setSlugTouched] = useState(Boolean(initialPost?.slug));
    const [excerpt, setExcerpt] = useState(initialPost?.excerpt || '');
    const [coverImage, setCoverImage] = useState(initialPost?.coverImage || null);
    const [coverError, setCoverError] = useState('');
    const coverInputRef = useRef(null);

    const editor = useEditor({
        extensions: [
            // codeBlock disabled: server/src/features/blog/post/post.content-validator.js
            // only allows an inline "code" mark, not a "codeBlock" node type.
            StarterKit.configure({ codeBlock: false }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            ImageNode,
            YoutubeNode,
        ],
        content: initialPost?.content || EMPTY_DOC,
    });

    const handleTitleChange = e => {
        const value = e.target.value;
        setTitle(value);
        if (!slugTouched) setSlug(slugify(value));
    };

    const handleSlugChange = e => {
        setSlugTouched(true);
        setSlug(slugify(e.target.value));
    };

    const handleCoverPick = () => coverInputRef.current?.click();

    const handleCoverChange = async e => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        setCoverError('');
        try {
            const { base64, mimeType, sizeBytes } = await compressImage(file);
            setCoverImage({ data: base64, mimeType, sizeBytes });
        } catch (err) {
            setCoverError(err.message || 'Could not process that image.');
        }
    };

    const buildPayload = () => ({
        title,
        slug,
        excerpt,
        content: editor?.getJSON(),
        coverImage,
    });

    const isRejected = initialPost?.status === 'rejected';

    return (
        <div className="animate-fade-in bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h3 className="text-2xl mb-6">
                {initialPost ? 'Edit Post' : 'Write a New Post'}
            </h3>

            {isRejected && initialPost?.reviewNote && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-[var(--color-danger)] shrink-0 mt-0.5" />
                    <div>
                        <h5 className="text-[var(--color-danger)] font-medium text-sm mb-1">
                            This post was rejected — editing will move it back to draft
                        </h5>
                        <p className="text-[var(--color-danger)] text-sm opacity-90">
                            {initialPost.reviewNote}
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>
            )}

            <div className="space-y-6">
                <FormField label="Title" id="title" value={title} onChange={handleTitleChange} placeholder="Post title" />

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Slug
                    </label>
                    <input
                        id="slug"
                        name="slug"
                        type="text"
                        value={slug}
                        onChange={handleSlugChange}
                        placeholder="post-url-slug"
                        className="input-field"
                    />
                </div>

                <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Excerpt
                    </label>
                    <textarea
                        id="excerpt"
                        name="excerpt"
                        value={excerpt}
                        onChange={e => setExcerpt(e.target.value)}
                        placeholder="Short summary shown on listing pages"
                        maxLength={300}
                        className="input-field"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                        Cover Image
                    </label>
                    {coverImage ? (
                        <div className="relative inline-block">
                            <img
                                src={`data:${coverImage.mimeType};base64,${coverImage.data}`}
                                alt="Cover"
                                className="max-h-40 rounded-[var(--radius-md)] border border-[var(--border)]"
                            />
                            <button
                                type="button"
                                onClick={() => setCoverImage(null)}
                                className="absolute -top-2 -right-2 p-1 bg-[var(--color-danger)] text-white rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleCoverPick} className="btn-secondary flex items-center gap-2">
                            <ImagePlus className="w-4 h-4" /> Upload Cover Image
                        </button>
                    )}
                    <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleCoverChange}
                    />
                    {coverError && <p className="mt-2 text-xs text-[var(--color-danger)]">{coverError}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-2">Content</label>
                    <div className="border border-[var(--border)] rounded-[var(--radius-md)] overflow-hidden">
                        <Toolbar editor={editor} />
                        <EditorContent
                            editor={editor}
                            className="tiptap-content p-4 min-h-[300px] focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        disabled={isSubmitting || !title || !slug}
                        onClick={() => onSaveDraft(buildPayload())}
                        className="btn-secondary flex-1 sm:flex-none"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Draft'}
                    </button>
                    <button
                        type="button"
                        disabled={isSubmitting || !title || !slug}
                        onClick={() => onSubmitForReview(buildPayload())}
                        className="btn-primary flex-1 sm:flex-none"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
