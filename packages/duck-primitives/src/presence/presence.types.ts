import type * as React from 'react'

export namespace IPresence {
  export interface IProps {
    children: React.ReactElement | ((props: { present: boolean }) => React.ReactElement)
    present: boolean
  }
}
