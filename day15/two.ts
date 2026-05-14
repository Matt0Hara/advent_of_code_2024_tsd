import * as R from 'npm:remeda'

type MoveList = string[]
type BoxMap = string[][]

enum BoxSides {
  '[' ,
  ']' ,
}

type Coordinates = {
  x: number,
  y: number
}

type CoordinatePair = [
  Coordinates,
  Coordinates
]

type Box = {
  coordinates: Coordinates
}


const scaleChar = (char: string) => {
  switch(char) {
    case 'O':
      return ['[', ']']
    case '@':
      return ['@', '.']
    default:
      return Array(2).fill(char)
  }
}

const scaleMap = (boxMap: BoxMap) => {
  return R.pipe(
    boxMap,
    R.map((line) => {
      return R.pipe(
        line,
        R.map((x) => scaleChar(x)),
        R.flat()
      )
    })
  )
}

const isObstacle = (coordinates: Coordinates, boxMap: BoxMap) => {
  if (coordinates.y < 0 || coordinates.x < 0) return true
  return boxMap.at(coordinates.y)?.at(coordinates.x) === '#'
}

const isBox = (coordinates: Coordinates, boxMap: BoxMap) => {
  if (coordinates.y < 0 || coordinates.x < 0) return false
  return ['[', ']'].includes(boxMap[coordinates.y][coordinates.x])
}

const buildBoxPair = (coordinates: Coordinates, boxMap: BoxMap): CoordinatePair => {
  const character = boxMap[coordinates.y][coordinates.x]
  const index = character ===  '[' ? 0 : 1
  const otherIndex = index ? 0 : 1
  let otherCoordinates = {}
  if (character === ']') {
    otherCoordinates = {
      x: coordinates.x - 1,
      y: coordinates.y
    }
  } else {
    otherCoordinates = {
      x: coordinates.x + 1,
      y: coordinates.y
    }
  }

  const boxHalves = []
  boxHalves[index] = coordinates
  boxHalves[otherIndex] = otherCoordinates

  return boxHalves as CoordinatePair
}

const getRobotCoordinates = (boxMap: BoxMap): Coordinates | false => {
  for (const [row, line] of boxMap.entries()) {
    for (const [column, char] of line.entries()) {
      if (char === '@') {
        return {
          x: column,
          y: row
        }
      }
    }
  }

  return false
}

const previewMove = (direction: string, coordinates: Coordinates, number0fSpaces = 1) => {
  let newX = coordinates.x
  let newY = coordinates.y

  switch(direction) {
    case '^':
      newY = coordinates.y - number0fSpaces
      break;
    case 'v':
      newY = coordinates.y + number0fSpaces
      break
    case '<':
      newX = coordinates.x - number0fSpaces
      break
    case '>':
      newX = coordinates.x + number0fSpaces
      break
    default:
      return false
  }

  return {x: newX, y: newY}
}

const canMove = (direction: string, coordinates: Coordinates, boxMap: BoxMap): boolean => {
  const previewCoords = previewMove(direction, coordinates)
  if (!previewCoords) return false
  // console.log(previewCoords)

  if (isObstacle(previewCoords, boxMap)) {
    return false
  } else if (isBox(previewCoords, boxMap)) {
    return canMove(direction, previewCoords, boxMap)
  } else {
    return true
  }
}

const moveBox = (direction: string, coordinates: CoordinatePair, boxMap: BoxMap) => {
  const previewRight = previewMove(direction, coordinates[1])
  const previewLeft = previewMove(direction, coordinates[0])

  if (!(previewRight && previewLeft)){
    return boxMap
  }

  const pointsToPreview = []
  if (['^', 'v'].includes(direction)) {
    pointsToPreview.push(previewLeft, previewRight)
  } else if (direction === '<') {
    pointsToPreview.push(previewLeft)
  } else {
    pointsToPreview.push(previewRight)
  }

  const allowedToMove = coordinates.every((x) => canMove(direction, x, boxMap))
  const isTouchingBox = pointsToPreview.some((x) => isBox(x, boxMap))

  if (previewLeft && previewRight && allowedToMove) {
    console.log("moving box", direction, pointsToPreview)
    if (isTouchingBox) {
      boxMap = moveBox(direction, buildBoxPair(pointsToPreview[0], boxMap), boxMap) ?? boxMap
      // boxMap = moveBox(direction, buildBoxPair(pointsToPreview[1], boxMap), boxMap) ?? boxMap
    }

    boxMap[coordinates[0].y][coordinates[0].x] = '.'
    boxMap[coordinates[1].y][coordinates[1].x] = '.'
    boxMap[previewLeft.y][previewLeft.x] = '['
    boxMap[previewRight.y][previewRight.x] = ']'
  } else {
    console.log('afraid so')
    return null
  }

  return boxMap
}

const move = (direction: string, coordinates: Coordinates, boxMap: BoxMap): BoxMap => {
  const preview = previewMove(direction, coordinates)
  if (canMove(direction, coordinates, boxMap) && preview) {
    if (isBox(preview, boxMap)) {
      const afterBoxMove = moveBox(direction, buildBoxPair(preview, boxMap), boxMap)
      if (afterBoxMove) {
        boxMap[preview.y][preview.x] = boxMap[coordinates.y][coordinates.x]
        boxMap[coordinates.y][coordinates.x] = '.'
      }
    } else {
      boxMap[preview.y][preview.x] = boxMap[coordinates.y][coordinates.x]
      boxMap[coordinates.y][coordinates.x] = '.'
    }
  }

  return boxMap
}

const calculateBoxScore = (coordinates: Coordinates) => {
  return (coordinates.y * 100) + coordinates.x
}

const parseInput = (input: string): [BoxMap, MoveList] => {
  const [boxSection, moveInstructons] = input.split("\n\n")
  const boxMap = boxSection.split("\n").map((line) => line.split(''))
  const moveList = moveInstructons.replaceAll("\n", '').split('')
  return [boxMap, moveList]
}

const drawMap = (boxMap: BoxMap): string => {
  return boxMap.map((line) => line.join('')).join("\n")
}

const [boxMap, moveList] = parseInput(Deno.readTextFileSync('input.txt'))
const scaledBoxMap = scaleMap(boxMap)
console.log(drawMap(scaledBoxMap))

// console.log(moveList)

const newBoxMap = R.pipe(
  moveList,
  R.reduce((acc, curr, index) => {
    const robotCoords = getRobotCoordinates(acc)
    console.log(drawMap(acc))
    if (!robotCoords || index === 1231) {
      console.log("Robot lost at step " + index)
      Deno.exit()
    } else {
      console.log(curr, robotCoords, canMove(curr, robotCoords, boxMap), index)
    }
    return move(curr, robotCoords, acc)
  }, scaledBoxMap)
)
// console.log(drawMap(newBoxMap))


let sum = 0
newBoxMap.forEach((line, row) => {
  line.forEach((char, column) => {
    if (char === '[') {
      const boxScore = calculateBoxScore({x: column, y: row})
      sum += boxScore
    }
  })
})

console.log(sum)