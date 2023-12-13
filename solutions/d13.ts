export function parser(input: string[]) {
	return input
		.join('\n')
		.split('\n\n')
		.map((i) => i.split('\n'));
}

const findLine = (input: string[], direction: 'HOR' | 'VER', smudge = false) => {
	const cols = input[0].length;
	const limit = direction === 'HOR' ? input.length : cols;
	const checks = direction === 'HOR' ? cols : input.length;

	for (let ref = 1; ref < limit; ref++) {
		let isReflection = true;
		let usedSmudge = !smudge;

		for (let i = 0; i < checks; i++) {
			let x = ref - 1;
			let y = ref;

			do {
				const left = direction === 'HOR' ? input[x][i] : input[i][x];
				const right = direction === 'HOR' ? input[y][i] : input[i][y];

				if (left !== right) {
					if (usedSmudge) {
						isReflection = false;
						break;
					} else {
						usedSmudge = true;
					}
				}
			} while (--x >= 0 && ++y < limit);

			if (!isReflection) break;
		}

		if (isReflection && (!smudge || usedSmudge)) return ref;
	}

	return null;
};

export function p1(inputs: string[][], smudge = false) {
	return inputs
		.map((input) => findLine(input, 'VER', smudge) ?? findLine(input, 'HOR', smudge)! * 100)
		.reduce((a, b) => a + b, 0);
}

export function p2(inputs: string[][]) {
	return p1(inputs, true);
}
