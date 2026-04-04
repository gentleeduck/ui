import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '@gentleduck/registry-ui/field'
import { Input } from '@gentleduck/registry-ui/input'

export default function Demo() {
  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" placeholder="Max Leiter" type="text" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            <Input id="password" placeholder="********" type="password" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </div>
  )
}
