import { TypographyTable, TypographyTd, TypographyTh, TypographyTr } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <TypographyTable>
      <thead>
        <TypographyTr>
          <TypographyTh>King's Treasury</TypographyTh>
          <TypographyTh>People's happiness</TypographyTh>
        </TypographyTr>
      </thead>
      <tbody>
        <TypographyTr>
          <TypographyTd>Empty</TypographyTd>
          <TypographyTd>Overflowing</TypographyTd>
        </TypographyTr>
        <TypographyTr>
          <TypographyTd>Modest</TypographyTd>
          <TypographyTd>Satisfied</TypographyTd>
        </TypographyTr>
        <TypographyTr>
          <TypographyTd>Full</TypographyTd>
          <TypographyTd>Ecstatic</TypographyTd>
        </TypographyTr>
      </tbody>
    </TypographyTable>
  )
}
