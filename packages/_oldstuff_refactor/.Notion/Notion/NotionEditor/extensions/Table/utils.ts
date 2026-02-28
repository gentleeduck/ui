// @ts-nocheck
import { findParentNode } from '@tiptap/core'
import { Node, ResolvedPos } from '@tiptap/pm/model'
import { Selection, Transaction } from '@tiptap/pm/state'
import { CellSelection, TableMap } from '@tiptap/pm/tables'

export const isRectSelected = (rect: any) => (selection: CellSelection) => {
  const map = TableMap.get(selection.$anchorCell.node(-1))
  const start = selection.$anchorCell.start(-1)
  const cells = map.cellsInRect(rect)
  const selectedCells = map.cellsInRect(
    map.rectBetween(selection.$anchorCell.pos - start, selection.$headCell.pos - start),
  )

  for (let i = 0, count = cells.length; i < count; i += 1) {
    if (selectedCells.indexOf(cells[i]) === -1) {
      return false
    }
  }

  return true
}

export const findTable = (selection: Selection) =>
  findParentNode((node) => node.type.spec.tableRole && node.type.spec.tableRole === 'table')(selection)

export const isCellSelection = (selection: any) => selection instanceof CellSelection

export const isColumnSelected = (columnIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1))

    return isRectSelected({
      bottom: map.height,
      left: columnIndex,
      right: columnIndex + 1,
      top: 0,
    })(selection)
  }

  return false
}

export const isRowSelected = (rowIndex: number) => (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1))

    return isRectSelected({
      bottom: rowIndex + 1,
      left: 0,
      right: map.width,
      top: rowIndex,
    })(selection)
  }

  return false
}

export const isTableSelected = (selection: any) => {
  if (isCellSelection(selection)) {
    const map = TableMap.get(selection.$anchorCell.node(-1))

    return isRectSelected({
      bottom: map.height,
      left: 0,
      right: map.width,
      top: 0,
    })(selection)
  }

  return false
}

export const getCellsInColumn = (columnIndex: number | number[]) => (selection: Selection) => {
  const table = findTable(selection)
  if (table) {
    const map = TableMap.get(table.node)
    const indexes = Array.isArray(columnIndex) ? columnIndex : Array.from([columnIndex])

    return indexes.reduce(
      (acc, index) => {
        if (index >= 0 && index <= map.width - 1) {
          const cells = map.cellsInRect({
            bottom: map.height,
            left: index,
            right: index + 1,
            top: 0,
          })

          return acc.concat(
            cells.map((nodePos) => {
              const node = table.node.nodeAt(nodePos)
              const pos = nodePos + table.start

              return { node, pos, start: pos + 1 }
            }),
          )
        }

        return acc
      },
      [] as { pos: number; start: number; node: Node | null | undefined }[],
    )
  }
  return null
}

export const getCellsInRow = (rowIndex: number | number[]) => (selection: Selection) => {
  const table = findTable(selection)

  if (table) {
    const map = TableMap.get(table.node)
    const indexes = Array.isArray(rowIndex) ? rowIndex : Array.from([rowIndex])

    return indexes.reduce(
      (acc, index) => {
        if (index >= 0 && index <= map.height - 1) {
          const cells = map.cellsInRect({
            bottom: index + 1,
            left: 0,
            right: map.width,
            top: index,
          })

          return acc.concat(
            cells.map((nodePos) => {
              const node = table.node.nodeAt(nodePos)
              const pos = nodePos + table.start
              return { node, pos, start: pos + 1 }
            }),
          )
        }

        return acc
      },
      [] as { pos: number; start: number; node: Node | null | undefined }[],
    )
  }

  return null
}

export const getCellsInTable = (selection: Selection) => {
  const table = findTable(selection)

  if (table) {
    const map = TableMap.get(table.node)
    const cells = map.cellsInRect({
      bottom: map.height,
      left: 0,
      right: map.width,
      top: 0,
    })

    return cells.map((nodePos) => {
      const node = table.node.nodeAt(nodePos)
      const pos = nodePos + table.start

      return { node, pos, start: pos + 1 }
    })
  }

  return null
}

export const findParentNodeClosestToPos = ($pos: ResolvedPos, predicate: (node: Node) => boolean) => {
  for (let i = $pos.depth; i > 0; i -= 1) {
    const node = $pos.node(i)

    if (predicate(node)) {
      return {
        depth: i,
        node,
        pos: i > 0 ? $pos.before(i) : 0,
        start: $pos.start(i),
      }
    }
  }

  return null
}

export const findCellClosestToPos = ($pos: ResolvedPos) => {
  const predicate = (node: Node) => node.type.spec.tableRole && /cell/i.test(node.type.spec.tableRole)

  return findParentNodeClosestToPos($pos, predicate)
}

const select = (type: 'row' | 'column') => (index: number) => (tr: Transaction) => {
  const table = findTable(tr.selection)
  const isRowSelection = type === 'row'

  if (table) {
    const map = TableMap.get(table.node)

    // Check if the index is valid
    if (index >= 0 && index < (isRowSelection ? map.height : map.width)) {
      const left = isRowSelection ? 0 : index
      const top = isRowSelection ? index : 0
      const right = isRowSelection ? map.width : index + 1
      const bottom = isRowSelection ? index + 1 : map.height

      const cellsInFirstRow = map.cellsInRect({
        bottom: isRowSelection ? top + 1 : bottom,
        left,
        right: isRowSelection ? right : left + 1,
        top,
      })

      const cellsInLastRow =
        bottom - top === 1
          ? cellsInFirstRow
          : map.cellsInRect({
              bottom,
              left: isRowSelection ? left : right - 1,
              right,
              top: isRowSelection ? bottom - 1 : top,
            })

      const head = table.start + cellsInFirstRow[0]
      const anchor = table.start + cellsInLastRow[cellsInLastRow.length - 1]
      const $head = tr.doc.resolve(head)
      const $anchor = tr.doc.resolve(anchor)

      // @ts-ignore
      return tr.setSelection(new CellSelection($anchor, $head))
    }
  }
  return tr
}

export const selectColumn = select('column')

export const selectRow = select('row')

export const selectTable = (tr: Transaction) => {
  const table = findTable(tr.selection)

  if (table) {
    const { map } = TableMap.get(table.node)

    if (map && map.length) {
      const head = table.start + map[0]
      const anchor = table.start + map[map.length - 1]
      const $head = tr.doc.resolve(head)
      const $anchor = tr.doc.resolve(anchor)

      // @ts-ignore
      return tr.setSelection(new CellSelection($anchor, $head))
    }
  }

  return tr
}
