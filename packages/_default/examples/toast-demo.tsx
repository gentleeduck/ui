"use client"

import { useToast } from "@/registry/default/hooks/use-toast"
import { Button } from "@/registry/default/ui/button"
import { ToastAction } from "@/registry/default/ui/toast"

export default function ToastDemo() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
          description: "Friday, February 10, 2023 at 5:57 PM",
          title: "Scheduled: Catch up ",
        })
      }}
      variant="outline"
    >
      Add to calendar
    </Button>
  )
}
