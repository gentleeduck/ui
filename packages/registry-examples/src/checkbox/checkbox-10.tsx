'use client'

import { MotionCheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'

export default function Demo() {
  return (
    <div className="flex flex-col gap-3">
      <MotionCheckboxWithLabel id="terms" _checkbox={{}} _label={{ children: 'Accept terms and conditions' }} index={0} />
      <MotionCheckboxWithLabel
        id="updates"
        _checkbox={{ defaultChecked: true }}
        _label={{ children: 'Send me updates' }}
        index={1}
      />
      <MotionCheckboxWithLabel
        id="marketing"
        _checkbox={{}}
        _label={{ children: 'Receive marketing emails' }}
        index={2}
      />
    </div>
  )
}
