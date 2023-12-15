interface Lens {
	label: string;
	focalLength: number;
}

export function parser(input: string[]) {
	return input.join('\n').split(',');
}

const computeHash = (input: string) => {
	let hash = 0;

	for (const char of input) {
		hash += char.charCodeAt(0);
		hash *= 17;
		hash %= 256;
	}

	return hash;
};

export function p1(input: string[]) {
	return input.map(computeHash).reduce((a, b) => a + b, 0);
}

export function p2(input: string[]) {
	const boxes: Lens[][] = Array.from({ length: 256 }, () => []);

	for (const step of input) {
		if (step.includes('-')) {
			const label = step.slice(0, -1);
			const boxId = computeHash(label);

			const box = boxes[boxId];
			boxes[boxId] = box.filter((b) => b.label !== label);
		} else if (step.includes('=')) {
			const label = step.split('=')[0];
			const focalLength = parseInt(step.split('=')[1], 10);
			const boxId = computeHash(label);
			const box = boxes[boxId];

			const lensIndex = box.findIndex((b) => b.label === label);

			if (lensIndex !== -1) box[lensIndex].focalLength = focalLength;
			else box.push({ label, focalLength });
		}
	}

	return boxes
		.map((box, boxId) => box.map(({ focalLength }, lensId) => (1 + boxId) * (lensId + 1) * focalLength))
		.flat(1)
		.reduce((a, b) => a + b, 0);
}
