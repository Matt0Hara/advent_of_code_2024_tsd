class OperatorPermutator
{
  private possibleOperators = ['*', '+', '||']
  private child?: OperatorPermutator
  constructor(
    depth: number
  ) {
    if (depth > 1) {
      this.child = new OperatorPermutator(depth - 1)
    }
  }

  *cycle(): Generator {
    for (const operator of this.possibleOperators) {
      if (this.child) {
        for (const childOutput of this.child.cycle()) {
          yield [operator, ...childOutput as number[]]
        }
      } else {
        yield [operator]
      }
    }
  }
}

class Equation
{
  private operatorIterator: OperatorPermutator

  constructor(
    public result: number,
    public operands: number[]
  ) {
    this.operatorIterator = new OperatorPermutator(this.operands.length - 1)
  }

  calculate(): boolean {
    let hasMatch = false;
    this.operatorIterator.cycle().forEach((permutation) => {
      let permutationSum = 0
      this.operands.forEach((operand: number, index: number) => {
        if (index === 0) {
          permutationSum += operand
          return
        } else {
          switch(permutation?.pop()) {
            case '+':
              permutationSum += operand
              break
            case '*':
              permutationSum *= operand
              break
            case '||':
              permutationSum = parseInt(permutationSum.toString() + operand)
              break
            default: null
          }
        }
      })

      if (permutationSum === this.result) {
        hasMatch = true
        return
      }
    })

    return hasMatch
  }
}

const equations = Deno.readTextFileSync('input.txt')
  .split("\n")
  .map((line) => {
    const [result, operands] = line.split(':')

    return new Equation(
      parseInt(result),
      operands.split(' ').map((n) => parseInt(n)).toSpliced(0, 1)
    )
  })

let sum = 0
equations.forEach((equation) => {
  sum += equation.calculate() ? equation.result : 0
})

console.log(sum)