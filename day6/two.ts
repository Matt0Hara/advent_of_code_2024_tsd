import test = Deno.test

enum Orientation {
  UP = '^',
  RIGHT = '>',
  DOWN = 'V',
  LEFT = '<',
}


type Turn = {
  row: number,
  column: number,
  orientation: Orientation,
}

class Guard {
  public static orientations = [Orientation.UP, Orientation.RIGHT, Orientation.DOWN, Orientation.LEFT]
  public orientationIndex: number
  public turns: Turn[] = []

  constructor(public row: number, public column: number, public character: string) {
    this.orientationIndex = Guard.orientations.findIndex((c) => c === this.character)
  }

  static fromGuard(guard: Guard) {
    const newGuard = new Guard(...guard.getPosition(), guard.getOrientation())
    newGuard.turns = [...guard.turns]

    return newGuard
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
    const [currentRow, currentColumn] = this.getPosition()
    this.turns.push({
      row: currentRow,
      column: currentColumn,
      orientation: this.getOrientation()
    } as Turn)

    this.orientationIndex += 1
  }

  isPreviousTurn(row: number, column: number, orientation: Orientation) {
    return !!this.turns.find((e: Turn) => {
      return e.row === row && e.column === column && e.orientation === orientation
    })
  }

  checkMove(): [number, number] {
    let row = this.row
    let column = this.column

    switch (this.getOrientation()) {
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

  suggestLoop(): [number, number] {
    let [row, column] = this.checkMove()
    switch (this.getOrientation()) {
      case Orientation.UP:
        column += 1
        break
      case Orientation.RIGHT:
        row += 1
        break
      case Orientation.DOWN:
        column -= 1
        break
      case Orientation.LEFT:
        row -= 1
        break
      default:
    }

    return [row, column]
  }

  latestTurn(): Turn {
    return JSON.parse(JSON.stringify(this.turns.at(-1))) as Turn
  }
}

class GuardMap
{
  public guards: Guard[] = []
  public obstacles = ['#']
  public markedSteps: number = 0
  public possibleLoopObstacles = 0

  constructor(public matrix: string[][]) {
    this.matrix.map((row, rowIndex) => {
      row.map((char, columnIndex) => {
        if (Guard.shouldCreate(char)) {
          this.guards.push(new Guard(rowIndex, columnIndex, char))
        }
      })
    })
  }

  isObstacle(row: number, column: number) {
    return this.obstacles.includes(this.matrix[row][column])
  }

  markSpot(row: number, column: number) {
    if (!['X', 'O', '+'].includes(this.matrix[row][column])) {
      this.matrix[row][column] = 'X'
      this.markedSteps += 1
    }
  }

  markLoop(row: number, column: number) {
    if (!['Z', 'O'].includes(this.matrix[row][column])) {
      this.possibleLoopObstacles += 1
    }

    if (this.matrix[row][column] === '+') {
      this.matrix[row][column] = 'Z'
    } else {
      this.matrix[row][column] = 'O'
    }
  }

  isOutOfBounds(row: number, column: number) {
    return !(this.matrix[row] ?? null) || !(this.matrix[row][column] ?? null)
  }

  checkLoop(guard: Guard): boolean {
    const testGuard = Guard.fromGuard(guard)
    testGuard.turn()
    const fakeTurn: Turn = testGuard.latestTurn()

    while(true) {
      const [testRow, testColumn] = testGuard.getPosition()
      const [nextRow, nextColumn] = testGuard.checkMove()

      if (this.isOutOfBounds(nextRow, nextColumn)) {
        return false
      } else if (this.isObstacle(nextRow, nextColumn) || (JSON.stringify(testGuard.latestTurn()) === JSON.stringify(fakeTurn))) {
        if (testGuard.isPreviousTurn(testRow, testColumn, testGuard.getOrientation())) {
          return true
        } else {
          testGuard.turn()
        }
      }

      testGuard.move()
    }
  }

  markTurn(row: number, column: number) {
    if (this.matrix[row][column] === 'O') {
      this.matrix[row][column] = 'Z'
    } else {
      this.matrix[row][column] = '+'
    }
  }

  patrolGuards() {
    this.guards.forEach((guard: Guard) => {
      while (true) {
        const [row, column] = guard.checkMove()
        if (this.isOutOfBounds(row, column)) {
          break
        }

        if (this.isObstacle(row, column)) {
          this.markTurn(...guard.getPosition())
          guard.turn()
        } else {
          if (this.checkLoop(guard)) {
            this.markLoop(row, column)
          }
          guard.move()
        }
      }
    })
  }
}


// const matrix = Deno.readTextFileSync('example_input.txt')
const matrix = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(''))

const guardMap = new GuardMap(matrix)
guardMap.patrolGuards()

console.log(guardMap.possibleLoopObstacles)

console.log(guardMap.matrix.map((line) => line.join('')).join("\n"))