import * as R from 'npm:remeda'

// const total = R.pipe(
//   [1,2,3,3,3,3,3,3,3,4,5],
//   R.unique(),
//   R.sum()
// )


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
    const secondIndex = update.pages.findIndex((v) => v === this.secondPage)

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

  checkRules(rules: Rule[]) {
    let allGreen = rules.map((r) => r.checkUpdate(this))
      .every((v) => !!v)

    return allGreen
  }

  fixPages(rules: Rule[]) {
    rules.map((rule) => {
      this.pages.forEach(() => {
        const firstIndex = this.pages.findIndex((v) => v === rule.firstPage)
        const secondIndex = this.pages.findIndex((v) => v === rule.secondPage)

        if (firstIndex >= 0 && secondIndex >= 0 && (firstIndex > secondIndex)) {
          this.pages.splice(secondIndex, 1)
          this.pages.splice(firstIndex, 0, rule.secondPage)
        }
      })
    })

    if (!this.checkRules(rules)) {
      this.fixPages(rules)
    }
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
  return !update.checkRules(rules)
}).map((update) => {
  update.fixPages(rules)
  return update.findMiddle()
}).reduce(
  (acc, curr) => acc + curr,
  0
)

console.log(updateSum)



