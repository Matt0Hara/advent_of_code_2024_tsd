import * as R from 'npm:remeda'

type ButtonEffects = {
  x: number,
  y: number
}

type PrizeSpec = {
  x: number,
  y: number
}

type CraneInfoBucket = {
  buttonEffects: {
    a: ButtonEffects,
    b: ButtonEffects
  },
  prizeSpec: PrizeSpec
}

const extractButtonInfo = (line: string): ButtonEffects => {
  const regex = /\+(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    R.map((x) => parseInt(x[1]))
  )

  return {x, y}
}

const extractPrizeSpec = (line: string): PrizeSpec => {
  const regex = /=(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    R.map((x) => parseInt(x[1]) + 10000000000000)
    // R.map((x) => parseInt(x[1]))
  )

  return {x, y}
}

const findLeastWinPresses = (craneSpec: CraneInfoBucket): number | false => {
  const buttons = craneSpec.buttonEffects
  const prize = craneSpec.prizeSpec
  const divisor = (buttons.a.x * buttons.b.y - buttons.a.y * buttons.b.x)
  const aPresses = ((prize.x * buttons.b.y) - (prize.y * buttons.b.x)) / divisor
  const bPresses = ((buttons.a.x * prize.y) - (buttons.a.y * prize.x)) / divisor

  const aX = buttons.a.x * aPresses
  const aY = buttons.a.y * aPresses
  const bX = buttons.b.x * bPresses
  const bY = buttons.b.y * bPresses

  if (
    (aX + bX === prize.x && aY + bY === prize.y) &&
    aPresses % 1 === 0 && bPresses % 1 === 0
  ) {
    return (aPresses * 3) + bPresses
  } else{
    return false
  }
}


const craneSpecs = R.pipe(
  Deno.readTextFileSync('input.txt'),
  R.split("\n\n"),
  R.map((instructions) => instructions.split("\n")),
  R.map((x: string[]) => {
    return {
      buttonEffects: {
        a: extractButtonInfo(x[0]),
        b: extractButtonInfo(x[1]),
      },
      prizeSpec: extractPrizeSpec(x[2])
    } as CraneInfoBucket
  })
)

const testResults = R.pipe(
  craneSpecs,
  R.map((x) => findLeastWinPresses(x)),
  R.filter((x) => typeof x === 'number'),
  R.sum()
)

console.log(testResults)
