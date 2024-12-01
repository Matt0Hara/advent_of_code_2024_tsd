import { parseLists, getOccurrenceMap } from "./functions.ts"

const [list1, list2] = await parseLists('input.txt')
const list2Map = getOccurrenceMap(list2)


let sum = 0
for(let i = 0; i <= list1.length - 1; i++) {
  sum += list1[i] * (list2Map.get(list1[i]) ?? 0)
}

console.log(sum)