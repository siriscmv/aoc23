interface PartNumber {
	value: string;
	line: number;
	pos: number;
}

type Star = Omit<PartNumber, 'value'>;

const isSymbol = (s: string | undefined) => {
	if (s === undefined) return false;
	if (s === '.') return false;
	if (/\d/.test(s)) return false;

	return true;
};

const abs = (n: number) => {
	if (n < 0) return -1 * n;
	return n;
};

const isCloseToStar = (n: PartNumber, star: Star) => {
	const start = n.pos;
	const end = start + n.value.length - 1;

	if (abs(n.line - star.line) > 1) return false;
	if (abs(start - star.pos) > 1 && abs(end - star.pos) > 1) return false;

	return true;
};

const getRatio = (star: Star, numbers: PartNumber[]) => {
	const possibleNumbers = numbers.filter((n) => isCloseToStar(n, star));

	if (possibleNumbers.length === 2) return parseInt(possibleNumbers[0].value) * parseInt(possibleNumbers[1].value);
	return 0;
};

const isPart = (number: PartNumber, lines: string[]) => {
	const len = number.value.length;

	for (let c = number.pos - 1; c <= number.pos + len; c++) {
		for (let r = number.line - 1; r <= number.line + 1; r++) {
			if (isSymbol(lines[r]?.[c])) return true;
		}
	}

	return false;
};

export function p1(input: string[]) {
	const numbers: PartNumber[] = [];
	const regex = /\d+/g;
	let match: RegExpExecArray | null;
	let i = 0;

	for (const line of input) {
		while ((match = regex.exec(line)) !== null) {
			numbers.push({
				value: match[0],
				pos: match.index,
				line: i
			});
		}

		i++;
	}

	return numbers.filter((n) => isPart(n, input)).reduce((acc, n) => acc + parseInt(n.value), 0);
}

export function p2(input: string[]) {
	const numbers: PartNumber[] = [];
	const stars: Star[] = [];
	const regex = /\d+/g;
	let match: RegExpExecArray | null;
	let i = 0;

	for (const line of input) {
		while ((match = regex.exec(line)) !== null) {
			numbers.push({
				value: match[0],
				pos: match.index,
				line: i
			});
		}

		let c = 0;
		for (const char of line) {
			if (char === '*') {
				stars.push({ line: i, pos: c });
			}

			c++;
		}

		i++;
	}

	const partNumbers = numbers.filter((n) => isPart(n, input));
	return stars.map((s) => getRatio(s, partNumbers)).reduce((acc, value) => acc + value, 0);
}
