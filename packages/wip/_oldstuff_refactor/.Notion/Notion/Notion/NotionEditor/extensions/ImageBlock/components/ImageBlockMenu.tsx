import { BubbleMenu as BaseBubbleMenu } from '@tiptap/react'
import React, { useCallback, useRef } from 'react'
import { Instance, sticky } from 'tippy.js'
import { v4 as uuid } from 'uuid'

import { Icon, MenuProps, Toolbar } from '@/components/ui/Notion/ui'
import { getRenderContainer } from '@/utils/notion/getRenderContainer'
import { ImageBlockWidth } from './ImageBlockWidth'

export const ImageBlockMenu = ({ editor, appendTo }: MenuProps): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null)
  const tippyInstance = useRef<Instance | null>(null)

  const getReferenceClientRect = useCallback(() => {
    const renderContainer = getRenderContainer(editor, 'node-imageBlock')
    const rect = renderContainer?.getBoundingClientRect() || new DOMRect(-1000, -1000, 0, 0)

    return rect
  }, [editor])

  const shouldShow = useCallback(() => {
    const isActive = editor.isActive('imageBlock')

    return isActive
  }, [editor])

  const onAlignImageLeft = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('left').run()
  }, [editor])

  const onAlignImageCenter = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('center').run()
  }, [editor])

  const onAlignImageRight = useCallback(() => {
    editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockAlign('right').run()
  }, [editor])

  const onWidthChange = useCallback(
    (value: number) => {
      editor.chain().focus(undefined, { scrollIntoView: false }).setImageBlockWidth(value).run()
    },
    [editor],
  )

  return (
    <BaseBubbleMenu
      editor={editor}
      pluginKey={`imageBlockMenu-${uuid()}`}
      shouldShow={shouldShow}
      tippyOptions={{
        appendTo: () => {
          return appendTo?.current
        },
        getReferenceClientRect,
        offset: [0, 8],
        onCreate: (instance: Instance) => {
          tippyInstance.current = instance
        },
        plugins: [sticky],
        popperOptions: {
          modifiers: [{ enabled: false, name: 'flip' }],
        },
        sticky: 'popper',
      }}
      updateDelay={0}>
      <Toolbar.Wrapper ref={menuRef} shouldShowContent={shouldShow()}>
        <Toolbar.Button
          active={editor.isActive('imageBlock', { align: 'left' })}
          onClick={onAlignImageLeft}
          tooltip="Align image left">
          <Icon name="AlignHorizontalDistributeStart" />
        </Toolbar.Button>
        <Toolbar.Button
          active={editor.isActive('imageBlock', { align: 'center' })}
          onClick={onAlignImageCenter}
          tooltip="Align image center">
          <Icon name="AlignHorizontalDistributeCenter" />
        </Toolbar.Button>
        <Toolbar.Button
          active={editor.isActive('imageBlock', { align: 'right' })}
          onClick={onAlignImageRight}
          tooltip="Align image right">
          <Icon name="AlignHorizontalDistributeEnd" />
        </Toolbar.Button>
        <Toolbar.Divider />
        <ImageBlockWidth onChange={onWidthChange} value={Number.parseInt(editor.getAttributes('imageBlock').width)} />
      </Toolbar.Wrapper>
    </BaseBubbleMenu>
  )
}

export default ImageBlockMenu
