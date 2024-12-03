const reports = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(' ').map((char) => parseInt(char)))

let validReportsCount = 0
reports.forEach((report) => {
  const topIndex = report.length
  const ranges = report.map((_current, index) => {
    if ((index + 1) < topIndex) {
      return [index, index + 1]
    }
  }).filter((r) => typeof r !== 'undefined')

  const reportDescending = (report[0] - report[1]) > 0
  const failed = ranges.some((range) => {
    const comparators = reportDescending ? [1, 3] : [-3, -1]
    const diff = report[range[0]] - report[range[1]]

    return !(diff >= comparators[0]) || !(diff <= comparators[1])
  })

  validReportsCount += (failed ? 0 : 1)
})

console.log(validReportsCount)