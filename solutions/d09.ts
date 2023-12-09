type Input = number[][];

export function parser(input: string[]) {
	return input.map((line) => line.trim().split(' ').map(Number));
}

const getDifferences = (numbers: number[]) => {
	let diff: number[] = [];
	for (let i = 0; i < numbers.length - 1; i++) {
		diff.push(numbers[i + 1] - numbers[i]);
	}

	return diff;
};

export function p1(input: Input) {
	let ans = 0;

	for (const line of input) {
		let layers: number[][] = [line];
		do {
			const diff = getDifferences(layers[layers.length - 1]);
			layers.push(diff);
			if (diff.every((a) => a === 0)) break;
		} while (1);

		for (const layer of layers) ans += layer[layer.length - 1];
	}

	return ans;
}

export function p2(input: Input) {
	let ans = 0;

	for (const line of input) {
		let curr = 0;
		let layers: number[][] = [line];
		do {
			const diff = getDifferences(layers[layers.length - 1]);
			layers.push(diff);
			if (diff.every((a) => a === 0)) break;
		} while (1);

		layers.reverse();
		for (const layer of layers) curr = layer[0] - curr;

		ans += curr;
	}

	return ans;
}
