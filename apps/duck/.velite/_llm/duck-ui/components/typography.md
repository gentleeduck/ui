```tsx title="components/typography-1.tsx"
// import from your project: import Demo from '@/components/typography-1'
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
} from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <div>
      <TypographyH1>The Joke Tax Chronicles</TypographyH1>
      <TypographyP>
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One
        day, his advisors came to him with a problem: the kingdom was running out of money.
      </TypographyP>
      <TypographyH2 className="mt-10">The King's Plan</TypographyH2>
      <TypographyP>
        The king thought long and hard, and finally came up with{' '}
        <a className="font-medium text-primary underline underline-offset-4" href="placeholder">
          a brilliant plan
        </a>
        : he would tax the jokes in the kingdom.
      </TypographyP>
      <TypographyBlockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
      </TypographyBlockquote>
      <TypographyH3 className="mt-8">The Joke Tax</TypographyH3>
      <TypographyP>
        The king's subjects were not amused. They grumbled and complained, but the king was firm:
      </TypographyP>
      <TypographyList>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners : 20 gold coins</li>
      </TypographyList>
      <TypographyP>
        As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who
        refused to let the king's foolishness get him down: a court jester named Jokester.
      </TypographyP>
      <TypographyH3 className="mt-8">Jokester's Revolt</TypographyH3>
      <TypographyP>
        Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under
        the king's pillow, in his soup, even in the royal toilet. The king was furious, but he couldn't seem to stop
        Jokester.
      </TypographyP>
      <TypographyP>
        And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they
        couldn't help but laugh. And once they started laughing, they couldn't stop.
      </TypographyP>
      <TypographyH3 className="mt-8">The People's Rebellion</TypographyH3>
      <TypographyP>
        The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the
        entire kingdom was in on the joke.
      </TypographyP>
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
      <TypographyP>
        The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
        Jokester was declared a hero, and the kingdom lived happily ever after.
      </TypographyP>
      <TypographyP>
        The moral of the story is: never underestimate the power of a good laugh and always be careful of bad ideas.
      </TypographyP>
    </div>
  )
}
```

## Philosophy

Typography *is* a system, not a single component. We ship a set of small, semantic wrappers — `TypographyH1`, `TypographyP`, `TypographyBlockquote`, `TypographyList`, `TypographyTable`, etc. — that render native HTML elements with a consistent set of utility classes. Your markup stays semantic, the bundle stays lean, and every `className` you pass is merged on top of the defaults via `cn()` so local overrides are trivial.

## Installation

  CLI
  Manual

```bash
npx @gentleduck/cli add typography
```

Install the following dependencies:

```bash
npm install @gentleduck/libs @gentleduck/motion
```

Copy and paste the following code into your project.

Update the import paths to match your project setup.

## Usage

```tsx
import {
  TypographyH1,
  TypographyP,
  TypographyBlockquote,
  TypographyList,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
} from '@/components/ui/typography'
```

```tsx
<TypographyH1>The Joke Tax Chronicles</TypographyH1>
<TypographyP>Once upon a time, in a far-off land, there was a very lazy king...</TypographyP>
```

## Examples

### h1

```tsx title="components/typography-2.tsx"
// import from your project: import Demo from '@/components/typography-2'
import { TypographyH1 } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyH1 className="text-balance text-center">Taxing Laughter: The Joke Tax Chronicles</TypographyH1>
}
```

### h2

```tsx title="components/typography-3.tsx"
// import from your project: import Demo from '@/components/typography-3'
import { TypographyH2 } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyH2>The People of the Kingdom</TypographyH2>
}
```

### h3

```tsx title="components/typography-4.tsx"
// import from your project: import Demo from '@/components/typography-4'
import { TypographyH3 } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyH3>The Joke Tax</TypographyH3>
}
```

### h4

```tsx title="components/typography-5.tsx"
// import from your project: import Demo from '@/components/typography-5'
import { TypographyH4 } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyH4>People stopped telling jokes</TypographyH4>
}
```

### p

```tsx title="components/typography-6.tsx"
// import from your project: import Demo from '@/components/typography-6'
import { TypographyP } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <TypographyP>
      The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax.
    </TypographyP>
  )
}
```

### blockquote

```tsx title="components/typography-7.tsx"
// import from your project: import Demo from '@/components/typography-7'
import { TypographyBlockquote } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <TypographyBlockquote>
      &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&apos;s only fair that they should pay for
      the privilege.&quot;
    </TypographyBlockquote>
  )
}
```

### table

```tsx title="components/typography-8.tsx"
// import from your project: import Demo from '@/components/typography-8'
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
```

### list

```tsx title="components/typography-9.tsx"
// import from your project: import Demo from '@/components/typography-9'
import { TypographyList } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <TypographyList>
      <li>1st level of puns: 5 gold coins</li>
      <li>2nd level of jokes: 10 gold coins</li>
      <li>3rd level of one-liners : 20 gold coins</li>
    </TypographyList>
  )
}
```

