import { parseLists } from "./functions.ts"
import { abs } from "https://deno.land/x/math@v1.1.0/abs.ts";

const [list1, list2] = await parseLists('input.txt')

let sum = 0
for(let i = 0; i <= list1.length - 1; i++) {
  sum += parseInt(abs(list1[i] - list2[i]))
}

console.log(sum)