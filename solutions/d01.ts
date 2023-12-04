export function p1(input: string[]) {
	let sum = 0;

	for (const line of input) {
		let first: number | null = null;
		let last: number | null = null;

		for (const char of line) {
			if (/\d/.test(char)) {
				if (first === null) first = parseInt(char);
				last = parseInt(char);
			}
		}

		sum += first! * 10 + last!;
	}

	return sum;
}

const parseNumber = (n: string) => {
	if (/\d/.test(n)) return parseInt(n);

	switch (n) {
		case 'one':
			return 1;
		case 'two':
			return 2;
		case 'three':
			return 3;
		case 'four':
			return 4;
		case 'five':
			return 5;
		case 'six':
			return 6;
		case 'seven':
			return 7;
		case 'eight':
			return 8;
		case 'nine':
			return 9;
		default:
			return NaN;
	}
};

export function p2(input: string[]) {
	const r1 = /^.*?([1-9]|one|two|three|four|five|six|seven|eight|nine)/;
	const r2 = /.*([1-9]|one|two|three|four|five|six|seven|eight|nine)/;
	let sum = 0;

	for (const line of input) {
		sum += parseNumber(r1.exec(line)![1]) * 10 + parseNumber(r2.exec(line)![1]);
	}

	return sum;
}
