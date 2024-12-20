import * as R from 'npm:remeda'

type Coordinates = {
  row: number,
  column: number,
}

type Plot = {
  character: string,
  position: Coordinates
}

type Region = {
  character: string,
  lastOnLine: number,
  plots: Plot[]
}

type RegionMap = string[][]

const isPlotAdjacent = (plotOne: Plot, plotTwo: Plot): boolean => {
  const rowAdjacent = Math.abs(plotOne.position.row - plotTwo.position.row)
  const columnAdjacent = Math.abs(plotOne.position.column - plotTwo.position.column)

  const values = [rowAdjacent, columnAdjacent].toSorted()

  return values[0] === 0 && values[1] === 1
}

const isInRegion = (plot: Plot, region: Region) => {
  if (plot.character !== region.character) return false

  return region.plots.some((currentPlot) => isPlotAdjacent(plot, currentPlot))
}

const mergeRegions = (regionOne: Region, regionTwo: Region): Region => {

  return {
    character: regionOne.character,
    plots: regionOne.plots.concat(regionTwo.plots),
    lastOnLine: Math.max(regionOne.lastOnLine, regionTwo.lastOnLine)
  }
}

const shouldMergeRegions = (regionOne: Region, regionTwo: Region) => {
  return regionOne.plots.some((x) => isInRegion(x, regionTwo))
}

const getDownstairsNeighbor = (plot: Plot, regionMap: RegionMap): Plot | null => {
  const proposedPlot = {
    character: plot.character,
    position: {
      row: plot.position.row + 1,
      column: plot.position.column
    }
  }

  return plotExists(proposedPlot, regionMap) ? proposedPlot : null
}

const getUpstairsNeighbor = (plot: Plot, regionMap: RegionMap): Plot | null => {
  const proposedPlot = {
    character: plot.character,
    position: {
      row: plot.position.row - 1,
      column: plot.position.column
    }
  }

  return plotExists(proposedPlot, regionMap) ? proposedPlot : null
}

const getRightNeighbor = (plot: Plot, regionMap: RegionMap) => {
  const proposedPlot = {
    character: plot.character,
    position: {
      row: plot.position.row,
      column: plot.position.column + 1
    }
  } as Plot

  return plotExists(proposedPlot, regionMap) ? proposedPlot : null
}

const getLeftNeighbor = (plot: Plot, regionMap: RegionMap) => {
  const proposedPlot = {
    character: plot.character,
    position: {
      row: plot.position.row,
      column: plot.position.column - 1
    }
  } as Plot

  return plotExists(proposedPlot, regionMap) ? proposedPlot : null
}

const plotExists = (plot: Plot, regionMap: RegionMap): boolean => {
  if (!Object.values(plot.position).every((x) => x > -1)) return false
  return regionMap.at(plot.position.row)?.at(plot.position.column) === plot.character
}

const calculateTopSides = (region: Region, regionMap: RegionMap) => {
  return region.plots.filter((plot) => !getUpstairsNeighbor(plot, regionMap)).length
}

const calculateBottomSides = (region: Region, regionMap: RegionMap) => {
  return region.plots.filter((plot) => !getDownstairsNeighbor(plot, regionMap)).length
}

const calculateLeftSides = (region: Region, regionMap: RegionMap) => {
  return region.plots.filter((plot) => !getLeftNeighbor(plot, regionMap)).length
}

const calculateRightSides = (region: Region, regionMap: RegionMap) => {
  return region.plots.filter((plot) => !getRightNeighbor(plot, regionMap)).length
}

const calculateRegionFenceCost = (region: Region, regionMap: RegionMap) =>  {
  return R.sum([
    calculateTopSides(region, regionMap),
    calculateBottomSides(region, regionMap),
    calculateLeftSides(region, regionMap),
    calculateRightSides(region, regionMap),
  ]) * region.plots.length
}

const findRegions = (regionMap: RegionMap) => {
  const regions: Map<string, Region[]>= new Map

  for (const [row, line] of regionMap.entries()) {
    for (let column = 0; column < line.length; column++) {
      const newPlot: Plot = {
        character: line[column],
        position: {
          row,
          column
        }
      }

      const lineRegion = {
        character: newPlot.character,
        plots: [newPlot],
        lastOnLine: row
      }

      let currentNeighbor: Plot | null = newPlot

      while((currentNeighbor = getRightNeighbor(currentNeighbor, regionMap))) {
        lineRegion.plots.push(currentNeighbor)
        column++
      }

      const currentValue = regions.get(newPlot.character) ?? []

      if (lineRegion.character === 'F') {
        console.log(lineRegion)
      }

      regions.set(
        lineRegion.character,
        R.pipe(
          currentValue,
          R.partition((x) => shouldMergeRegions(x, lineRegion) && (x.lastOnLine >= row - 1)),
          (x) => {
            if (x[0].length === 0) {
              return [lineRegion, ...x.flat()]
            } else {
              return [
                mergeRegions(x[0].reduce((acc, curr) => mergeRegions(acc, curr)), lineRegion),
                ...x[1]
              ]
            }
          },
          R.flat()
        )
      )

    }
  }

  return regions
}

const input = Deno.readTextFileSync('example_input.txt')
  .split("\n")
  .map((line) => line.split(''))


const totalCost = R.pipe(
  [...findRegions(input).values()],
  R.flat(),
  R.map((x) => calculateRegionFenceCost(x, input)),
  R.sum()
)

console.log(totalCost)