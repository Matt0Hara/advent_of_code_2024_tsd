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

type ButtonPressCounter = {
  a: number,
  b: number
}

const extractButtonInfo = (line: string): ButtonEffects => {
  const regex = /\+(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    R.map((x) => parseInt(x[1]))
  )

  return {x, y}
}

type ButtonCounterFunction = {
  (craneSpec: CraneInfoBucket, numberOfAPresses: number, counters: PrizeSpec): {craneSpec: CraneInfoBucket, numberOfAPresses: number, counters: PrizeSpec}
}

const extractPriceSpec = (line: string): PrizeSpec => {
  const regex = /=(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    R.map((x) => parseInt(x[1]))
  )

  return {x, y}
}

const executeAPress = (craneSpec: CraneInfoBucket, numberOfAPresses: number, counter: PrizeSpec) => {
  counter.x -= craneSpec.buttonEffects.a.x
  counter.y -= craneSpec.buttonEffects.a.y
  numberOfAPresses++

  if (counter.x < 1 || counter.y < 1) {
    return false
  }

  const yOk = (counter.y % craneSpec.buttonEffects.b.y) === 0
  const xOk = (counter.x % craneSpec.buttonEffects.b.x) === 0
  const xNum = (counter.x / craneSpec.buttonEffects.b.x)
  const yNum = (counter.y / craneSpec.buttonEffects.b.y)

  if ((xOk && yOk) && (xNum === yNum)) {
    return {a: numberOfAPresses, b: xNum}
  } else {
    return () => executeAPress(craneSpec, numberOfAPresses, counter)
  }
}

const findLeastWinPresses = (craneSpec: CraneInfoBucket) => {
  const numberOfAPresses = 0
  const counter = structuredClone(craneSpec.prizeSpec)

  let x = executeAPress(craneSpec, numberOfAPresses, counter)
  while (typeof x === 'function') {
    x = x()
  }

  return x
}

const calculateCoins = (presses: ButtonPressCounter) => {
  return (presses.a * 3) + presses.b
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
        prizeSpec: extractPriceSpec(x[2])
      } as CraneInfoBucket
    })
  )

const testResults = R.pipe(
  craneSpecs,
  R.map((x) => findLeastWinPresses(x)),
  R.map((x) => {
    switch (typeof x) {
      case 'boolean':
        return false
      default:
        return calculateCoins(x)
    }
  }),
  R.filter((x) => typeof x === 'number'),
  R.sum()
)

console.log(testResults)

