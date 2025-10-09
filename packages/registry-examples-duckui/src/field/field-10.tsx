import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from '@gentleduck/registry-ui-duckui/field'
import { RadioGroup, RadioGroupItem } from '@gentleduck/registry-ui-duckui/radio-group'

export default function FieldChoiceCard() {
  return (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLabel htmlFor="compute-environment-p8w">Compute Environment</FieldLabel>
          <FieldDescription>Select the compute environment for your cluster.</FieldDescription>
          <RadioGroup defaultValue="kubernetes">
            <FieldLabel htmlFor="kubernetes-r2h">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>Run GPU workloads on a K8s configured cluster.</FieldDescription>
                </FieldContent>
                <RadioGroupItem id="kubernetes-r2h" value="kubernetes" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="vm-z4k">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual Machine</FieldTitle>
                  <FieldDescription>Access a VM configured cluster to run GPU workloads.</FieldDescription>
                </FieldContent>
                <RadioGroupItem id="vm-z4k" value="vm" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}
