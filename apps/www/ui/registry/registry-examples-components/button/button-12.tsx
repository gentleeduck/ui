import React from 'react'
import { Button } from '@/registry/registry-ui-components/button'
import { Inbox } from 'lucide-react'

export default function Button12Demo() {
    return (
        <>
            <Button
                aria-label="Inbox button with 23 notifications"
                type="button"
                role="button"
                icon={{ children: Inbox }}
                label={{
                    // variant: 'secondary',
                    children: '23',
                }}
            >
                Button
            </Button>
        </>
    )
}
