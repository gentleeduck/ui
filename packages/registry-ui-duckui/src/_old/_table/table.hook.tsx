// @ts-noCheck
import React from 'react'
import { DuckTableContext } from './table-advanced'
import { DuckTableContextType } from './table-advanced.types'

export const useDuckTable = <
  Column extends Record<string, unknown> = Record<string, unknown>,
>(): DuckTableContextType<Column> | null => {
  const context = React.useContext(DuckTableContext)
  if (!context) {
    throw new Error('useTableProvider must be used within an TableProvider')
  }
  return context
}

// <TableRow key={idx}>
//                  {tableDataFiltered.map(([key, value], idx) => {
//                    const headersEntries = headers.map(
//                      item => item.label.toString().toLowerCase() ?? item.children?.toString().toLowerCase()
//                    )
//                    const { className, children, withLabel, ...props } = value
//                    const {
//                      className: labelClassName,
//                      children: labelChildren,
//                      type: labelType = 'default',
//                      ...labelProps
//                    } = item?.[key]?.withLabel ?? {}
//
//                    return (
//                      headersEntries.includes(key.toString().toLowerCase()) && (
//                        <TableCell
//                          key={key}
//                          className={cn('py-2 h-[50px]', selected.includes(item) && 'bg-muted', className)}
//                          {...props}
//                        >
//                          <div
//                            className={cn(
//                              'items-center gap-2 flex w-full',
//                              headers?.[idx]?.className,
//                              className,
//                              idx === headersEntries.length - 1 && dropdownMenu && 'justify-between w-full'
//                            )}
//                          >
//                            {/*NOTE: Rendering Checkbox */}
//                            {selection && idx === 0 && (
//                              <Checkbox
//                                className="border-border"
//                                onClick={() =>
//                                  setSelected(
//                                    selected.includes(item) ? selected.filter(i => i !== item) : [...selected, item]
//                                  )
//                                }
//                                checked={selected.includes(item)}
//                              />
//                            )}
//
//                            {/*NOTE: Rendering Label */}
//                            {labelChildren && (
//                              <Badge
//                                variant={'outline'}
//                                size={'sm'}
//                                className={cn(labelType === 'default' ? '' : 'bg-red-500', labelClassName)}
//                                {...labelProps}
//                              >
//                                {labelChildren}
//                              </Badge>
//                            )}
//
//                            <div className="flex items-center gap-2 text-ellipsis overflow-hidden whitespace-nowrap">
//                              {/*NOTE: Getting Icons from Filter Data */}
//                              {filtersData?.length &&
//                                filtersData?.map(item => {
//                                  return item?.content?.data.map((item, idx) => {
//                                    const { children: Icon, ...props } = item?.element?.icon ?? {}
//                                    return item.label?.toString().toLowerCase() ===
//                                      (children as string).toString().toLowerCase() ? (
//                                      <span
//                                        className="whitespace-nowrap"
//                                        key={idx}
//                                      >
//                                        {(Icon ? <Icon {...props} /> : '') as React.ReactNode}
//                                      </span>
//                                    ) : null
//                                  })
//                                })}
//
//                              {/*NOTE: Rendering the row column childrend */}
//                              <span className="text-ellipsis overflow-hidden whitespace-nowrap">{children}</span>
//                            </div>
//                            {/*NOTE: Dropdown Menu */}
//                            {idx === headersEntries.length - 1 && dropdownMenu.optionsData?.length && (
//                              <DropdownMenuView
//                                trigger={{
//                                  className: 'flex h-8 w-8 p-0 data-[state=open]:bg-muted',
//                                  children: <span className="sr-only">Open menu</span>,
//                                  variant: 'ghost',
//                                  size: 'icon',
//                                  icon: {
//                                    children: Ellipsis,
//                                    className: 'h-4 w-4',
//                                  },
//                                }}
//                                content={{
//                                  align: 'end',
//                                  options: dropdownMenu,
//                                }}
//                              />
//                            )}
//                          </div>
//                        </TableCell>
//                      )
//                    )
//                  })}
//                </TableRow>
//
