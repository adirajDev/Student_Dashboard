import { Node, mergeAttributes } from '@tiptap/core';

// Node shape mirrors what server/src/features/blog/post/post.content-validator.js expects:
// { type: 'youtube', attrs: { videoId } } — never a raw URL.
const YoutubeNode = Node.create({
    name: 'youtube',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            videoId: { default: null },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-youtube-video]' }];
    },

    renderHTML({ HTMLAttributes }) {
        const { videoId } = HTMLAttributes;
        return [
            'div',
            mergeAttributes(HTMLAttributes, {
                'data-youtube-video': '',
                class: 'aspect-video rounded-[var(--radius-md)] overflow-hidden',
            }),
            [
                'iframe',
                {
                    src: `https://www.youtube.com/embed/${videoId}`,
                    frameborder: '0',
                    allowfullscreen: 'true',
                    class: 'w-full h-full',
                },
            ],
        ];
    },
});

export default YoutubeNode;
