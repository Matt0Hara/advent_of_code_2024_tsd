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

const getRobotsInQuadrant = (quadrant: number, robots: Robot[], bathroomArea: BathroomArea): Robot[] => {
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

  return robots.filter((robot) => {
    const inXBounds = robot.currentPosition.x >= xMin && robot.currentPosition.x < xMax
    const inYBounds = robot.currentPosition.y >= yMin && robot.currentPosition.y < yMax
    return inXBounds && inYBounds
  })
}

const buildMap = (robots: Robot[], bathroomArea: BathroomArea) => {
  const map: string[][] = Array(bathroomArea.height).fill([]).map(() => Array(bathroomArea.width).fill('.'))

  robots.map((robot) => {
    map[robot.currentPosition.y][robot.currentPosition.x] = '1'
  })

  return map
}

const drawMap = (map: string[][]) => {
  return map.map((line) => line.join('')).join("\n")
}

const detectSymmetry = (robots: Robot[], map: string[][]) => {
  return R.pipe(
    robots,
    R.filter((robot) => {
      return map.at(robot.currentPosition.y * -1)?.at(robot.currentPosition.x) === '1'
    }),
    R.length(),
  )
}


const clusterScore = (map: string[][]) => {
  let indexSum = 0
  map.map((line, yIndex) => {
    line.map((char, index) => {
      if (char === "1") {
        const distanceToYCenter = Math.abs(index - (Math.floor(map.length / 2)))
        indexSum += (100 - distanceToYCenter)
      }
    })
  })

  return indexSum
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

let highScore = {score: 0, iteration: 0}
R.times(100000, (iteration) => {
  robots = robots.map((robot) => moveRobot(robot, bathroomArea))
  const cluster = clusterScore(buildMap(robots, bathroomArea))

  const result = R.pipe(
    R.range(1,5),
    R.map((i) => getRobotsInQuadrant(i, robots, bathroomArea).length),
  )

  const score = result[0] + result[2] + cluster

  if (score > highScore.score) {
    highScore.score = score
    highScore.iteration = iteration
    Deno.writeTextFileSync('chrithmuth.txt', drawMap(buildMap(robots, bathroomArea)))
  }
})

console.log(highScore)