'use client'
import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Calendar } from 'lucide-react'
import React from 'react'

// async
export default function index() {
  // <Upload1Demo />
  return (
    <div className="w-fit container">
      <div className="flex items-center gap-2">
        <Button variant="outline" className="rounded-lg" icon={<Calendar />}>
          Meetings
        </Button>
      </div>
    </div>
  )
  //   // <div className="container xl:border-x  max-w-screen-2xl border-b h-screen pt-8">
  // </div>
}
