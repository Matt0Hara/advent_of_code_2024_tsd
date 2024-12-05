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
      line.forEach((_char, column) => {
        let word = null
        if (this.characterMap[row][column] === this.firstChar) {
          word = this.word
        } else if (this.characterMap[row][column] === this.lastChar) {
          word = this.reverseWord
        } else {
          return
        }

        const results = [
          this.checkRight(row, column, word),
          this.checkDown(row, column, word),
          this.checkDiagRight(row, column, word),
          this.checkDiagLeft(row, column, word),
        ]

        this.matchesCount += results.filter((result) => !!result)
          .length
      })
    })

    return this.matchesCount
  }

  checkRight(row: number, column : number, word: string): boolean {
    let currentWord: string = ''
    for (let i = column; i <= this.maxCol; i++) {
      currentWord += this.characterMap[row][i]

      if (currentWord === word) {
        console.log(row, column, "right", word)
        return true
      } else if (!word.includes(currentWord)) {
        return false
      }
    }

    return false
  }

  checkDown(row: number, column : number, word: string): boolean {
    let currentWord: string = ''
    for (let i = row; i <= this.maxRow; i++) {
      currentWord += this.characterMap[i][column]

      if (currentWord === word) {
        console.log(row, column, "down", word)
        return true
      } else if (!word.includes(currentWord)) {
        return false
      }
    }

    return false
  }

  checkDiagRight(row: number, column : number, word: string): boolean {
    let currentWord: string = ''
    let newChar: string | null = ''
    let i = 0
    while(true) {
      newChar = this.characterMap?.at(row + i)?.at(column + i) ?? null
      if (newChar === null || (row < 0) ||(column < 0)) {
        break
      } else {
        currentWord += newChar
      }

      if (currentWord === word) {
        return true
      } else if (!word.includes(currentWord)) {
        return false
      }

      i++
    }

    return false
  }

  checkDiagLeft(row: number, column : number, word: string): boolean {
    let currentWord: string = ''
    let newChar: string | null = ''
    let i = 0
    while(true) {
      newChar = this.characterMap?.at(row + i)?.at(column - i) ?? null

      if (newChar === null || (column - i) < 0) {
        break
      } else {
        currentWord += newChar
      }

      if (currentWord === word) {
        return true
      } else if (!word.includes(currentWord)) {
        return false
      }

      i++
    }

    return false
  }
}


const characterMap: string[][] = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => line.split(''))

const parser = new Parser(characterMap, 'XMAS')
console.log(parser.search())