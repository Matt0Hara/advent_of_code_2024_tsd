const reports = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(' ').map((char) => parseInt(char)))

let validReportsCount = 0
reports.forEach((originalReport) => {
  const hasSuccess = originalReport.keys().toArray().some((key) => {
    const report = originalReport.toSpliced(key, 1)

    const ranges = report.map((_current, index) => {
      if ((index + 1) < report.length) {
        return [index, index + 1]
      }
    }).filter((r) => typeof r !== 'undefined')

    const reportDescending = (report[0] - report[1]) > 0
    const failed = ranges.some((range) => {
      const comparators = reportDescending ? [1, 3] : [-3, -1]
      const diff = report[range[0]] - report[range[1]]

      return !(diff >= comparators[0]) || !(diff <= comparators[1])
    })

    return !failed
  })

  validReportsCount += (hasSuccess ? 1 : 0)
})

console.log(validReportsCount)