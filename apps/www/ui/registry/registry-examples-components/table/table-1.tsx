import { DuckTableHeader, DuckTableProvider, DuckTableSearch } from '@/registry/registry-ui-components/table'

export default function Table1Demo() {
  return (
    <>
      <DuckTableProvider>
        <DuckTableHeader></DuckTableHeader>
        <DuckTableSearch
          input={{
            trigger: {
              placeholder: 'Search...',
            },
          }}
        />
        content
      </DuckTableProvider>
    </>
  )
}
