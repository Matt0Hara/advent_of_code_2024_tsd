import * as R from 'npm:remeda'

// part 1 with A*

type StepList = Map<string, boolean>

type Coordinates = {
  x: number,
  y: number,
}

type Node = {
  coordinates: Coordinates,
  hCost: number,
  gCost: number,
  xCost: number,
  fCost: number,
  parent?: Node,
}

const getCoordinateDistance = (a: Coordinates, b: Coordinates) => {
  const addend1 = (b.x - a.x)
  const addend2 = (b.y - a.y)

  return Math.sqrt((addend1 * addend1) + (addend2 * addend2))
}

const hasChangeInX = (a: Coordinates, b: Coordinates) => {
  return a.x - b.x !== 0
}

const scorePath = (path: Coordinates[]): number => {
  let sum = 0
  let changeInX = true
  path.forEach((step, index) => {
    if (index === 0) {
      return
    } else {
      const currentChangeInX = hasChangeInX(path[index - 1], step)
      if (changeInX && currentChangeInX) {
        sum++
      } else if (!changeInX && !currentChangeInX) {
        sum++
      } else {
        changeInX = !changeInX
        sum += 1001
      }
    }
  })

  return sum
}

const getValidNextMoves = (coordinates: Coordinates, validSteps: StepList): Coordinates[] => {
  return [
    {x: coordinates.x + 1, y: coordinates.y},
    {x: coordinates.x - 1, y: coordinates.y},
    {x: coordinates.x, y: coordinates.y + 1},
    {x: coordinates.x, y: coordinates.y - 1},
  ].filter((step) => {
    return validSteps.get(`${step.x}|${step.y}`)
  })
}

const parseMap = (input: string[][]): [Coordinates, Coordinates, StepList] => {
  let start: Coordinates = {x: 0, y: 0}
  let end: Coordinates = {x: 0, y: 0}
  const validSteps = new Map()

  input.forEach((line, row) => {
    line.forEach((char, column) => {
      if (char === 'S') start = {x: column, y: row} as Coordinates
      if (char === 'E') end = {x: column, y: row} as Coordinates
      if (['.', 'E'].includes(char)) validSteps.set(`${column}|${row}`, true)
    })
  })

  return [start, end, validSteps]
}

const buildNodePath = (endNode: Node) => {
  let currentNode: Node | undefined = endNode
  const path = []
  while (currentNode) {
    path.push(currentNode.coordinates)
    currentNode = currentNode.parent
  }

  return path.reverse()
}

const pathfind = (start: Coordinates, end: Coordinates, validSteps: StepList) => {
  let currentNode: Node = {coordinates: start, hCost: 0, fCost: 0, gCost: 0, xCost: 0}
  let neighbors = getValidNextMoves(currentNode.coordinates, validSteps)
    .map((x): Node => {
      const gCost = getCoordinateDistance(x, start)
      const hCost = getCoordinateDistance(x, end)
      const xCost = scorePath([start, x])
      return {coordinates: x, gCost, hCost, xCost, fCost: gCost + hCost + xCost, parent: currentNode}
    })

  while (neighbors.length) {
    const lowest = neighbors.reduce((acc, curr) => {
      if (acc.fCost < curr.fCost) {
        return acc
      } else if (curr.fCost < acc.fCost) {
        return curr
      } else {
        return acc.xCost < curr.xCost ? acc : curr
      }
    })

    currentNode = lowest
    validSteps.set(`${lowest.coordinates.x}|${lowest.coordinates.y}`, false)

    if (R.isDeepEqual(currentNode.coordinates, end)) {
      return buildNodePath(currentNode)
    }

    const newNeighbors = getValidNextMoves(currentNode.coordinates, validSteps).map((x): Node => {
      const gCost = getCoordinateDistance(x, start)
      const hCost = getCoordinateDistance(x, end)

      const thisNode = {
        coordinates: x,
        gCost,
        hCost,
        xCost: 0,
        fCost: 0,
        parent: currentNode
      }

      const xCost = scorePath(buildNodePath(thisNode))
      thisNode.xCost = xCost
      thisNode.fCost = gCost + hCost + xCost

      return thisNode
    })

    neighbors.push(...newNeighbors)

    neighbors = neighbors.filter((x) => {
      return !!validSteps.get(`${x.coordinates.x}|${x.coordinates.y}`)
    })
  }

  return []
}

const input = Deno.readTextFileSync('example_input.txt')
  .split("\n")
  .map((line) => line.split(''))

const [start, end, validSteps] = parseMap(input)
const path = pathfind(start, end, validSteps)

console.log(scorePath(path))