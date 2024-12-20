type direction = 'up' | 'down' | 'left' | 'right'

type TopographicMap = Map<coordinates, number>

type coordinates = {
  row: number,
  column: number,
}

class TrailPermutator
{
  private possibleDirections: direction[] = ['up', 'down', 'left', 'right']
  private child?: TrailPermutator

  constructor(
    private depth: number,
    private mapWidth: number,
    private mapHeight: number,
  ) {
    if (depth > 1) {
      this.child = new TrailPermutator(
        this.depth - 1,
        this.mapWidth,
        this.mapHeight,
      )
    }
  }

  *cycle(): Generator<direction[]> {
    for (const direction of this.possibleDirections) {
      if (this.child) {
        for (const childOutput of this.child.cycle()) {
          yield [direction, ...childOutput] as direction[]
        }
      } else {
        yield [direction] as direction[]
      }
    }
  }
}

class Trailhead
{
  public validDestinations: coordinates[] = []
  constructor(
    public coordinates: coordinates,
    public permutator: TrailPermutator,
  ) {}
}

const trailHeads: Trailhead[] = []
const topographicMap: TopographicMap = new Map()

Deno.readTextFileSync('example_input.txt')
  .split("\n")
  .map((line, row) => {
    line.split('').map((elevation, column) => {
      topographicMap.set({row, column}, parseInt(elevation))
      if (elevation === '0') {
        trailHeads.push(new Trailhead({row, column}, new TrailPermutator(9)))
      }
    })
  })

for (const trailHead of trailHeads) {
  trailHead.permutator.cycle().forEach((route: direction[]) => {
    let positionValue = 0
    const position = structuredClone(trailHead.coordinates)

    for (const direction of route) {
      switch(direction) {
        case "up":
          position.row -= 1
          break
        case "right":
          position.column += 1
          break
        case "down":
          position.row += 1
          break
        case "left":
          position.column -= 1
          break
        default:
      }

      const key = topographicMap.keys().find((k) => k.row === position.row && k.column === position.column)
      if (key && (topographicMap.get(key) === (positionValue + 1))) {
        positionValue += 1
        if (
          positionValue === 9 &&
          !trailHead.validDestinations.find((dest) => dest.row === position.row && dest.column === position.column)
        ) {
          trailHead.validDestinations.push(position)
        }
      } else {
        break
      }
    }
  })
}

// console.log(trailHeads[0].coordinates)

let sum = 0
trailHeads.map((th) => sum += th.validDestinations.length)
console.log(sum)