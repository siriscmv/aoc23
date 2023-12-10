enum TileOrientation {
	Unknown = -1,
	VerticalPipe = 1,
	HorizontalPipe,
	NorthEast,
	NorthWest,
	SouthWest,
	SouthEast
}

enum Direction {
	Stop = -2,
	Unknown = -1,
	Top = 1,
	Bottom,
	Right,
	Left
}

type Tile = {
	row: number;
	col: number;
	next: Direction;
};

type Input = {
	tiles: string[][];
	path1: Tile[];
	path2: Tile[];
};

const getOrientation = (tile: string) => {
	switch (tile) {
		case '|':
			return TileOrientation.VerticalPipe;
		case '-':
			return TileOrientation.HorizontalPipe;
		case 'L':
			return TileOrientation.NorthEast;
		case 'J':
			return TileOrientation.NorthWest;
		case '7':
			return TileOrientation.SouthWest;
		case 'F':
			return TileOrientation.SouthEast;
		default:
			return TileOrientation.Unknown;
	}
};

export function parser(input: string[]) {
	const s: Tile = {
		row: input.findIndex((line) => line.includes('S')),
		col: input.find((line) => line.includes('S'))!.indexOf('S'),
		next: Direction.Unknown
	};

	const tiles = input.map((line) => line.trim().split(''));

	const directions: Direction[] = [];

	if (
		[TileOrientation.VerticalPipe, TileOrientation.SouthEast, TileOrientation.SouthWest].includes(
			getOrientation(tiles[s.row - 1]?.[s.col])
		)
	)
		directions.push(Direction.Top);

	if (
		[TileOrientation.VerticalPipe, TileOrientation.NorthEast, TileOrientation.NorthWest].includes(
			getOrientation(tiles[s.row + 1]?.[s.col])
		)
	)
		directions.push(Direction.Bottom);

	if (
		[TileOrientation.HorizontalPipe, TileOrientation.NorthWest, TileOrientation.SouthWest].includes(
			getOrientation(tiles[s.row][s.col + 1])
		)
	)
		directions.push(Direction.Right);

	if (
		[TileOrientation.HorizontalPipe, TileOrientation.NorthEast, TileOrientation.SouthEast].includes(
			getOrientation(tiles[s.row][s.col - 1])
		)
	)
		directions.push(Direction.Left);

	return {
		tiles,
		path1: [{ ...s, next: directions[0] }],
		path2: [{ ...s, next: directions[1] }]
	};
}

const connected = (path1: Tile[], path2: Tile[]) => {
	const p1 = path1[path1.length - 1];
	const p2 = path2[path2.length - 1];

	if (p1.row === p2.row && p1.col === p2.col) return true;
	return false;
};

const getNextDirection = (currentDirection: Direction, newTile: string) => {
	const newTileOrientation = getOrientation(newTile);

	if (currentDirection === Direction.Top) {
		if (newTileOrientation === TileOrientation.VerticalPipe) return Direction.Top;
		else if (newTileOrientation === TileOrientation.SouthEast) return Direction.Right;
		else if (newTileOrientation === TileOrientation.SouthWest) return Direction.Left;
		else return Direction.Unknown;
	} else if (currentDirection === Direction.Bottom) {
		if (newTileOrientation === TileOrientation.VerticalPipe) return Direction.Bottom;
		else if (newTileOrientation === TileOrientation.NorthEast) return Direction.Right;
		else if (newTileOrientation === TileOrientation.NorthWest) return Direction.Left;
		else return Direction.Unknown;
	} else if (currentDirection === Direction.Right) {
		if (newTileOrientation === TileOrientation.HorizontalPipe) return Direction.Right;
		else if (newTileOrientation === TileOrientation.NorthWest) return Direction.Top;
		else if (newTileOrientation === TileOrientation.SouthWest) return Direction.Bottom;
		else return Direction.Unknown;
	} else if (currentDirection === Direction.Left) {
		if (newTileOrientation === TileOrientation.HorizontalPipe) return Direction.Left;
		else if (newTileOrientation === TileOrientation.NorthEast) return Direction.Top;
		else if (newTileOrientation === TileOrientation.SouthEast) return Direction.Bottom;
		else return Direction.Unknown;
	} else return Direction.Unknown;
};

const getNextTile = (tile: Tile, tiles: string[][]) => {
	const { row, col, next: currentDirection } = tile;

	const newRow = currentDirection === Direction.Top ? row - 1 : currentDirection === Direction.Bottom ? row + 1 : row;
	const newCol = currentDirection === Direction.Right ? col + 1 : currentDirection === Direction.Left ? col - 1 : col;
	const newTile = tiles[newRow][newCol];

	return {
		row: newRow,
		col: newCol,
		next: newTile === 'S' ? Direction.Stop : getNextDirection(currentDirection, newTile)
	} as Tile;
};

export function p1(input: Input) {
	const { tiles, path1, path2 } = input;

	do {
		path1.push(getNextTile(path1[path1.length - 1], tiles));
		path2.push(getNextTile(path2[path2.length - 1], tiles));
	} while (!connected(path1, path2));

	return path1.length - 1;
}

