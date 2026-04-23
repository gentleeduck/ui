export type NotionEditorProps = {
  description?: string | undefined
  onChange?: (value: string) => void
  className?: string | undefined
}

export const initialContent = {
  content: [
    {
      attrs: {
        level: 1,
        textAlign: 'left',
      },
      content: [
        {
          attrs: {
            name: 'fire',
          },
          type: 'emoji',
        },
        {
          text: ' Next.js + Tiptap Block Editor Template',
          type: 'text',
        },
      ],
      type: 'heading',
    },
    {
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          text: 'Welcome to our React Block Editor Template built on top of ',
          type: 'text',
        },
        {
          marks: [
            {
              attrs: {
                class: null,
                href: 'https://tiptap.dev/',
                target: '_blank',
              },
              type: 'link',
            },
          ],
          text: 'Tiptap',
          type: 'text',
        },
        {
          text: ', ',
          type: 'text',
        },
        {
          marks: [
            {
              attrs: {
                class: null,
                href: 'https://nextjs.org/',
                target: '_blank',
              },
              type: 'link',
            },
          ],
          text: 'Next.js',
          type: 'text',
        },
        {
          text: ' and ',
          type: 'text',
        },
        {
          marks: [
            {
              attrs: {
                class: null,
                href: 'https://tailwindcss.com/',
                target: '_blank',
              },
              type: 'link',
            },
          ],
          text: 'Tailwind',
          type: 'text',
        },
        {
          text: '. This project can be a good starting point for your own implementation of a block editor.',
          type: 'text',
        },
      ],
      type: 'paragraph',
    },
    {
      attrs: {
        language: null,
      },
      content: [
        {
          text: "import { useEditor, EditorContent } from '@tiptap/react'\n\nfunction App() {\n  const editor = useEditor()\n\n  return <EditorContent editor={editor} />\n}",
          type: 'text',
        },
      ],
      type: 'codeBlock',
    },
    {
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          text: 'This editor includes features like:',
          type: 'text',
        },
      ],
      type: 'paragraph',
    },
    {
      content: [
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: 'A DragHandle including a DragHandle menu',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: 'A Slash menu that can be triggered via typing a ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      type: 'code',
                    },
                  ],
                  text: '/',
                  type: 'text',
                },
                {
                  text: ' into an empty paragraph or by using the ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  text: '+ Button',
                  type: 'text',
                },
                {
                  text: ' next to the drag handle',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: 'A TextFormatting menu that allows you to change the ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        color: null,
                        fontFamily: null,
                        fontSize: '18px',
                      },
                      type: 'textStyle',
                    },
                  ],
                  text: 'font size',
                  type: 'text',
                },
                {
                  text: ', ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  text: 'font weight',
                  type: 'text',
                },
                {
                  text: ', ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        color: null,
                        fontFamily: 'Georgia',
                        fontSize: null,
                      },
                      type: 'textStyle',
                    },
                  ],
                  text: 'font family',
                  type: 'text',
                },
                {
                  text: ', ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        color: '#b91c1c',
                        fontFamily: null,
                        fontSize: null,
                      },
                      type: 'textStyle',
                    },
                  ],
                  text: 'color',
                  type: 'text',
                },
                {
                  text: ', ',
                  type: 'text',
                },
                {
                  marks: [
                    {
                      attrs: {
                        color: '#7e7922',
                      },
                      type: 'highlight',
                    },
                  ],
                  text: 'highlight',
                  type: 'text',
                },
                {
                  text: ' and more',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: 'A Table of Contents that can be viewed via clicking on the button on the top left corner',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: 'Live collaboration including content synchronization and collaborative cursors',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
      ],
      type: 'bulletList',
    },
    {
      attrs: {
        align: 'center',
        src: '/placeholder-image.jpg',
        width: '100%',
      },
      type: 'imageBlock',
    },
    {
      attrs: {
        level: 2,
        textAlign: 'left',
      },
      content: [
        {
          text: 'Get started',
          type: 'text',
        },
      ],
      type: 'heading',
    },
    {
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          text: 'To access our block editor template, simply head over to your ',
          type: 'text',
        },
        {
          marks: [
            {
              attrs: {
                class: null,
                href: 'https://cloud.tiptap.dev/react-templates',
                target: '_blank',
              },
              type: 'link',
            },
          ],
          text: 'Tiptap Account',
          type: 'text',
        },
        {
          text: ' If you are not already a member, sign up for an account and complete the 2-minute React Template survey. Once finished, we will send you an invite to the private GitHub repository.',
          type: 'text',
        },
      ],
      type: 'paragraph',
    },
    {
      attrs: {
        level: 2,
        textAlign: 'left',
      },
      content: [
        {
          text: 'Installed extensions',
          type: 'text',
        },
      ],
      type: 'heading',
    },
    {
      content: [
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-drag-handle',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-drag-handle-react',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-emoji',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-file-handler',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-mathematics',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-node-range',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-table-of-contents',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap-pro/extension-unique-id',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-bullet-list',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-character-count',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-code-block',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-code-block-lowlight',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-collaboration',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-collaboration-cursor',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-color',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-document',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-dropcursor',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-focus',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-font-family',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-heading',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-highlight',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-horizontal-rule',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-image',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-link',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-ordered-list',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-paragraph',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-placeholder',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-subscript',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-superscript',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-table',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-table-header',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-table-row',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-task-item',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-task-list',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-text-align',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-text-style',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-typography',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
        {
          content: [
            {
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  text: '@tiptap/extension-underline',
                  type: 'text',
                },
              ],
              type: 'paragraph',
            },
          ],
          type: 'listItem',
        },
      ],
      type: 'bulletList',
    },
    {
      attrs: {
        class: null,
        textAlign: 'left',
      },
      type: 'paragraph',
    },
  ],
  type: 'doc',
}
