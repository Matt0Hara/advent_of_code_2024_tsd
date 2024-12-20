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

const extractPrizeSpec = (line: string): PrizeSpec => {
  const regex = /=(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    R.map((x) => parseInt(x[1]) + 10000000000000)
  )

  return {x, y}
}

const executeAPress = (
  craneSpec: CraneInfoBucket,
  numberOfAPresses: number,
  counter: PrizeSpec,
  aButtonFactor: number
) => {
  const testX = counter.x - (craneSpec.buttonEffects.a.x * aButtonFactor)
  const testY = counter.y - (craneSpec.buttonEffects.a.y * aButtonFactor)
  numberOfAPresses += aButtonFactor

  if ((testX < aButtonFactor * 2 || testY < (aButtonFactor * 2)) && aButtonFactor > 1) {
    return () => executeAPress(craneSpec, numberOfAPresses, counter, Math.max(aButtonFactor - 1000, 1))
  }

  counter.x -= (craneSpec.buttonEffects.a.x * aButtonFactor)
  counter.y -= (craneSpec.buttonEffects.a.y * aButtonFactor)


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
    // console.log(numberOfAPresses, counter, aButtonFactor)
    return () => executeAPress(craneSpec, numberOfAPresses, counter, aButtonFactor)
  }
}

const findLeastWinPresses = (craneSpec: CraneInfoBucket) => {
  const numberOfAPresses = 0
  const counter = structuredClone(craneSpec.prizeSpec)
  const aButtonFactor = 10000

  let x = executeAPress(craneSpec, numberOfAPresses, counter, aButtonFactor)
  while (typeof x === 'function') {
    x = x()
  }

  return x
}

const calculateCoins = (presses: ButtonPressCounter) => {
  return (presses.a * 3) + presses.b
}

const craneSpecs = R.pipe(
  Deno.readTextFileSync('example_input.txt'),
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
  [craneSpecs[1]],
  // craneSpecs,
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