const blowUpTile = (tile: string, initalDirections: Direction[] = []) => {
	const base = Array.from({ length: 3 }, () => Array(3).fill('.'));
	const VERT = '|',
		HORZ = '-';

	if (tile === '.') {
	} else if (tile === '|') {
		base[0][1] = VERT;
		base[1][1] = VERT;
		base[2][1] = VERT;
	} else if (tile === '-') {
		base[1][0] = HORZ;
		base[1][1] = HORZ;
		base[1][2] = HORZ;
	} else if (tile === 'L') {
		base[0][1] = VERT;
		base[1][1] = tile;
		base[1][2] = HORZ;
	} else if (tile === 'J') {
		base[0][1] = VERT;
		base[1][1] = tile;
		base[1][0] = HORZ;
	} else if (tile === '7') {
		base[1][0] = HORZ;
		base[1][1] = tile;
		base[2][1] = VERT;
	} else if (tile === 'F') {
		base[1][2] = HORZ;
		base[1][1] = tile;
		base[2][1] = VERT;
	} else if (tile === 'S') {
		const [d1, d2] = initalDirections;

		if (d1 === Direction.Top && d2 === Direction.Bottom) return blowUpTile('|');
		if (d1 === Direction.Top && d2 === Direction.Left) return blowUpTile('J');
		if (d1 === Direction.Top && d2 === Direction.Right) return blowUpTile('L');
		if (d1 === Direction.Bottom && d2 === Direction.Top) return blowUpTile('|');
		if (d1 === Direction.Bottom && d2 === Direction.Left) return blowUpTile('7');
		if (d1 === Direction.Bottom && d2 === Direction.Right) return blowUpTile('F');
		if (d1 === Direction.Left && d2 === Direction.Top) return blowUpTile('J');
		if (d1 === Direction.Left && d2 === Direction.Bottom) return blowUpTile('7');
		if (d1 === Direction.Left && d2 === Direction.Right) return blowUpTile('-');
		if (d1 === Direction.Right && d2 === Direction.Top) return blowUpTile('L');
		if (d1 === Direction.Right && d2 === Direction.Bottom) return blowUpTile('F');
		if (d1 === Direction.Right && d2 === Direction.Left) return blowUpTile('-');
	}

	return base;
};

const blowUpTiles = (tiles: string[][], initalDirections: Direction[]) => {
	const newTiles: string[][] = Array.from({ length: tiles.length * 3 }, () => []);

	for (const [row, line] of tiles.entries()) {
		for (const tile of line) {
			const newTile = blowUpTile(tile, initalDirections)!;

			newTiles[row * 3].push(...newTile[0]);
			newTiles[row * 3 + 1].push(...newTile[1]);
			newTiles[row * 3 + 2].push(...newTile[2]);
		}
	}

	return newTiles;
};

const flood = (tiles: string[][], startRow: number, startCol: number) => {
	const stack = [{ row: startRow, col: startCol }];

	while (stack.length > 0) {
		const { row, col } = stack.pop()!;

		if (tiles[row]?.[col] === '.') {
			tiles[row][col] = '#';

			if (tiles[row - 1]?.[col] === '.') stack.push({ row: row - 1, col });
			if (tiles[row + 1]?.[col] === '.') stack.push({ row: row + 1, col });
			if (tiles[row]?.[col + 1] === '.') stack.push({ row, col: col + 1 });
			if (tiles[row]?.[col - 1] === '.') stack.push({ row, col: col - 1 });
		}
	}
};

const is3x3SquareOfDots = (tiles: string[][], startRow: number, startCol: number) => {
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (tiles[startRow + i][startCol + j] !== '.') {
				return false;
			}
		}
	}
	return true;
};

const count3x3Squares = (tiles: string[][]) => {
	const rows = tiles.length;
	const cols = tiles[0].length;
	let count = 0;

	for (let i = 0; i < rows - 2; i++) {
		for (let j = 0; j < cols - 2; j++) {
			if (is3x3SquareOfDots(tiles, i, j)) {
				for (let a = 0; a < 3; a++) {
					for (let b = 0; b < 3; b++) {
						tiles[i + a][j + b] = 'X';
					}
				}

				count++;
			}
		}
	}

	return count;
};

export function p2(input: Input) {
	const { tiles, path1, path2 } = input;
	const initalDirections = [path1[0].next, path2[0].next];

	const path = path1;
	do {
		path.push(getNextTile(path[path.length - 1], tiles));
	} while (path[path.length - 1].next !== Direction.Stop);

	for (const [row, line] of tiles.entries()) {
		for (const [col, tile] of line.entries()) {
			if (tile !== 'S' && !path.some((t) => t.row === row && t.col === col)) tiles[row][col] = '.';
		}
	}

	const blownUpTiles = blowUpTiles(tiles, initalDirections);
	flood(blownUpTiles, 0, 0);

	return count3x3Squares(blownUpTiles);
}
