const pad = (n: string) => {
	if (parseInt(n) <= 9) return `0${n}`;
	return n;
};

const args = Deno.args;

const day = pad(args[0]);
const part = parseInt(args[1]);

const data = await Deno.readFile(`./inputs/d${day}.txt`);
let input: string[] = new TextDecoder()
	.decode(data)
	.split('\n')
	.map((l) => l.trim());
const runner = await import(`./solutions/d${day}.ts`);

if (runner['parser']) input = runner.parser(input);

const start = performance.now();
const output = part === 1 ? await runner.p1(input) : await runner.p2(input);
const end = performance.now();

console.log(output, `in ${(end - start).toFixed(2)} ms`);
