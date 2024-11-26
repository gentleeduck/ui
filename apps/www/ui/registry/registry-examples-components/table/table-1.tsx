import { DuckTableHeader, DuckTableProvider } from '@/registry/registry-ui-components/table'

export default function Table1Demo() {
  return (
    <>
      <DuckTableProvider>
        <DuckTableHeader>header</DuckTableHeader>
        content
      </DuckTableProvider>
    </>
  )
}
