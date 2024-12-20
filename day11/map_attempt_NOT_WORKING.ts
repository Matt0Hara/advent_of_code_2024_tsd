class Stone
{
  constructor(
    public number: number,
    public blinkNumber: number = 0
  ) {}

  react(): Stone[] {
    const stringVal = this.number.toString()
    if (this.number === 0) {
      this.number = 1
      this.blinkNumber++
      return [this]
    } else if (stringVal.length % 2 === 0) {
      const sub1 = stringVal.substring(0, stringVal.length / 2)
      const sub2 = stringVal.substring(stringVal.length / 2, stringVal.length)

      return [
        new Stone(parseInt(sub1), this.blinkNumber + 1),
        new Stone(parseInt(sub2), this.blinkNumber + 1)
      ]
    } else {
      this.number = this.number * 2024
      this.blinkNumber++
      return [this]
    }
  }
}

class StoneList
{
  constructor(
    public stones: Stone[]
  ) {}

  blink() {
    this.stones = this.stones.map((stone) => stone.react())
      .flat()
  }

  getStoneString() {
    return this.stones.map((stone) => stone.number).join(' ')
  }

  getStoneNumber() {
    return this.stones.length
  }
}

const input = Deno.readTextFileSync('input.txt')
const stoneList = new StoneList(input.split(' ').map((item: string) => new Stone(parseInt(item))))


const stones: Stone[] = stoneList.stones
let currentStone = null
let sum = 0
const blinkNumber = 75

while ((currentStone = stones.shift())) {
  const stoneList = new StoneList([currentStone])
  stoneList.blink()

  if (stoneList.stones[0].blinkNumber === blinkNumber) {
    sum += stoneList.stones.length
  } else {
    stones.unshift(...stoneList.stones)
  }
}

console.log(sum)

// Deno.writeTextFile('test_input.txt', stoneList.getStoneString())

// console.log(stoneList.getStoneString())
// console.log(stoneList.getStoneNumber())
// console.log(Deno.memoryUsage().heapTotal / 1000000)

