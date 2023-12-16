const pad = (n: string) => {
	if (parseInt(n) <= 9) return `0${n}`;
	return n;
};

const args = Deno.args;

const day = pad(args[0]);
const part = parseInt(args[1]);

if (!day || !part) {
	console.log('Usage: deno run main.ts <day> <part>');
	Deno.exit(1);
}

if (part !== 1 && part !== 2) {
	console.log('Part must be 1 or 2');
	Deno.exit(1);
}

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
