const input = Deno.readTextFileSync('input.txt')
  .split('')

type Block = {
  char: string,
  fileID: number | null
  size: number
}

const getBlockRepresentation = (blocks: string[]) : Block[] => {
  let currentFileId = 0
  const blockRepresentation: Block[] = []

  blocks.forEach((block, index) => {
    const isFileBlock = index % 2 === 0
    currentFileId += index !== 0 && isFileBlock ? 1 : 0

    const fillChar = isFileBlock ? currentFileId : '.'
    const fileID = isFileBlock ? currentFileId : null

    blockRepresentation.push({
        char: fillChar,
        fileID,
        size: parseInt(block)
      } as Block
    )
  })

  return blockRepresentation
}

const compactFiles = (blockRepresentation: Block[]) => {
  const fileIds = blockRepresentation
    .map((block) => block.fileID)
    .filter((id) => !!id)
    .reverse()

  fileIds.forEach((fileId) => {
    const fileIndex = blockRepresentation.findIndex((block) => block.fileID === fileId)
    if (!fileIndex) {
      return
    }

    const fileBlockToMove = blockRepresentation[fileIndex]
    const firstFreeSlot = blockRepresentation.findIndex((obj) =>  {
      return obj.char === '.' &&
        obj.size >= fileBlockToMove.size
    })
    const firstFreeBlock = blockRepresentation[firstFreeSlot]
    if (!firstFreeBlock || firstFreeSlot > fileIndex) {
      return
    }

    const difference = firstFreeBlock.size - fileBlockToMove.size

    if (difference === 0) {
      blockRepresentation.splice(firstFreeSlot, 1, fileBlockToMove)
      blockRepresentation.splice(fileIndex, 1, {...firstFreeBlock, size: fileBlockToMove.size})
    } else if (difference >= 0) {
      firstFreeBlock.size = difference
      blockRepresentation[firstFreeSlot] = {
        char: '.',
        fileID: null,
        size: difference
      }
      blockRepresentation.splice(fileIndex, 1, {...firstFreeBlock, size: fileBlockToMove.size})
      blockRepresentation.splice(firstFreeSlot, 0, fileBlockToMove)
    }
  })

  return blockRepresentation
}

const blockRepresentation = getBlockRepresentation(input)
const compactedRepresentation = compactFiles(blockRepresentation)

let sum = 0
blockRepresentation.flatMap((block) => Array(block.size).fill(block.char as string))
  .map((char: string, index) => {
    if (char !== '.') {
      sum += (parseInt(char) * index)
    }
  })

console.log(sum)
