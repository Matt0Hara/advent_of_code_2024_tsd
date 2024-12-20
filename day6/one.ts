enum Orientation {
  UP = '^',
  RIGHT = '>',
  DOWN = 'V',
  LEFT = '<',
}

class Guard
{
  public static orientations = [Orientation.UP, Orientation.RIGHT, Orientation.DOWN, Orientation.LEFT]
  public orientationIndex: number

  constructor(public row: number, public column: number, public character: string) {
    this.orientationIndex = Guard.orientations.findIndex((c) => c === this.character)
  }

  static shouldCreate(character: string) {
    return Guard.orientations.findIndex((c: string) => c === character) !== -1
  }

  getPosition(): [number, number] {
    return [this.row, this.column]
  }

  getOrientation() {
    return Guard.orientations[this.orientationIndex % (Guard.orientations.length)]
  }

  move() {
    [this.row, this.column] = this.checkMove()
  }

  turn() {
    this.orientationIndex += 1
  }

  checkMove() {
    let row = this.row
    let column = this.column

    // console.log(this.getOrientation())

    switch(this.getOrientation()) {
      case Orientation.UP:
        row -= 1
        break
      case Orientation.RIGHT:
        column += 1
        break
      case Orientation.DOWN:
        row += 1
        break
      case Orientation.LEFT:
        column -= 1
        break
      default:
    }

    return [row, column]
  }
}

class GuardMap
{
  public guards: Guard[] = []
  public obstacles = ['#']
  public markedSteps: number = 0

  constructor(public matrix: string[][]) {
    this.matrix.map((row, rowIndex) => {
      row.map((char, columnIndex) => {
        if (Guard.shouldCreate(char)) {
          console.log(char, rowIndex, columnIndex)
          this.guards.push(new Guard(rowIndex, columnIndex, char))
        }
      })
    })
  }

  isObstacle(row: number, column: number) {
    return this.obstacles.includes(this.matrix[row][column])
  }

  markSpot(row: number, column: number) {
    if (this.matrix[row][column] !== 'X') {
      this.matrix[row][column] = 'X'
      this.markedSteps += 1
    }
  }

  patrolGuards() {
    this.guards.forEach((guard) => {

      while (true) {
        const [row, column] = guard.checkMove()
        if (!(this.matrix[row] ?? null) || !(this.matrix[row][column] ?? null)) {
          this.markSpot(...guard.getPosition())
          break
        }

        if (this.isObstacle(row, column)) {
          guard.turn()
        } else {
          this.markSpot(...guard.getPosition())
          guard.move()
        }
      }
    })
  }
}


const matrix = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(''))

const guardMap = new GuardMap(matrix)
guardMap.patrolGuards()


let count = 0
guardMap.matrix.forEach((line) => {
  line.forEach((char) => {
    if (char === 'X') {
      count++
    }
  })
})

console.log(count)
console.log(guardMap.markedSteps)

// console.log(guardMap.matrix.map((line) => line.join('')).join("\n"))

