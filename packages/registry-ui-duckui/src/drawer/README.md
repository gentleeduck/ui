# Drawer Component

A drawer component that can be used as a Dialog replacement on mobile and tablet devices. It provides a sliding panel that can be dragged to open and close.

## Features

- Draggable drawer with snap points
- Mobile-friendly with touch gestures
- Keyboard accessibility
- Customizable appearance
- Integrates with the Dialog component

## Installation

```bash
npm install @gentelduck/ui
```

## Usage

```tsx
import { Drawer } from '@gentelduck/ui/drawer'

export default function MyComponent() {
  return (
    <Drawer.Root>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className='fixed inset-0 bg-black/40' />
        <Drawer.Content className='bg-white rounded-t-[10px] fixed bottom-0 left-0 right-0'>
          <div className='p-4'>
            <Drawer.Title>Drawer Title</Drawer.Title>
            <p>Drawer content goes here</p>
            <Drawer.Close>Close</Drawer.Close>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

## API

### Drawer.Root

The root component that manages the drawer state.

#### Props

| Prop           | Type                                   | Default  | Description                                                         |
| -------------- | -------------------------------------- | -------- | ------------------------------------------------------------------- |
| open           | boolean                                | -        | Controls the open state of the drawer                               |
| onOpenChange   | (open: boolean) => void                | -        | Called when the open state changes                                  |
| direction      | 'top' \| 'bottom' \| 'left' \| 'right' | 'bottom' | Direction the drawer slides from                                    |
| dismissible    | boolean                                | true     | Whether the drawer can be dismissed by dragging or clicking outside |
| handleOnly     | boolean                                | false    | Whether only the handle can be used to drag the drawer              |
| snapPoints     | (number \| string)[]                   | -        | Array of snap points for the drawer                                 |
| closeThreshold | number                                 | 0.25     | Threshold for closing the drawer when dragging                      |
| defaultOpen    | boolean                                | false    | Whether the drawer is open by default                               |
| className      | string                                 | -        | Additional class names for the drawer                               |

### Drawer.Trigger

Button that opens the drawer.

### Drawer.Portal

Portal component that renders the drawer content outside the DOM hierarchy.

### Drawer.Overlay

Overlay component that covers the screen when the drawer is open.

### Drawer.Content

Content component that contains the drawer content.

### Drawer.Title

Title component for the drawer.

### Drawer.Close

Button that closes the drawer.

### Drawer.Handle

Handle component that can be used to drag the drawer.

## Examples

See the `example.tsx` file for a complete example of how to use the drawer component.
