const R = 12;
const G = 13;
const B = 14;

const regexR = /(\d+) red/g;
const regexG = /(\d+) green/g;
const regexB = /(\d+) blue/g;

const check = (matches: number[], max: number) => {
	for (const num of matches) {
		if (num > max) return false;
	}

	return true;
};

export function p1(input: string[]) {
	let sum = 0;

	for (let i = 0; i < input.length; i++) {
		if (
			!check(
				input[i].match(regexR)!.map((s) => parseInt(s.split(' ')[0])),
				R
			)
		)
			continue;

		if (
			!check(
				input[i].match(regexG)!.map((s) => parseInt(s.split(' ')[0])),
				G
			)
		)
			continue;

		if (
			!check(
				input[i].match(regexB)!.map((s) => parseInt(s.split(' ')[0])),
				B
			)
		)
			continue;

		sum += i + 1;
	}

	return sum;
}

export function p2(input: string[]) {
	let sum = 0;

	for (const line of input) {
		const r = Math.max(...line.match(regexR)!.map((s) => parseInt(s.split(' ')[0])));
		const g = Math.max(...line.match(regexG)!.map((s) => parseInt(s.split(' ')[0])));
		const b = Math.max(...line.match(regexB)!.map((s) => parseInt(s.split(' ')[0])));

		sum += r * g * b;
	}

	return sum;
}
