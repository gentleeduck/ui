import { useTextmenuCommands, useTextmenuContentTypes, useTextmenuStates } from '@/hooks'
import { NotionEditorToolBarTextMenuProps } from './NotionEditorToolbarTextMenu.types'
import { BubbleMenu } from '@tiptap/react'
import { Separator, ToolBarToggleButtons, TurnIntoPicker } from '@/components/ui'
import { memo } from 'react'

//NOTE: We memorize the button so each button is not rerendered
// on every editor state change
const TrunIntoPickerMemo = TurnIntoPicker
const ToolBarToggleButtonsMemo = memo(ToolBarToggleButtons)

export const NotionEditorToolbarTextMenu = ({ editor }: NotionEditorToolBarTextMenuProps) => {
  const commands = useTextmenuCommands(editor)
  const states = useTextmenuStates(editor)
  const blockOptions = useTextmenuContentTypes(editor)

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bubble__menu"
    >
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
          <TrunIntoPickerMemo
            commands={commands}
            states={states}
            value={'Text'}
            onChange={() => {}}
          />
        </div>
        <Separator
          orientation="vertical"
          className="h-[26px]"
        />
        <ToolBarToggleButtonsMemo
          commands={commands}
          states={states}
        />
      </div>
    </BubbleMenu>
  )
}
