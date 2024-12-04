const mulEx = new RegExp(/mul\((\d{1,3},\d{1,3})\)/, 'gm')

const memoryString = Deno.readTextFileSync('input.txt')
const matches = memoryString.matchAll(mulEx)

let sum = 0
for (const match of matches) {
  const [x1, x2] = match[1].split(',').map((d) => parseInt(d))
  sum += (x1 * x2)
}

console.log(sum)