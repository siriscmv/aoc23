export function p1(input: string[]) {
	let sum = 0;

	for (let card = 0; card < input.length; card++) {
		const parts = input[card].split('|');
		const winningNumbers = parts[0]
			.split(':')[1]
			.trim()
			.split(' ')
			.filter(Boolean)
			.map((n) => parseInt(n));
		const chosenNumbers = parts[1]
			.trim()
			.split(' ')
			.filter(Boolean)
			.map((n) => parseInt(n));

		const matches = chosenNumbers.filter((n) => winningNumbers.includes(n)).length;
		if (matches > 0) sum += Math.pow(2, matches - 1);
	}

	return sum;
}

export function p2(input: string[]) {
	const matches: Map<number, number> = new Map();

	for (let card = 0; card < input.length; card++) {
		const parts = input[card].split('|');
		const winningNumbers = parts[0]
			.split(':')[1]
			.trim()
			.split(' ')
			.filter(Boolean)
			.map((n) => parseInt(n));
		const chosenNumbers = parts[1]
			.trim()
			.split(' ')
			.filter(Boolean)
			.map((n) => parseInt(n));

		matches.set(card + 1, chosenNumbers.filter((n) => winningNumbers.includes(n)).length);
	}

	const keys = Array.from(matches.keys());
	const instances: Map<number, number> = new Map();
	for (const card of keys) instances.set(card, 1);

	for (const card of keys) {
		for (let i = card + 1; i <= card + matches.get(card)!; i++) {
			instances.set(i, instances.get(i)! + instances.get(card)!);
		}
	}

	return Array.from(instances.values()).reduce((a, v) => a + v, 0);
}
