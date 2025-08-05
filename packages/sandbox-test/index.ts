// import { type } from 'arktype'
//
// const User = type({
//   name: '(string | number)[]',
//   platform: "'android' | 'ios'",
//   'versions?': 'string | number | null',
// })
//
// function h(args) {
//   return {
//     // name: 'ahmed',
//     // age: 25,
//     ...args,
//   }
// }
//
//
//

const user = {
  name: 'ahmed',
  age: 25,
}

// cli.ts
import readline from 'node:readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('Enter a number (or leave blank to simulate undefined): ', (answer) => {
  const maybeNumber: string | null = answer.trim() === '' ? null : answer

  const unsafeNumber = maybeNumber as string

  console.log('maybeNumber:', maybeNumber)
  console.log('unsafeNumber:', unsafeNumber)
  console.log('unsafeNumber + 1:', unsafeNumber + 1) // Will be NaN or crash at runtime if undefined

  rl.close()
})
