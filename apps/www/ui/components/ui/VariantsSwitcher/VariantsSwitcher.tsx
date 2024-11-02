import { cn } from '@/lib/cn'
import { Button } from '@/registry/registry-ui-components'
import {
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@/registry/default/ui'
import { Settings } from 'lucide-react'
import { buttonVarieties } from '@/hooks/use-varieties'
import { useAtom } from 'jotai'
import {
  sizes,
  typesAllowedForCollapse,
  typesAllowedForDuration,
  typesAllowedForGroup,
  typesAllowedForLabel,
  typesAllowedForLoading,
  typesAllowedForTitle,
  typesAllowedForVariant,
  variants,
} from './Variants.local'

export function VariantsSwitcher({ type, showSettrings }: { type: string; showSettrings: boolean }) {
  const [varieties, setVarieties] = useAtom(buttonVarieties)
  const types = [
    ...typesAllowedForVariant,
    ...typesAllowedForTitle,
    ...typesAllowedForLabel,
    ...typesAllowedForLoading,
    ...typesAllowedForCollapse,
    ...typesAllowedForDuration,
  ]
  // && showSettrings
  return types.includes(type) && showSettrings ? (
    <Popover onOpenChange={() => {}}>
      <PopoverTrigger asChild>
        <Button
          is_collapsed={true}
          icon={{ children: Settings }}
          title="Settings"
          className="[&_svg]:h-4 [&_svg]:w-4 w-7 h-7"
          variant="outline"
          size="icon"
        />
      </PopoverTrigger>
      <PopoverContent className="mx-2 flex flex-col gap-2 w-fit">
        {typesAllowedForVariant.includes(type) && type ? (
          <Select
            value={varieties.default.variety?.variant as string}
            onValueChange={(value: string) => {
              setVarieties({ default: { variety: { ...varieties.default.variety, variant: value as 'link' } } })
            }}
          >
            <SelectTrigger className={cn('text-sm h-7 w-[175px] [&_svg]:h-4 [&_svg]:w-4')}>
              <span className="text-muted-foreground">variant : </span>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {variants.map(
                variant =>
                  (type === 'BadgeMainDemo' && !['link', 'ghost'].includes(variant)) ||
                  (type === 'ButtonMainDemo' && (
                    <SelectItem
                      key={variant}
                      value={variant}
                      className="text-xs"
                    >
                      {variant}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        ) : null}

        {typesAllowedForVariant.includes(type) && type ? (
          <Select
            value={varieties.default.variety?.size as string}
            onValueChange={(value: string) => {
              setVarieties({
                default: { variety: { ...varieties.default.variety, size: value as 'default' } },
              })
            }}
          >
            <SelectTrigger className={cn('text-sm h-7 w-[175px] [&_svg]:h-4 [&_svg]:w-4')}>
              <span className="text-muted-foreground">size : </span>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map(variant => (
                <SelectItem
                  key={variant}
                  value={variant}
                  className="text-xs"
                >
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        {typesAllowedForTitle.includes(type) && type ? (
          <Input
            placeholder="Enter Title"
            value={varieties.default.variety?.title}
            className="w-[175px] h-7 text-sm placeholder:text-[.8rem]"
            onChange={({ currentTarget }) =>
              setVarieties({ default: { variety: { ...varieties.default.variety, title: currentTarget.value } } })
            }
          />
        ) : null}

        {typesAllowedForDuration.includes(type) && type ? (
          <Input
            placeholder="Enter label"
            value={varieties.default.variety?.duration}
            className="w-[175px] h-7 text-sm placeholder:text-[.8rem]"
            type="number"
            min={0}
            onChange={({ currentTarget }) =>
              setVarieties({ default: { variety: { ...varieties.default.variety, duration: +currentTarget.value } } })
            }
          />
        ) : null}

        {typesAllowedForLabel.includes(type) && type ? (
          <Input
            placeholder="Enter label"
            value={varieties.default.variety?.label}
            className="w-[175px] h-7 text-sm placeholder:text-[.8rem]"
            type="number"
            min={0}
            onChange={({ currentTarget }) =>
              setVarieties({ default: { variety: { ...varieties.default.variety, label: currentTarget.value } } })
            }
          />
        ) : null}

        {typesAllowedForGroup.includes(type) && type ? (
          <div className="flex items-center justify-between px-2 min-w-[200px]">
            <Label
              htmlFor="is-collapsed"
              className="text-xs"
            >
              Group Nav
            </Label>
            <Input
              placeholder="Enter group separated by comma"
              value={varieties.default.variety?.group?.join(',')}
              className="w-[105px] h-7 text-sm placeholder:text-[.8rem]"
              min={0}
              onChange={({ currentTarget }) =>
                setVarieties({
                  default: {
                    variety: {
                      ...varieties.default.variety,
                      group: currentTarget.value.split(',').map(a => +a) as [number, number],
                    },
                  },
                })
              }
            />
          </div>
        ) : null}

        {typesAllowedForCollapse.includes(type) && type ? (
          <div className="flex items-center justify-between px-2 min-w-[200px]">
            <Label
              htmlFor="is-collapsed"
              className="text-xs"
            >
              Is isCollapsed
            </Label>
            <Switch
              id="is-collapsed"
              className="h-5 [&_span]:w-4 [&_span]:h-4 w-8 data-[state=checked]:[&_span]:translate-x-[.75rem]"
              checked={varieties.default.variety?.open}
              onCheckedChange={() => {
                setVarieties({
                  default: { variety: { ...varieties.default.variety, open: !varieties.default.variety?.open } },
                })
              }}
            />
          </div>
        ) : null}

        {typesAllowedForLoading.includes(type) && type ? (
          <div className="flex items-center justify-between px-2">
            <Label
              htmlFor="loading"
              className="text-xs"
            >
              Is Loading
            </Label>
            <Switch
              id="loading"
              className="h-5 [&_span]:w-4 [&_span]:h-4 w-8 data-[state=checked]:[&_span]:translate-x-[.75rem]"
              checked={varieties.default.variety?.loading}
              onCheckedChange={() => {
                setVarieties({
                  default: {
                    variety: { ...varieties.default.variety, loading: !varieties.default.variety?.loading },
                  },
                })
              }}
            />
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  ) : (
    <div> </div>
  )
}
