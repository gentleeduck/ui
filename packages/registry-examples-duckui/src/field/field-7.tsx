import { Checkbox } from '@gentleduck/registry-ui-duckui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@gentleduck/registry-ui-duckui/field'

export default function FieldCheckbox() {
  return (
    <div className="w-full max-w-md">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">Show these items on the desktop</FieldLegend>
          <FieldDescription>Select the items you want to show on the desktop.</FieldDescription>
          <FieldGroup className="gap-3">
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-hard-disks-ljj" />
              <FieldLabel className="font-normal" defaultChecked htmlFor="finder-pref-9k2-hard-disks-ljj">
                Hard disks
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-external-disks-1yg" />
              <FieldLabel className="font-normal" htmlFor="finder-pref-9k2-external-disks-1yg">
                External disks
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-cds-dvds-fzt" />
              <FieldLabel className="font-normal" htmlFor="finder-pref-9k2-cds-dvds-fzt">
                CDs, DVDs, and iPods
              </FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="finder-pref-9k2-connected-servers-6l2" />
              <FieldLabel className="font-normal" htmlFor="finder-pref-9k2-connected-servers-6l2">
                Connected servers
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <Field orientation="horizontal">
          <Checkbox defaultChecked id="finder-pref-9k2-sync-folders-nep" />
          <FieldContent>
            <FieldLabel htmlFor="finder-pref-9k2-sync-folders-nep">Sync Desktop & Documents folders</FieldLabel>
            <FieldDescription>
              Your Desktop & Documents folders are being synced with iCloud Drive. You can access them from other
              devices.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>
    </div>
  )
}
