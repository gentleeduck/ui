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
      <TypographyP>The king's subjects were not amused. They grumbled and complained, but the king was firm:</TypographyP>
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
