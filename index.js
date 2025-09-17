function outer() {
  let bigData = new Array(1000000).fill('data')
  return function inner() {
    console.log(bigData[0])
    bigData = null
  }
}

// 1
const hi = outer()
console.log(hi())
// 2
console.log(hi())
