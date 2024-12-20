import { chunk } from 'npm:lodash.chunk'

class Stone
{
  constructor(
    public number: number
  ) {}

  react(): Stone[] {
    const stringVal = this.number.toString()
    if (this.number === 0) {
      this.number = 1
      return [this]
    } else if (stringVal.length % 2 === 0) {
      const sub1 = stringVal.substring(0, stringVal.length / 2)
      const sub2 = stringVal.substring(stringVal.length / 2, stringVal.length)

      return [new Stone(parseInt(sub1)), new Stone(parseInt(sub2))]
    } else {
      this.number = this.number * 2024
      return [this]
    }
  }
}

class StoneList
{
  public stones: Stone[] = []

  constructor(stoneMap: string) {
    stoneMap.split(' ')
      .map((value) => {
        this.stones.push(new Stone(parseInt(value)))
      })
  }

  blink() {
    this.stones = this.stones.map((stone) => stone.react()).flat()
  }

  getStoneString() {
    return this.stones.map((stone) => stone.number).join(' ')
  }

  getStoneNumber() {
    return this.stones.length
  }
}

const blinks = [...Array(10).keys()]

const stoneList = new StoneList(Deno.readTextFileSync('example_input.txt'))

let sum = 0

for (const blink of blinks) {
  stoneList.blink()
}

const cache = new Map()
for (const stone of stoneList.stones) {
  const count = cache.get(stone.number)
  if (typeof count === "number") {
    cache.set(stone.number, count + 1)
  } else {
    cache.set(stone.number, 1)
  }
}

console.log(cache)

