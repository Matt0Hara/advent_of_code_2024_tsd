type coordinates = {
  row: number,
  column: number
}

type direction = 'up' | 'down' | 'left' | 'right'

class PathFinder
{
  private directions: direction[] = ['up', 'down', 'left', 'right']

  constructor(
    private position: coordinates,
  ) {}

  safePositionCheck(coordinates: coordinates, map: number[][]) {
    if (
      coordinates.row >= 0 && coordinates.column >= 0 &&
      typeof map.at(coordinates.row)?.at(coordinates.column) !== 'undefined'
    ) {
      return map.at(coordinates.row)?.at(coordinates.column)
    } else {
      return null
    }
  }

  evaluateStep(direction: direction, position: coordinates) {
    const newPosition = structuredClone(position)
    switch(direction) {
      case "up":
        newPosition.row -= 1
        break
      case "right":
        newPosition.column += 1
        break
      case "down":
        newPosition.row += 1
        break
      case "left":
        newPosition.column -= 1
        break
      default:
    }

    return newPosition
  }

  findPaths(map: number[][]): coordinates[] {
    // console.log('CURRENT POSITION: ', this.position)
    const currentValue = this.safePositionCheck(this.position, map)
    if (typeof currentValue !== 'number') {
      return []
    }
    const validDestinations: coordinates[] = []

    for (const direction of this.directions) {
      const nextStep = this.evaluateStep(direction, this.position, map)
      const newValue = this.safePositionCheck(nextStep, map)
      if (newValue === currentValue + 1) {
        if (newValue === 9) {
          // console.log('FOUND: ', nextStep)
          validDestinations.push(nextStep)
        } else {
          validDestinations.push(...new PathFinder(nextStep).findPaths(map))
        }
      }
    }

    return validDestinations
  }
}

const pathFinders: PathFinder[] = []

const topographicMap: number[][] = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line, row) => {
    return line.split('').map((elevation, column) => {
      if (elevation === '0') {
        pathFinders.push(new PathFinder({row, column}))
      }

      return parseInt(elevation)
    })
  })


let uniqueSum = 0
let ratingSum = 0
for (const pathFinder of pathFinders) {
  const validDestinations = pathFinder.findPaths(topographicMap)
  const uniques = validDestinations.filter((destination, index, self) => {
    return index === self.findIndex((v) => {
      return v.row === destination.row && v.column === destination.column
    })
  })

  ratingSum += validDestinations.length
  uniqueSum += uniques.length
}

console.log(ratingSum)
console.log(uniqueSum)
