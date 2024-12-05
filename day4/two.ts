class Parser {
  private reverseWord = ''
  private firstChar: string
  private lastChar: string
  private maxRow: number
  private maxCol: number
  public matchesCount: number = 0
  constructor(private characterMap: string[][], private word: string) {
    this.firstChar = word.charAt(0)
    this.lastChar = word.charAt(word.length - 1)
    this.reverseWord = this.word.split('').reverse().join('')
    this.maxRow = this.characterMap.length - 1
    this.maxCol = this.characterMap[0].length - 1
  }

  search(): number {
    characterMap.forEach((line, row) => {
      line.forEach((char, column) => {
        if (char === 'A') {
          this.matchesCount += (this.detectX(row, column) ? 1 : 0)
        }
      })
    })

    return this.matchesCount
  }

  detectX(row: number, column: number): boolean {
    if (row === 0 || row === this.maxRow || column === 0 || column === this.maxCol ) {
      return false
    }

    const topLeft = this.characterMap.at(row - 1)?.at(column - 1)
    const topRight = this.characterMap.at(row - 1)?.at(column + 1)
    const bottomLeft = this.characterMap.at(row + 1)?.at(column - 1)
    const bottomRight = this.characterMap.at(row + 1)?.at(column + 1)

    const allDefined: boolean = [
      !!topLeft,
      !!topRight,
      !!bottomLeft,
      !!bottomRight,
    ].every(() => true)

    if (!allDefined) {
      return false
    }

    const validCombo = ['MS', 'SM']

    const assertions = [
      validCombo.includes(topLeft + bottomRight),
      validCombo.includes(bottomLeft + topRight),
    ]

    return assertions.every((v) => v)
  }
}


const characterMap: string[][] = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(''))

const parser = new Parser(characterMap, 'XMAS')
console.log(parser.search())