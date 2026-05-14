import * as R from 'npm:remeda'

type BathroomArea = {
  height: number,
  width: number
}

type Velocity = {
  x: number,
  y: number,
}

type Coordinates = {
  x: number,
  y: number,
}

type Robot = {
  velocity: Velocity,
  currentPosition: Coordinates
}

const extractPosition = (line: string) => {
  const regex = /p=(\d+),(\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    (x) => [parseInt(x[0][1]), parseInt(x[0][2])],
  )

  return {x, y}
}

const extractVelocity = (line: string) => {
  const regex = /v=(-?\d+),(-?\d+)/g

  const [x, y] = R.pipe(
    [...line.matchAll(regex)],
    (x) => [parseInt(x[0][1]), parseInt(x[0][2])],
  )

  return {x, y}
}

const moveRobot = (robot: Robot, bathroomArea: BathroomArea): Robot => {
  let x = (robot.currentPosition.x + robot.velocity.x) % bathroomArea.width
  let y = (robot.currentPosition.y + robot.velocity.y) % bathroomArea.height
  x = x < 0 ? (x + bathroomArea.width) : x
  y = y < 0 ? (y + bathroomArea.height) : y


  return {
    velocity: robot.velocity,
    currentPosition: {
      x: Math.abs(x),
      y: Math.abs(y),
    }
  } as Robot
}

const countRobotsInQuadrant = (quadrant: number, robots: Robot[], bathroomArea: BathroomArea): number => {
  let [xMin, xMax, yMin, yMax] = [0, 0, 0, 0]
  switch(quadrant) {
    case 1:
      xMin = 0
      xMax = Math.floor(bathroomArea.width / 2)
      yMin = 0
      yMax = Math.floor(bathroomArea.height / 2)
      break
    case 2:
      xMin = Math.ceil(bathroomArea.width / 2)
      xMax = bathroomArea.width
      yMin = 0
      yMax = Math.floor(bathroomArea.height / 2)
      break
    case 3:
      xMin = 0
      xMax = Math.floor(bathroomArea.width / 2)
      yMin = Math.ceil(bathroomArea.height / 2)
      yMax = bathroomArea.height
      break
    case 4:
      xMin = Math.ceil(bathroomArea.width / 2)
      xMax = bathroomArea.width
      yMin = Math.ceil(bathroomArea.height / 2)
      yMax = bathroomArea.height
      break
  }

  return R.pipe(
    robots,
    R.filter((robot) => {
      const inXBounds = robot.currentPosition.x >= xMin && robot.currentPosition.x < xMax
      const inYBounds = robot.currentPosition.y >= yMin && robot.currentPosition.y < yMax
      return inXBounds && inYBounds
    }),
    R.length()
  )
}

let robots = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line): Robot => {
    return {
      velocity: extractVelocity(line),
      currentPosition: extractPosition(line),
    }
  })

const bathroomArea: BathroomArea = {height: 103, width: 101}

R.times(100, () => {
  robots = robots.map((robot) => moveRobot(robot, bathroomArea))
})

const result = R.pipe(
  R.range(1,5),
  R.map((i) => countRobotsInQuadrant(i, robots, bathroomArea)),
  R.tap(console.log),
  R.reduce((acc, curr) => acc * curr, 1)
)

console.log(result)