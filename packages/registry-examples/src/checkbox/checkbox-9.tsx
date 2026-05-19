'use client'

import { Checkbox } from '@gentleduck/registry-ui/checkbox'
import { DirectionProvider } from '@gentleduck/registry-ui/direction'
import { Label } from '@gentleduck/registry-ui/label'

export default function Demo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex flex-col gap-6" dir="rtl">
        <div className="flex items-center gap-3">
          <Checkbox id="terms" />
          <Label htmlFor="terms">قبول الشروط والاحكام</Label>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox defaultChecked id="terms-2" />
          <div className="grid gap-2">
            <Label htmlFor="terms-2">قبول الشروط والاحكام</Label>
            <p className="text-muted-foreground text-sm">بالنقر على هذا المربع، فانك توافق على الشروط والاحكام.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Checkbox disabled id="toggle" />
          <Label htmlFor="toggle">تفعيل الاشعارات</Label>
        </div>
        <Label className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
          <Checkbox
            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
            defaultChecked
            id="toggle-2"
          />
          <div className="grid gap-1.5 font-normal">
            <p className="font-medium text-sm leading-none">تفعيل الاشعارات</p>
            <p className="text-muted-foreground text-sm">يمكنك تفعيل او تعطيل الاشعارات في اي وقت.</p>
          </div>
        </Label>
      </div>
    </DirectionProvider>
  )
}
