const [rulesText, updatesText] = Deno.readTextFileSync('input.txt')
  .split("\n\n")

class Rule
{
  constructor(
    public firstPage: number,
    public secondPage: number
  ) {}

  checkUpdate(update: Update): boolean {
    const firstIndex = update.pages.findIndex((v) => v === this.firstPage)
    const secondIndex = update.pages.findIndex((v) => v ===this.secondPage)

    if (firstIndex >= 0 && secondIndex >= 0) {
      return firstIndex < secondIndex
    } else {
     return true
    }
  }
}

class Update
{
  constructor(public pages: number[]) {}

  findMiddle(): number {
    return this.pages[Math.ceil((this.pages.length - 1) / 2)] ?? null
  }
}

const rules = rulesText.split('\n')
  .map((t) => {
    const [firstPage, secondPage] = t.split('|')
    return new Rule(parseInt(firstPage), parseInt(secondPage))
  })

const updates = updatesText.split("\n")
  .map((t) => {
    return new Update(t.split(',')
      .map((n) => parseInt(n)))
  })

const updateSum = updates.filter((update) => {
  return rules.map((r) => r.checkUpdate(update))
    .every((v) => !!v)
}).map((validUpdate) => validUpdate.findMiddle())
  .reduce(
    (acc, curr) => acc + curr,
    0
  )

console.log(updateSum)


