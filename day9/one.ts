const input = Deno.readTextFileSync('input.txt')
  .split('')

type Block = {
  char: string,
  fileID: number | null
}

const getBlockRepresentation = (blocks: string[]) : Block[] => {
  let currentFileId = 0
  const blockRepresentation: Block[] = []

  blocks.forEach((block, index) => {
    const isFileBlock = index % 2 === 0
    currentFileId += index !== 0 && isFileBlock ? 1 : 0

    const fillChar = isFileBlock ? currentFileId : '.'
    blockRepresentation.push(
      ...Array(parseInt(block))
        .fill({
          char: fillChar,
          fileID: isFileBlock ? currentFileId : null,
        } as Block)
    )
  })

  return blockRepresentation
}

const compactFiles = (blockRepresentation: Block[]) => {
  while(true) {
    const firstFreeSlot = blockRepresentation.findIndex((obj) => obj.char === '.')
    const firstFreeVal = blockRepresentation[firstFreeSlot]
    const lastFullSlot = blockRepresentation.findLastIndex((obj) => obj.char !== '.')
    const  lastFullVal = blockRepresentation[lastFullSlot]

    if (firstFreeSlot - lastFullSlot === 1) {
      return blockRepresentation
    }

    blockRepresentation[firstFreeSlot] = lastFullVal
    blockRepresentation[lastFullSlot] = firstFreeVal
  }
}

const blockRepresentation = getBlockRepresentation(input)
const compactedRepresentation = compactFiles(blockRepresentation)
const checksum = ((compacted: Block[]): number => {
  let sum = 0
  compacted.forEach((obj, index) => {
    sum += ((obj.fileID ?? 0) * index)
  })

  return sum
})(compactedRepresentation)

// console.log(blockRepresentation.join(''))
// console.log(input.length)
console.log(checksum)
// console.log(checksum)
