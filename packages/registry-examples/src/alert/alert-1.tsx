import { Alert, AlertDescription, AlertTitle } from '@gentleduck/registry-ui/alert'
import { Terminal } from 'lucide-react'

export default function Demo() {
  return (
    <Alert>
      <Terminal aria-hidden="true" className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  )
}
