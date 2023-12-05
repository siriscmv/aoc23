interface Item {
	seed: number;
	soil: number | null;
	fertilizer: number | null;
	water: number | null;
	light: number | null;
	temperature: number | null;
	humidity: number | null;
	location: number | null;
}

const parseSection = (src: keyof Item, dest: keyof Item, input: string, items: Item[]) => {
	const regex = new RegExp(`${src}-to-${dest} map:\n([0-9 \n]+)`, 'g');
	const ranges = input.match(regex)![0].split('\n').slice(1, -2);

	for (const item of items) {
		let found = false;

		for (const range of ranges) {
			const [d, s, l] = range.split(' ').map((n) => parseInt(n));
			if (s <= item[src]! && item[src]! <= s + l - 1) {
				item[dest] = d + item[src]! - s;
				found = true;
				break;
			}
		}

		if (!found) item[dest] = item[src]!;
	}
};

const reverseParse = (item: number, from: keyof Item, to: keyof Item, input: string) => {
	const regex = new RegExp(`${to}-to-${from} map:\n([0-9 \n]+)`, 'g');
	const ranges = input.match(regex)![0].split('\n').slice(1);

	for (const range of ranges) {
		const [d, s, l] = range.split(' ').map((n) => parseInt(n));
		if (d <= item && item <= d + l - 1) return s + item - d;
	}
	return item;
};

const seedExists = (seed: number, seedRow: number[]) => {
	for (let i = 0; i < seedRow.length; i += 2) {
		const start = seedRow[i];
		const end = start + seedRow[i + 1] - 1;

		if (seed >= start && seed <= end) return true;
	}

	return false;
};

export function p1(input: string[]) {
	const seedIDs = input[0]
		.split(':')[1]
		.trim()
		.split(' ')
		.filter(Boolean)
		.map((s) => parseInt(s));

	const items: Item[] = seedIDs.map((seed) => ({
		seed,
		soil: null,
		fertilizer: null,
		water: null,
		light: null,
		temperature: null,
		humidity: null,
		location: null
	}));

	const fullInput = input.join('\n');

	parseSection('seed', 'soil', fullInput, items);
	parseSection('soil', 'fertilizer', fullInput, items);
	parseSection('fertilizer', 'water', fullInput, items);
	parseSection('water', 'light', fullInput, items);
	parseSection('light', 'temperature', fullInput, items);
	parseSection('temperature', 'humidity', fullInput, items);
	parseSection('humidity', 'location', fullInput, items);

	return Math.min(...items.map((i) => i.location!));
}

export function p2(input: string[], start = 0, modifier = 15000) {
	const seedRow = input[0].match(/\d+/g)!.map((s) => parseInt(s));
	const fullInput = input.join('\n');
	const reverseRangesOrder = [...fullInput.match(/\w+-to/g)!.map((s) => s.split('-')[0]), 'location'].reverse();

	let location = start;

	do {
		let seed = location;
		for (let i = 0; i < reverseRangesOrder.length - 1; i++) {
			seed = reverseParse(
				seed,
				reverseRangesOrder[i] as keyof Item,
				reverseRangesOrder[i + 1] as keyof Item,
				fullInput
			);
		}
		if (seedExists(seed, seedRow)) {
			if (modifier === 1) return location;
			else return p2(input, location - modifier, 1);
		}
		location += modifier;
	} while (1);
}
