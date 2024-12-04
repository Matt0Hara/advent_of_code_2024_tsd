const mulEx = new RegExp(/mul\((\d{1,3},\d{1,3})\)/, 'gm')

const memoryString = Deno.readTextFileSync('input.txt')
const dontSplit = memoryString.split("don't()")

let sum = 0
const calculateMatches = (matches: Iterable<RegExpExecArray>) => {
  for (const match of matches) {
    const [x1, x2] = match[1].split(',').map((d) => parseInt(d))
    sum += (x1 * x2)
  }
}

for (const [index, dontString] of dontSplit.entries()) {
  if (index === 0) {
    calculateMatches(dontString.matchAll(mulEx))
    continue
  }

  const doSplit = dontString.split('do()')
    .toSpliced(0,1)

  for (const string of doSplit) {
    calculateMatches(string.matchAll(mulEx))
  }
}

console.log(sum)