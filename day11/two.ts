import * as R from 'npm:remeda'

const parseStones = (stones: {}) => {
  const newStones = {}
  for (const [number, count] of Object.entries(stones)) {
    const stringVal = number.toString()

    if (parseInt(number) === 0) {
      if (!newStones[1]) {
        newStones[1] = 0
      }
      newStones[1]  += count
    } else if (stringVal.length % 2 === 0) {
      const sub1 = stringVal.substring(0, stringVal.length / 2)
      const sub2 = stringVal.substring(stringVal.length / 2, stringVal.length)
      if (!newStones[parseInt(sub1)]) {
        newStones[parseInt(sub1)] = 0
      }
      if (!newStones[parseInt(sub2)]) {
        newStones[parseInt(sub2)] = 0
      }

      newStones[parseInt(sub1)] += count
      newStones[parseInt(sub2)] += count
    } else {
      if (!newStones[number * 2024]) {
        newStones[number * 2024] = 0
      }
      newStones[number * 2024] += count
    }
  }

  return newStones
}

let stones = Object.fromEntries(
  Deno.readTextFileSync('input.txt')
    .split(' ')
    .map((str) => [parseInt(str), 1])
)

R.times(75, () => (stones = parseStones(stones)))
console.log(R.sum(Object.values(stones)))