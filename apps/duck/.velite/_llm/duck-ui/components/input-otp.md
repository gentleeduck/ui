## Philosophy

OTP inputs are deceptively complex: they need to handle paste, auto-fill, focus management across segments, and mobile keyboard optimization. We isolate this complexity in a dedicated component rather than stretching Input to cover it. Each slot is its own element, giving you full control over styling and animation per digit.

## How It's Built

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add input-otp
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/primitives lucide-react
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx showLineNumbers

  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
```

```tsx showLineNumbers

```

## Examples

### Pattern

Use the `pattern` prop to define a custom pattern for the OTP input.

```tsx showLineNumbers {1,7}

...

    {/* ... */}

```

### Separator

You can use the `` component to add a separator between the input groups.

```tsx showLineNumbers {4,15}

  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

...

```

### Controlled

You can use the `value` and `onValueChange` props to control the input value.

### Custom separator

### Form

## Paste

- Pasting fills slots starting at the focused input.
- Characters are filtered by the `pattern` prop.
- `onValueChange` fires after paste and per-key entry.

## RTL Support

Direction is resolved through the shared primitives direction module. Use a local `dir="rtl"` override when the component exposes it, or set `DirectionProvider` at app/root level for global RTL/LTR behavior.

## Motion

}
  title="Alpha: Motion Compositions"
  tone="warning">
Motion components work standalone, but some compositions may behave unexpectedly — this is still under active development. If you find a broken composition, please [file an issue](https://github.com/gentleeduck/gentleduck/issues).

Use `MotionInputOTP` for a scale+blur entrance animation on the entire OTP input powered by [motion](https://motion.dev).

}>
Requires the `motion` package. Use `MotionInputOTP` instead of `InputOTP`. All other sub-components stay the same.

## API Reference

### InputOTP

The root component that provides OTP context and manages slot focus, paste, and value state.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | - | Additional class names for the wrapper div |
| `children` | `React.ReactNode` | - | OTP groups, slots, and separators |
| `value` | `string` | - | Controlled value of the OTP input |
| `onValueChange` | `(value: string) => void` | - | Callback fired when the combined slot value changes |
| `pattern` | `RegExp` | `/^.$/` | Regex used to validate each entered character |
| `maxLength` | `number` | - | Optional cap for active slots used by keyboard and paste behavior |
| `name` | `string` | - | Optional field name (useful with form libraries) |
| `dir` | `'ltr' \| 'rtl'` | inherited | Local direction override |
| `ref` | `React.Ref` | Custom element to render instead of the default dot icon |
| `ref` | `React.Ref<HTMLDivElement>` | - | Ref forwarded to the separator div |
| `...props` | `React.HTMLProps<HTMLDivElement>` | - | Additional props to spread to the content div |

### MotionInputOTP

Same props as `InputOTP`. Adds scale+blur entrance animation on the entire OTP container. Requires the `motion` package.