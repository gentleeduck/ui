import { Field, FieldContent, FieldDescription, FieldLabel } from '@gentleduck/registry-ui-duckui/field'
import { Switch } from '@gentleduck/registry-ui-duckui/switch'

export default function FieldSwitch() {
  return (
    <div className="w-full max-w-md">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="2fa">Multi-factor authentication</FieldLabel>
          <FieldDescription>
            Enable multi-factor authentication. If you do not have a two-factor device, you can use a one-time code sent
            to your email.
          </FieldDescription>
        </FieldContent>
        <Switch id="2fa" />
      </Field>
    </div>
  )
}
