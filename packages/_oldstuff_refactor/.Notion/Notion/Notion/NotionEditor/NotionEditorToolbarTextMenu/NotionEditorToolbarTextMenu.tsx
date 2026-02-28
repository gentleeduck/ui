import { BubbleMenu } from '@tiptap/react'
import { memo } from 'react'
import { Separator, ToolBarToggleButtons, TurnIntoPicker } from '@/components/ui'
import { useTextmenuCommands, useTextmenuContentTypes, useTextmenuStates } from '@/hooks'
import { NotionEditorToolBarTextMenuProps } from './NotionEditorToolbarTextMenu.types'

//NOTE: We memorize the button so each button is not rerendered
// on every editor state change
const TrunIntoPickerMemo = TurnIntoPicker
const ToolBarToggleButtonsMemo = memo(ToolBarToggleButtons)

export const NotionEditorToolbarTextMenu = ({ editor }: NotionEditorToolBarTextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu className="bubble__menu" editor={editor} tippyOptions={{ duration: 100 }}>
      {
        // <MemoContentTypePicker options={blockOptions} />
        // <MemoFontFamilyPicker
        //   onChange={commands.onSetFont}
        //   value={states.currentFont || ''}
        // />
        // <MemoFontSizePicker
        //   onChange={commands.onSetFontSize}
        //   value={states.currentSize || ''}
        // />
      }
      <div className="bubble__menu__wrapper">
        <div className="bubble__menu__wrapper__picker">
          <TrunIntoPickerMemo commands={commands} onChange={() => {}} states={states} value={'Text'} />
        </div>
        <Separator className="h-[26px]" orientation="vertical" />
        <ToolBarToggleButtonsMemo commands={commands} states={states} />
      </div>
    </BubbleMenu>
  )
}
