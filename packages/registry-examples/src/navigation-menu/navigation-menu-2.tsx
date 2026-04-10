'use client'

import { cn } from '@gentleduck/libs/cn'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@gentleduck/registry-ui/navigation-menu'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

const components: { title: string; href: string; description: string }[] = [
  {
    description: 'نافذة حوار تقاطع المستخدم بمحتوى مهم وتتطلب استجابة.',
    href: '/docs/components/alert-dialog',
    title: 'نافذة التنبيه',
  },
  {
    description: 'لمعاينة المحتوى المتاح خلف رابط للمستخدمين المبصرين.',
    href: '/docs/components/hover-card',
    title: 'بطاقة التمرير',
  },
  {
    description: 'يعرض مؤشرا يوضح تقدم اكتمال مهمة، وعادة ما يظهر كشريط تقدم.',
    href: '/docs/components/progress',
    title: 'شريط التقدم',
  },
  {
    description: 'يفصل المحتوى بصريا او دلاليا.',
    href: '/docs/components/scroll-area',
    title: 'منطقة التمرير',
  },
  {
    description: 'مجموعة من اقسام المحتوى المتراكبة -- المعروفة بلوحات التبويب -- تعرض واحدة في كل مرة.',
    href: '/docs/components/tabs',
    title: 'التبويبات',
  },
  {
    description: 'نافذة منبثقة تعرض معلومات متعلقة بعنصر عند تركيز لوحة المفاتيح عليه او تمرير الفأرة فوقه.',
    href: '/docs/components/tooltip',
    title: 'تلميح الادوات',
  },
]

export default function Demo() {
  return (
    <NavigationMenu dir="rtl">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>البدء</NavigationMenuTrigger>
          <NavigationMenuContent className="md:right-auto md:left-0">
            <ul className="flex gap-3 p-6">
              <NavigationMenuLink asChild className="w-[350px] rounded-md bg-muted">
                <a
                  className="flex h-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                  href="/">
                  <Image
                    alt="Logo"
                    className="object-contain"
                    height={100}
                    src="https://zpgqhogoevbgpxustvmo.supabase.co/storage/v1/object/public/produc_imgs/duckui%20(1).png"
                    width={100}
                  />
                  <div className="mt-4 mb-2 font-medium text-lg">duck/ui</div>
                  <p className="text-muted-foreground text-sm leading-tight">
                    مكونات مصممة بعناية يمكنك نسخها ولصقها في تطبيقاتك. سهلة الوصول. قابلة للتخصيص. مفتوحة المصدر.
                  </p>
                </a>
              </NavigationMenuLink>
              <div className="flex flex-col gap-2">
                <ListItem href="/docs" title="مقدمة">
                  مكونات قابلة لاعادة الاستخدام مبنية باستخدام Radix UI و Tailwind CSS.
                </ListItem>
                <ListItem href="/docs/installation" title="التثبيت">
                  كيفية تثبيت التبعيات وهيكلة تطبيقك.
                </ListItem>
                <ListItem href="/docs/components/typography" title="الخطوط">
                  انماط العناوين والفقرات والقوائم...الخ
                </ListItem>
              </div>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>المكونات</NavigationMenuTrigger>
          <NavigationMenuContent className="md:right-auto md:left-0">
            <ul className="grid w-[500px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[500px]">
              {components.map((component) => (
                <ListItem href={component.href} key={component.title} title={component.title}>
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>التوثيق</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<React.ComponentRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            ref={ref}
            {...props}>
            <div className="font-medium text-sm leading-none">{title}</div>
            <p className="line-clamp-2 text-muted-foreground text-sm leading-snug">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'
