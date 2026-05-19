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
