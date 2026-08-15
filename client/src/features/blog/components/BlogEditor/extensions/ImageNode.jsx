import { Node, mergeAttributes } from '@tiptap/core';

// Node shape mirrors what server/src/features/blog/post/post.content-validator.js expects:
// { type: 'image', attrs: { src, mimeType, sizeBytes } }
const ImageNode = Node.create({
    name: 'image',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
            mimeType: { default: null },
            sizeBytes: { default: null },
            alt: { default: '' },
        };
    },

    parseHTML() {
        return [{ tag: 'img[src]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'img',
            mergeAttributes(HTMLAttributes, {
                class: 'rounded-[var(--radius-md)] max-w-full',
            }),
        ];
    },
});

export default ImageNode;
