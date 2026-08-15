import { useRef, useState } from 'react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Link2,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo2,
    Redo2,
    ImagePlus,
    Video as YoutubeIcon,
} from 'lucide-react';
import { compressImage } from './utils/compressImage';
import { extractYoutubeVideoId } from './utils/validateYoutubeUrl';

const MAX_IMAGES_PER_BLOG = 10;

const ToolbarButton = ({ onClick, isActive, disabled, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 rounded-[var(--radius-sm)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed
            ${
                isActive
                    ? 'bg-[var(--color-amber-200)] text-[var(--color-amber-800)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--color-ink-50)]'
            }`}
    >
        {children}
    </button>
);

const Toolbar = ({ editor }) => {
    const fileInputRef = useRef(null);
    const [imageError, setImageError] = useState('');
    const [showYoutubeInput, setShowYoutubeInput] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [youtubeError, setYoutubeError] = useState('');

    if (!editor) return null;

    const countImages = () => {
        let count = 0;
        editor.state.doc.descendants(node => {
            if (node.type.name === 'image') count += 1;
        });
        return count;
    };

    const atImageLimit = countImages() >= MAX_IMAGES_PER_BLOG;

    const handleImagePick = () => {
        setImageError('');
        if (atImageLimit) {
            setImageError(`You can add at most ${MAX_IMAGES_PER_BLOG} images.`);
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async e => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        try {
            const { dataUrl, mimeType, sizeBytes } = await compressImage(file);
            editor
                .chain()
                .focus()
                .insertContent({ type: 'image', attrs: { src: dataUrl, mimeType, sizeBytes } })
                .run();
        } catch (err) {
            setImageError(err.message || 'Could not process that image.');
        }
    };

    const handleYoutubeSubmit = () => {
        const videoId = extractYoutubeVideoId(youtubeUrl);
        if (!videoId) {
            setYoutubeError('Enter a valid YouTube URL or video ID.');
            return;
        }
        editor.chain().focus().insertContent({ type: 'youtube', attrs: { videoId } }).run();
        setYoutubeUrl('');
        setYoutubeError('');
        setShowYoutubeInput(false);
    };

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Link URL', previousUrl || '');
        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border-b border-[var(--border)] bg-[var(--color-ink-50)] rounded-t-[var(--radius-md)]">
            <div className="flex flex-wrap items-center gap-1 p-2">
                <ToolbarButton
                    title="Bold"
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Underline"
                    isActive={editor.isActive('underline')}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <UnderlineIcon className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Strikethrough"
                    isActive={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <Strikethrough className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Code"
                    isActive={editor.isActive('code')}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <Code className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton title="Link" isActive={editor.isActive('link')} onClick={setLink}>
                    <Link2 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <ToolbarButton
                    title="Heading 1"
                    isActive={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <Heading1 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 2"
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    isActive={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <Heading3 className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <ToolbarButton
                    title="Bullet List"
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Numbered List"
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Blockquote"
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                >
                    <Quote className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Horizontal Rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <ToolbarButton
                    title={atImageLimit ? `Limit of ${MAX_IMAGES_PER_BLOG} images reached` : 'Insert Image'}
                    disabled={atImageLimit}
                    onClick={handleImagePick}
                >
                    <ImagePlus className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Embed YouTube Video"
                    isActive={showYoutubeInput}
                    onClick={() => {
                        setShowYoutubeInput(prev => !prev);
                        setYoutubeError('');
                    }}
                >
                    <YoutubeIcon className="w-4 h-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-[var(--border)] mx-1" />

                <ToolbarButton
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo2 className="w-4 h-4" />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo2 className="w-4 h-4" />
                </ToolbarButton>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>

            {imageError && <p className="px-2 pb-2 text-xs text-[var(--color-danger)]">{imageError}</p>}

            {showYoutubeInput && (
                <div className="flex items-center gap-2 px-2 pb-2">
                    <input
                        type="text"
                        value={youtubeUrl}
                        onChange={e => setYoutubeUrl(e.target.value)}
                        placeholder="Paste a YouTube URL"
                        className="input-field flex-1 py-1.5 text-sm"
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleYoutubeSubmit();
                            }
                        }}
                    />
                    <button type="button" onClick={handleYoutubeSubmit} className="btn-secondary py-1.5 px-4 text-sm">
                        Embed
                    </button>
                </div>
            )}
            {youtubeError && <p className="px-2 pb-2 text-xs text-[var(--color-danger)]">{youtubeError}</p>}
        </div>
    );
};

export default Toolbar;
