import * as R from 'npm:remeda'

type MoveList = string[]
type BoxMap = string[][]

enum Directions {
  '^',
  'V',
  '<',
  '>'
}

type Coordinates = {
  x: number,
  y: number
}

type Box = {
  coordinates: Coordinates
}

const isObstacle = (coordinates: Coordinates, boxMap: BoxMap) => {
  if (coordinates.y < 0 || coordinates.x < 0) return true
  return boxMap.at(coordinates.y)?.at(coordinates.x) === '#'
}

const isBox = (coordinates: Coordinates, boxMap: BoxMap) => {
  if (coordinates.y < 0 || coordinates.x < 0) return false
  return boxMap.at(coordinates.y)?.at(coordinates.x) === 'O'
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

const previewMove = (direction: string, coordinates: Coordinates) => {
  let newX = coordinates.x
  let newY = coordinates.y

  switch(direction) {
    case '^':
      newY = coordinates.y - 1
      break;
    case 'v':
      newY = coordinates.y + 1
      break
    case '<':
      newX = coordinates.x - 1
      break
    case '>':
      newX = coordinates.x + 1
      break
    default:
      return false
  }

  return {x: newX, y: newY}
}

const canMove = (direction: string, coordinates: Coordinates, boxMap: BoxMap): boolean => {
  const previewCoords = previewMove(direction, coordinates)
  console.log(direction, previewCoords)
  if (!previewCoords) return false

  if (isObstacle(previewCoords, boxMap)) {
    return false
  } else if (isBox(previewCoords, boxMap)) {
    // console.log(direction, previewCoords)
    return canMove(direction, previewCoords, boxMap)
  } else {
    return true
  }
}

const move = (direction: string, coordinates: Coordinates, boxMap: BoxMap): BoxMap => {
  const preview = previewMove(direction, coordinates)
  if (canMove(direction, coordinates, boxMap) && preview) {
    if (isBox(preview, boxMap)) move(direction, preview, boxMap)
    boxMap[preview.y][preview.x] = boxMap[coordinates.y][coordinates.x]
    boxMap[coordinates.y][coordinates.x] = '.'
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

// console.log(moveList)

const newBoxMap = R.pipe(
  moveList,
  R.reduce((acc, curr) => {
    const robotCoords = getRobotCoordinates(acc)
    return move(curr, robotCoords, acc)
  }, boxMap)
)
console.log(drawMap(newBoxMap))


let sum = 0
boxMap.forEach((line, row) => {
  line.forEach((char, column) => {
    if (char === 'O') {
      const boxScore = calculateBoxScore({x: column, y: row})
      sum += boxScore
      console.log(boxScore, sum)
    }
  })
})

console.log(sum)