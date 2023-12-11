export function parser(input: string[]) {
	return input.map((line) => line.split(''));
}

const computeDistance = (
	from: { row: number; col: number },
	to: { row: number; col: number },
	rowsToWiden: number[],
	colsToWiden: number[],
	expandBy: number
) => {
	const startRow = from.row < to.row ? from.row : to.row;
	const endRow = from.row > to.row ? from.row : to.row;
	const startCol = from.col < to.col ? from.col : to.col;
	const endCol = from.col > to.col ? from.col : to.col;

	return (
		endRow -
		startRow +
		endCol -
		startCol +
		rowsToWiden.filter((r) => startRow < r && r < endRow).length * (expandBy - 1) +
		colsToWiden.filter((c) => startCol < c && c < endCol).length * (expandBy - 1)
	);
};

const getDistances = (input: string[][], expandBy: number) => {
	const rowsToWiden = input.map((line, i) => (line.some((c) => c === '#') ? NaN : i)).filter(Number);
	const colsToWiden = input[0].map((_, i) => (input.map((row) => row[i]).includes('#') ? NaN : i)).filter(Number);

	const galaxies = input
		.map((line, row) => line.map((c, col) => (c === '#' ? { row, col } : null)).filter(Boolean))
		.filter(Boolean)
		.flat(1)
		.map((g, i) => ({ ...g, id: i + 1 })) as {
		id: number;
		row: number;
		col: number;
	}[];

	const distances: { from: number; to: number; distance: number }[] = [];

	const done = galaxies.reduce((prev, curr) => {
		prev[curr.id] = 0;
		return prev;
	}, {});
	const max = galaxies.length - 1;

	for (const from of galaxies) {
		for (const to of galaxies) {
			if (from.id === to.id || done[from.id] === max || done[to.id] === max) continue;

			distances.push({
				from: from.id,
				to: to.id,
				distance: computeDistance(from, to, rowsToWiden, colsToWiden, expandBy)
			});
			done[from.id]++;
			done[to.id]++;
		}
	}

	return distances.reduce((prev, curr) => prev + curr.distance, 0);
};

export function p1(input: string[][]) {
	return getDistances(input, 2);
}

export function p2(input: string[][]) {
	return getDistances(input, 1000000);
}