### Inline code

```tsx title="components/typography-10.tsx"
// import from your project: import Demo from '@/components/typography-10'
import { TypographyInlineCode } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyInlineCode>@gentleduck/primitives/alert-dialog</TypographyInlineCode>
}
```

### Lead

```tsx title="components/typography-11.tsx"
// import from your project: import Demo from '@/components/typography-11'
import { TypographyLead } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <TypographyLead>
      A modal dialog that interrupts the user with important content and expects a response.
    </TypographyLead>
  )
}
```

### Large

```tsx title="components/typography-12.tsx"
// import from your project: import Demo from '@/components/typography-12'
import { TypographyLarge } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyLarge>Are you absolutely sure?</TypographyLarge>
}
```

### Small

```tsx title="components/typography-13.tsx"
// import from your project: import Demo from '@/components/typography-13'
import { TypographySmall } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographySmall>Email address</TypographySmall>
}
```

### Muted

```tsx title="components/typography-14.tsx"
// import from your project: import Demo from '@/components/typography-14'
import { TypographyMuted } from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return <TypographyMuted>Enter your email address.</TypographyMuted>
}
```

## RTL Support

Every `Typography*` component inherits the RTL styles it needs from Tailwind's `rtl:` variant. Wrap the composition in an element with `dir="rtl"` (or set `DirectionProvider` at app/root level for global RTL/LTR) and the blockquote border, list indent, and table alignment automatically flip.

```tsx title="components/typography-15.tsx"
// import from your project: import Demo from '@/components/typography-15'
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyList,
  TypographyP,
  TypographyTable,
  TypographyTd,
  TypographyTh,
  TypographyTr,
} from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <div dir="rtl">
      <TypographyH1>{'سجلات ضريبة النكتة'}</TypographyH1>
      <TypographyP>
        {
          'في قديم الزمان، في أرض بعيدة، كان هناك ملك كسول جداً يقضي كل يومه مستلقياً على عرشه. في يوم من الأيام، جاء إليه مستشاروه بمشكلة: المملكة تنفد منها الأموال.'
        }
      </TypographyP>
      <TypographyH2 className="mt-10">{'خطة الملك'}</TypographyH2>
      <TypographyP>
        {'فكر الملك ملياً وطويلاً، وأخيراً توصل إلى '}
        <a className="font-medium text-primary underline underline-offset-4" href="placeholder">
          {'خطة عبقرية'}
        </a>
        {': سيفرض ضريبة على النكت في المملكة.'}
      </TypographyP>
      <TypographyBlockquote>
        {'قال: "في النهاية، الجميع يستمتع بنكتة جيدة، لذا من العدل أن يدفعوا مقابل هذا الامتياز."'}
      </TypographyBlockquote>
      <TypographyH3 className="mt-8">{'ضريبة النكتة'}</TypographyH3>
      <TypographyP>{'لم يكن رعايا الملك سعداء. تذمروا واشتكوا، لكن الملك كان حازماً:'}</TypographyP>
      <TypographyList>
        <li>{'المستوى الأول من التورية: 5 قطع ذهبية'}</li>
        <li>{'المستوى الثاني من النكت: 10 قطع ذهبية'}</li>
        <li>{'المستوى الثالث من الطرائف: 20 قطعة ذهبية'}</li>
      </TypographyList>
      <TypographyP>
        {
          'نتيجة لذلك، توقف الناس عن رواية النكت، وسقطت المملكة في كآبة. لكن كان هناك شخص واحد رفض الاستسلام لحماقة الملك: مهرج البلاط الملكي اسمه نكتجي.'
        }
      </TypographyP>
      <TypographyH3 className="mt-8">{'ثورة نكتجي'}</TypographyH3>
      <TypographyP>
        {
          'بدأ نكتجي يتسلل إلى القلعة في منتصف الليل ويترك النكت في كل مكان: تحت وسادة الملك، في حسائه، وحتى في المرحاض الملكي. كان الملك غاضباً، لكنه لم يستطع إيقاف نكتجي.'
        }
      </TypographyP>
      <TypographyP>
        {
          'وفي يوم من الأيام، اكتشف الناس أن النكت التي تركها نكتجي كانت مضحكة لدرجة أنهم لم يستطيعوا إلا الضحك. وبمجرد أن بدأوا بالضحك، لم يتمكنوا من التوقف.'
        }
      </TypographyP>
      <TypographyH3 className="mt-8">{'ثورة الشعب'}</TypographyH3>
      <TypographyP>
        {
          'شعب المملكة، الذي شعر بالبهجة من الضحك، بدأ يروي النكت والطرائف مرة أخرى، وسرعان ما انضمت المملكة بأكملها إلى النكتة.'
        }
      </TypographyP>
      <TypographyTable>
        <thead>
          <TypographyTr>
            <TypographyTh>{'خزينة الملك'}</TypographyTh>
            <TypographyTh>{'سعادة الشعب'}</TypographyTh>
          </TypographyTr>
        </thead>
        <tbody>
          <TypographyTr>
            <TypographyTd>{'فارغة'}</TypographyTd>
            <TypographyTd>{'فائضة'}</TypographyTd>
          </TypographyTr>
          <TypographyTr>
            <TypographyTd>{'متواضعة'}</TypographyTd>
            <TypographyTd>{'راضية'}</TypographyTd>
          </TypographyTr>
          <TypographyTr>
            <TypographyTd>{'ممتلئة'}</TypographyTd>
            <TypographyTd>{'في قمة السعادة'}</TypographyTd>
          </TypographyTr>
        </tbody>
      </TypographyTable>
      <TypographyP>
        {
          'الملك، عندما رأى مدى سعادة رعاياه، أدرك خطأه وألغى ضريبة النكتة. أُعلن نكتجي بطلاً، وعاشت المملكة في سعادة إلى الأبد.'
        }
      </TypographyP>
      <TypographyP>{'العبرة من القصة: لا تستهن أبداً بقوة الضحكة الجيدة، واحذر دائماً من الأفكار السيئة.'}</TypographyP>
    </div>
  )
}
```

