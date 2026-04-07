'use client'

import { MotionCheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <MotionCheckboxWithLabel
        id="motion-privacy"
        _checkbox={{}}
        _label={{ children: 'Accept privacy policy' }}
        index={0}
      />
      <MotionCheckboxWithLabel
        id="motion-newsletter"
        _checkbox={{ defaultChecked: true }}
        _label={{ children: 'Subscribe to newsletter' }}
        index={1}
      />
      <MotionCheckboxWithLabel
        id="motion-analytics"
        _checkbox={{}}
        _label={{ children: 'Allow usage analytics' }}
        index={2}
      />
    </div>
  )
}
