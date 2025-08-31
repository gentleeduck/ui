import { Button } from '@gentleduck/registry-ui-duckui/button'
import { Icons } from '~/components/icons'

export function TailwindIndicator() {
  return (
    <Button
      className="fixed bottom-4 left-4 z-50 flex items-center rouned-full group transition-all bg-primary px-1 rounded-md hover:pr-5 h-8"
      icon={<Icons.logo className="size-6 relative z-10" />}
      animationIcon={{
        icon: (
          <div className="items-center justify-center font-mono text-sm text-semibold [&>div]:justify-start justify-start">
            <div className="block sm:hidden">xs</div>
            <div className="hidden sm:block md:hidden">sm</div>
            <div className="hidden md:block lg:hidden">md</div>
            <div className="hidden lg:block xl:hidden">lg</div>
            <div className="hidden xl:block 2xl:hidden">xl</div>
            <div className="hidden 2xl:block">2xl</div>
          </div>
        ),
        iconPlacement: 'right',
      }}></Button>
  )
}