## Motion

Use the `Motion*` variants for a staggered entrance animation powered by [motion](https://motion.dev). Each component accepts an `index` prop — the entrance is delayed by `index * 0.05s` so a full page of typography cascades in from bottom to top with a subtle slide + blur.

```tsx title="components/typography-16.tsx"
// import from your project: import Demo from '@/components/typography-16'
'use client'

import {
  MotionTypographyBlockquote,
  MotionTypographyH1,
  MotionTypographyH2,
  MotionTypographyH3,
  MotionTypographyList,
  MotionTypographyP,
} from '@gentleduck/registry-ui/typography'

export default function Demo() {
  return (
    <div>
      <MotionTypographyH1 index={0}>The Joke Tax Chronicles</MotionTypographyH1>
      <MotionTypographyP index={1}>
        Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne.
      </MotionTypographyP>
      <MotionTypographyH2 index={2} className="mt-10">
        The King's Plan
      </MotionTypographyH2>
      <MotionTypographyP index={3}>
        The king thought long and hard, and finally came up with a brilliant plan.
      </MotionTypographyP>
      <MotionTypographyBlockquote index={4}>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
      </MotionTypographyBlockquote>
      <MotionTypographyH3 index={5} className="mt-8">
        The Joke Tax
      </MotionTypographyH3>
      <MotionTypographyP index={6}>
        The king's subjects were not amused. They grumbled and complained, but the king was firm:
      </MotionTypographyP>
      <MotionTypographyList index={7}>
        <li>1st level of puns: 5 gold coins</li>
        <li>2nd level of jokes: 10 gold coins</li>
        <li>3rd level of one-liners: 20 gold coins</li>
      </MotionTypographyList>
    </div>
  )
}
```

}>
Requires the `motion` package. Each `Motion*` component uses the shared `slideUp` preset with a `springBouncy` transition and `delay: index * 0.05`.

## API Reference

### Typography components

Every base `Typography*` component is a thin `forwardRef` wrapper around the matching HTML element that merges a pre-set `className` with the one you pass in. All accept the native element's props.

| Component | Element | Classes |
| --- | --- | --- |
| `TypographyH1` | `h1` | `scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl` |
| `TypographyH2` | `h2` | `scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0` |
| `TypographyH3` | `h3` | `scroll-m-20 font-semibold text-2xl tracking-tight` |
| `TypographyH4` | `h4` | `scroll-m-20 font-semibold text-xl tracking-tight` |
| `TypographyP` | `p` | `leading-7 [&:not(:first-child)]:mt-6` |
| `TypographyBlockquote` | `blockquote` | `mt-6 border-l-2 pl-6 italic` (flips in RTL) |
| `TypographyList` | `ul` | `my-6 ml-6 list-disc [&>li]:mt-2` (flips in RTL) |
| `TypographyInlineCode` | `code` | `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm` |
| `TypographyLead` | `p` | `text-muted-foreground text-xl` |
| `TypographyLarge` | `div` | `font-semibold text-lg` |
| `TypographySmall` | `small` | `font-medium text-sm leading-none` |
| `TypographyMuted` | `p` | `text-muted-foreground text-sm` |
| `TypographyTable` | `div > table` | wrapper + `w-full` (accepts `wrapperClassName` for the outer div) |
| `TypographyTr` | `tr` | `m-0 border-t p-0 even:bg-muted` |
| `TypographyTh` | `th` | `border px-4 py-2 text-left font-bold rtl:text-right` |
| `TypographyTd` | `td` | `border px-4 py-2 text-left rtl:text-right` |

### Motion variants

Every `Motion*` variant supports all the props of its base component plus an optional `index` prop.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `index` | `number` | `0` | Stagger delay multiplier. Entrance delay is `index * 0.05s`. |
| `...props` | base component props | - | All props from the base `Typography*` are supported (drag handlers omitted for motion type safety) |