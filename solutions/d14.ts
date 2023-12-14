export function parser(input: string[]) {
	return input.map((line) => line.split(''));
}

const tiltNorth = (input: string[][]) => {
	for (let j = 0; j < input[0].length; j++) {
		for (let i = 0; i < input.length; i++) {
			if (input[i][j] === 'O') {
				let curr = i;

				while (input[--curr]?.[j] === '.') {
					input[curr][j] = 'O';
					input[curr + 1][j] = '.';
				}
			}
		}
	}
};

const tiltSouth = (input: string[][]) => {
	for (let j = 0; j < input[0].length; j++) {
		for (let i = input.length - 1; i >= 0; i--) {
			if (input[i][j] === 'O') {
				let curr = i;

				while (input[++curr]?.[j] === '.') {
					input[curr][j] = 'O';
					input[curr - 1][j] = '.';
				}
			}
		}
	}
};

const tiltEast = (input: string[][]) => {
	for (let i = 0; i < input.length; i++) {
		for (let j = input[0].length - 1; j >= 0; j--) {
			if (input[i][j] === 'O') {
				let curr = j;

				while (input[i][++curr] === '.') {
					input[i][curr] = 'O';
					input[i][curr - 1] = '.';
				}
			}
		}
	}
};

const tiltWest = (input: string[][]) => {
	for (let i = 0; i < input.length; i++) {
		for (let j = 0; j < input[0].length; j++) {
			if (input[i][j] === 'O') {
				let curr = j;

				while (input[i][--curr] === '.') {
					input[i][curr] = 'O';
					input[i][curr + 1] = '.';
				}
			}
		}
	}
};

export function p1(input: string[][]) {
	tiltNorth(input);

	const rows = input.length;
	return input.map((line, row) => line.filter((t) => t === 'O').length * (rows - row)).reduce((a, b) => a + b, 0);
}

const stringify = (input: string[][]) => input.map((line) => line.join('')).join(',');

export function p2(input: string[][]) {
	const grids: string[] = [stringify(input)];
	let curr = '',
		i = 0;

	for (i = 0; i < 1000000000; i++) {
		tiltNorth(input);
		tiltWest(input);
		tiltSouth(input);
		tiltEast(input);

		curr = stringify(input);

		if (grids.some((g) => g === curr)) break;
		grids.push(curr);
	}

	const repeatsAfter = grids.findIndex((g) => g === curr);
	const repeatLen = i + 1 - repeatsAfter;
	const grid = grids[repeatsAfter + ((1000000000 - repeatsAfter) % repeatLen)];
	input = grid.split(',').map((line) => line.split(''));

	return input
		.map((line, row) => line.filter((t) => t === 'O').length * (input.length - row))
		.reduce((a, b) => a + b, 0);
}
