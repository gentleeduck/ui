import * as React from 'react'
import { useWarningContext } from './dialog'

const TITLE_WARNING_NAME = 'DialogTitleWarning'
const DESCRIPTION_WARNING_NAME = 'DialogDescriptionWarning'

type TitleWarningProps = { titleId?: string }

/** Dev-only component that warns when a dialog is missing a title. */
export const TitleWarning: React.FC<TitleWarningProps> = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME)

  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.`

  React.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId)
      if (!hasTitle) console.error(MESSAGE)
    }
  }, [MESSAGE, titleId])

  return null
}

type DescriptionWarningProps = {
  contentRef: React.RefObject<HTMLDivElement | null>
  descriptionId?: string
}

/** Dev-only component that warns when a dialog is missing a description. */
export const DescriptionWarning: React.FC<DescriptionWarningProps> = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME)
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`

  React.useEffect(() => {
    const describedById = contentRef.current?.getAttribute('aria-describedby')
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId)
      if (!hasDescription) console.warn(MESSAGE)
    }
  }, [MESSAGE, contentRef, descriptionId])

  return null
}
