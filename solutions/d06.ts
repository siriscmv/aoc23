const isWinning = (val: number, max: number, distance: number) => val * (max - val) > distance;

export function p1(input: string[]) {
	const [times, distances] = input.map((line) => line.match(/\d+/g)!.map(Number));
	let res = 1;

	for (let race = 0; race < times.length; race++) {
		let waysToWin = 0;

		const t = times[race];
		const d = distances[race];

		let mid1 = Math.floor(t / 2);
		let mid2 = mid1 + 1;

		do {
			if (isWinning(mid1--, t, d)) waysToWin++;
			else if (isWinning(mid2++, t, d)) waysToWin++;
			else break;
		} while (1);

		res *= waysToWin;
	}

	return res;
}

export function p2(input: string[]) {
	return p1(input.map((line) => line.replace(/ /g, '')));
}
