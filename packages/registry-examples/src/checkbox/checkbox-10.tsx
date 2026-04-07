'use client'

import { MotionCheckbox, MotionCheckboxWithLabel } from '@gentleduck/registry-ui/checkbox'
import { Label } from '@gentleduck/registry-ui/label'
import * as React from 'react'

export default function Demo() {
  const [tasks, setTasks] = React.useState([
    { id: 'motion-design', label: 'Design system review', checked: true },
    { id: 'motion-tests', label: 'Write integration tests', checked: false },
    { id: 'motion-deploy', label: 'Deploy to staging', checked: false },
  ])

  const allChecked = tasks.every((t) => t.checked)
  const someChecked = tasks.some((t) => t.checked) && !allChecked
  const parentState = allChecked ? true : someChecked ? ('indeterminate' as const) : false

  const toggleAll = () => {
    const next = !allChecked
    setTasks((prev) => prev.map((t) => ({ ...t, checked: next })))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 border-b pb-3">
        <MotionCheckbox checked={parentState} onCheckedChange={toggleAll} id="motion-parent" />
        <Label htmlFor="motion-parent" className="cursor-pointer font-medium">
          Select all tasks
        </Label>
      </div>
      <div className="flex flex-col gap-2 ps-6">
        {tasks.map((task, i) => (
          <MotionCheckboxWithLabel
            key={task.id}
            id={task.id}
            index={i}
            _checkbox={{
              checked: task.checked,
              onCheckedChange: (next) =>
                setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, checked: !!next } : t))),
            }}
            _label={{ children: task.label }}
          />
        ))}
      </div>
    </div>
  )
}
