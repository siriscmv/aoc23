# Advent of Code 2023

- List of problems can be found [here](https://adventofcode.com/2023/)

## File structure

- `main.ts` - main file that runs the solution
- `inputs/d*.txt` - input data for each day
- `solutions/d*.ts` - solutions for each day

## Solutions

- Each solution exports `p1` and `p2` functions that take the input data and return the solution
- The default input is an array of strings where each element is a line from the input file (`string[]`)
- Solutions that export a `parser` function will have the input data passed through the parser before being passed to `p1` and `p2`
- Solutions can be run with `deno run -A main.ts <day> <part>`
