import { Node } from 'unist-builder'
import React from 'react'

type G<T> = {
  [Key in keyof T]: T[Key]
} & {}

interface Button extends React.HTMLAttributes<HTMLButtonElement> {}
interface Div extends React.HTMLAttributes<HTMLDivElement> {}

const button: G<Button> = {}

interface Combobox extends Div {}
const combobox: G<Combobox> = {}

//////

interface UnistNode extends Node {
  type: string
  name?: string
  tagName?: string
  value?: string
  properties?: {}
  attributes?: {
    name: string
    value: unknown
    type?: string
  }[]
  children?: UnistNode[]
}

const component: G<UnistNode> = {
  type: 'div',
  name: 'div',
  tagName: 'div',
  value: 'div',
  properties: {},
  attributes: [{ type: '', value: '', name: '' }],
  children: [],
}

const node: UnistNode = {
  type: 'element',
  tagName: 'Combobox',
  properties: {
    className: 'container',
    id: 'wrapper',
  },
  children: [
    {
      type: 'element',
      tagName: 'Button',
      properties: {
        className: 'btn btn-primary',
        onClick: () => console.log('hello world'),
        type: 'button',
      },
      children: [
        {
          type: 'text',
          value: 'Click me',
        },
      ],
    },
  ],
}

function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  return <button {...props} />
}

function Combobox(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

export function Node() {
  return (
    <Combobox className="container" id="wrapper">
      <Button className="btn btn-primary" onClick={() => console.log('hello world')}>
        Click me
      </Button>
    </Combobox>
  )
}
