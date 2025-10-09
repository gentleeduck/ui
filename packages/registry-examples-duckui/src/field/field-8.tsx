import { Field, FieldDescription, FieldLabel, FieldSet } from '@gentleduck/registry-ui-duckui/field'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'

export default function FieldRadio() {
  return (
    <div className="w-full max-w-md">
      <FieldSet>
        <FieldLabel>Subscription Plan</FieldLabel>
        <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>
        <RadioGroup defaultValue="monthly">
          <Field orientation="horizontal">
            <RadioGroupItem id="plan-monthly" value="monthly" />
            <FieldLabel className="font-normal" htmlFor="plan-monthly">
              Monthly ($9.99/month)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="plan-yearly" value="yearly" />
            <FieldLabel className="font-normal" htmlFor="plan-yearly">
              Yearly ($99.99/year)
            </FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem id="plan-lifetime" value="lifetime" />
            <FieldLabel className="font-normal" htmlFor="plan-lifetime">
              Lifetime ($299.99)
            </FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </div>
  )
}
