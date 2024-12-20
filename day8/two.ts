interface Coordinates {
  row: number,
  column: number,
}

interface Node {
  coordinates: Coordinates
  type: string,
  identifier: string,
}

interface Antenna extends Node {
  type: 'Antenna'
}

interface Antinode extends Node {
  type: 'Antinode'
}

type NodeMap = Map<Coordinates, Node>;

const findAntinodes = (antenna1: Antenna, antenna2: Antenna, nodeList: NodeMap): Antinode[] => {
  const results: Antinode[] = []

  const antenna2Coordinates = nodeList.keys().find((key) => {
    return key.row === antenna2.coordinates.row &&
      key.column === antenna2.coordinates.column
  })

  if (antenna2Coordinates) {
    results.push({
      coordinates: antenna2Coordinates,
      type: 'Antinode',
      identifier: '#'
    })
  }

  let slopeFactor = 1;
  while (true) {
    const rise = (antenna2.coordinates.row - antenna1.coordinates.row) * slopeFactor
    const run = (antenna2.coordinates.column - antenna1.coordinates.column) * slopeFactor

    const coordinates = nodeList.keys().find((key) => {
      return key.row === antenna2.coordinates.row + rise &&
        key.column === antenna2.coordinates.column + run
    })

    if (coordinates) {
      results.push({
          coordinates,
          type: 'Antinode',
          identifier: '#'
      })

      slopeFactor++
    } else {
      return results
    }
  }
}


const antennae: Antenna[] = []
const nodes: Map<Coordinates, Node> = new Map()

const map = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(''))

const regex = /[a-zA-Z0-9]/
map.map((line, row: number) => {
  line.map((char: string, column: number) => {
    const objectToPush = {
      coordinates: {row, column},
      type: 'Node',
      identifier: char
    }

    if (char.match(regex)) {
      objectToPush.type = 'Antenna'
      antennae.push(objectToPush as Antenna)
    }

    nodes.set(objectToPush.coordinates, objectToPush)
  })
})

const antinodes: NodeMap = new Map()
antennae.forEach((antenna) => {
  const antennaeToTest = antennae.filter((possibleAntenna) => {
    return possibleAntenna.coordinates.row !== antenna.coordinates.row &&
      possibleAntenna.coordinates.column !== antenna.coordinates.column &&
      possibleAntenna.identifier === antenna.identifier
  })


  antennaeToTest.forEach((testAntenna) => {
    console.log(testAntenna)
    const newAntinodes = findAntinodes(antenna, testAntenna, nodes)

    newAntinodes.map((antinode: Antinode) => {
      if (antinode && nodes.has(antinode?.coordinates)) {
        antinodes.set(antinode.coordinates, antinode)
      }
    })
  })
})


const newMap: string[][] = []
nodes.forEach((node) => {
  if (newMap[node.coordinates.row] === undefined) {
    newMap[node.coordinates.row] = []
  }

  newMap[node.coordinates.row][node.coordinates.column] = node.identifier
})

antinodes.forEach((antinode: Node) => {
  if (
    newMap[antinode.coordinates.row] !== undefined &&
    newMap[antinode.coordinates.row][antinode.coordinates.column] !== undefined
  ) {
    console.log(antinode.coordinates.row, antinode.coordinates.column)
    newMap[antinode.coordinates.row][antinode.coordinates.column] = antinode.identifier
  }
})

console.log(newMap.map((line) => line.join('')).join("\n"))

console.log(antinodes.size)