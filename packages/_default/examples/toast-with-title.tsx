"use client"

import { useToast } from "@/registry/default/hooks/use-toast"
import { Button } from "@/registry/default/ui/button"

export default function ToastWithTitle() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          description: "There was a problem with your request.",
          title: "Uh oh! Something went wrong.",
        })
      }}
      variant="outline"
    >
      Show Toast
    </Button>
  )
}
