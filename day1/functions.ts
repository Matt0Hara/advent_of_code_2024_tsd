import { sortBy } from "@std/collections"

const parseLists = async (filename: string): Promise<number[][]> => {
   return await Deno.readTextFile(filename)
    .then(function(result: string) {
      const list1: number[] = []
      const list2: number[] = []

      result.split("\n").forEach((line: string) => {
        const [val1, val2] = line.split('   ')
        list1.push(parseInt(val1))
        list2.push(parseInt(val2))
      })

      return [sortBy(list1, (n) => n, {order: 'asc'}), sortBy(list2, (n) => n, {order: 'asc'})]
    })
}

const getOccurrenceMap = (list: number[]): Map<number, number> => {
  const occurenceMap = new Map

  list.map((value: number) => {
    const currentValue = occurenceMap.get(value) ?? 0
    occurenceMap.set(value, currentValue + 1)
  })

  return occurenceMap
}

export {
  parseLists,
  getOccurrenceMap
};