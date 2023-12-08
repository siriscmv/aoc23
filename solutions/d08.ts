interface Input {
	directions: string[];
	nodes: { [k: string]: { L: string; R: string } };
}

export function parser(input: string[]) {
	return {
		directions: input[0].trim().split(''),
		nodes: input.slice(2).reduce((prev, curr) => {
			const values = curr.match(/[0-9A-Z]{3}/g)!;
			prev[values[0]] = { L: values[1], R: values[2] };
			return prev;
		}, {})
	};
}

const getSteps = (curr: string, input: Input, p2 = false) => {
	let step = 0;
	do {
		curr = input.nodes[curr][input.directions[step++ % input.directions.length]];

		if (!p2 && curr === 'ZZZ') return step;
		else if (p2 && curr.endsWith('Z')) return step;
	} while (1);

	return NaN;
};

const gcd = (a: number, b: number) => {
	return b === 0 ? a : gcd(b, a % b);
};

export function p1(input: Input) {
	return getSteps('AAA', input);
}

export function p2(input: Input) {
	const starting = Object.keys(input.nodes).filter((k) => k.endsWith('A'));
	const steps = starting.map((curr) => getSteps(curr, input, true));

	return steps.reduce((a, b) => Math.abs(a * b) / gcd(a, b));
}
