enum SpringType {
	Damaged = 1,
	Operational,
	Unknown
}

type Row = {
	damaged: number[];
	springs: SpringType[];
};

export function parser(input: string[]) {
	return input.map((line) => {
		const [springs, damaged] = line.split(' ');

		return {
			damaged: damaged.split(',').map(Number),
			springs: springs.split('').map((s) => {
				let type = SpringType.Unknown;
				if (s === '.') type = SpringType.Operational;
				else if (s === '#') type = SpringType.Damaged;

				return type;
			})
		};
	});
}

const cache = new Map<string, number>();
const stringify = (row: Row) => `${row.springs.join('')}|${row.damaged.join(',')}`;

const solve = ({ springs, damaged }: Row) => {
	if (springs.length === 0) {
		if (damaged.length === 0) return 1;
		return 0;
	}

	if (damaged.length === 0) {
		if (springs.some((s) => s === SpringType.Damaged)) return 0;
		return 1;
	}

	const key = stringify({ springs, damaged });
	if (cache.has(key)) return cache.get(key)!;

	let ways = 0;

	if (springs[0] === SpringType.Operational || springs[0] === SpringType.Unknown) {
		ways += solve({ springs: springs.slice(1), damaged });
	}

	if (springs[0] === SpringType.Damaged || springs[0] === SpringType.Unknown) {
		const isValid =
			damaged[0] <= springs.length &&
			!springs.slice(0, damaged[0]).some((s) => s === SpringType.Operational) &&
			(damaged[0] === springs.length || springs[damaged[0]] !== SpringType.Damaged);

		if (isValid) ways += solve({ springs: springs.slice(damaged[0] + 1), damaged: damaged.slice(1) });
	}

	cache.set(key, ways);
	return ways;
};

export function p1(input: Row[]) {
	return input.map(solve).reduce((a, b) => a + b, 0);
}

export function p2(input: Row[]) {
	for (const row of input) {
		const springs = [...row.springs];
		const damaged = [...row.damaged];

		for (let i = 1; i < 5; i++) {
			row.springs.push(SpringType.Unknown, ...springs);
			row.damaged.push(...damaged);
		}
	}

	return p1(input);
}
