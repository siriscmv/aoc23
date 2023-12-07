const CARD_STRENGTH = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const MODIFIED_CARD_STRENGTH = [...CARD_STRENGTH.filter((c) => c !== 'J'), 'J'];

type Card = [{ original: string; upgraded?: string }, number];

const getContentsOfHand = (hand: string) => {
	const occurrences = new Map<string, number>();
	for (const char of hand) {
		if (occurrences.has(char)) occurrences.set(char, occurrences.get(char)! + 1);
		else occurrences.set(char, 1);
	}

	return occurrences;
};

const getKind = (hand: string) => {
	const occurrences = getContentsOfHand(hand);
	const values = Array.from(occurrences.values()).sort((a, b) => b - a);

	if (values.length === 1 && values[0] === 5) return 1;
	if (values.length === 2 && values[0] === 4) return 2;
	if (values.length === 2 && values[0] === 3) return 3;
	if (values.length === 3 && values[0] === 3) return 4;
	if (values.length === 3 && values[0] === 2 && values[1] === 2) return 5;
	if (values.length === 4 && values[0] === 2 && values[1] === 1 && values[2] === 1) return 6;
	if (values.length === 5) return 7;

	return -1;
};

const sorter = ([hand1, _b1]: Card, [hand2, _b2]: Card, strengthOrder = CARD_STRENGTH) => {
	const kind1 = getKind(hand1.upgraded ?? hand1.original);
	const kind2 = getKind(hand2.upgraded ?? hand2.original);

	if (kind1 !== kind2) return kind1 - kind2;

	for (let i = 0; i < 5; i++) {
		if (hand1.original[i] === hand2.original[i]) continue;

		const s1 = strengthOrder.indexOf(hand1.original[i]) + 1;
		const s2 = strengthOrder.indexOf(hand2.original[i]) + 1;
		return s1 - s2;
	}

	return 0;
};

const upgrade = (hand: string) => {
	const occurrences = getContentsOfHand(hand);
	const sorted = [...occurrences.entries()].sort((a, b) => b[1] - a[1]);

	if (!occurrences.has('J')) return hand;
	if (hand === 'JJJJJ') return MODIFIED_CARD_STRENGTH[0].repeat(5);

	const target = sorted[0][0] !== 'J' ? sorted[0] : sorted[1];
	const toUpgrade = occurrences.get('J')!;

	occurrences.set(target[0], occurrences.get(target[0])! + toUpgrade);
	occurrences.delete('J');

	let newHand = '';
	for (const [key, value] of occurrences.entries()) newHand += key.repeat(value);

	return newHand;
};

export function p1(input: string[]) {
	const cards: Card[] = input.map((line) => [{ original: line.split(' ')[0] }, Number(line.split(' ')[1])]);
	const sorted = cards.sort(sorter).reverse();

	return sorted.map(([_, bid], i) => bid * (i + 1)).reduce((a, s) => a + s, 0);
}

export function p2(input: string[]) {
	const cards: Card[] = input.map((line) => [
		{ original: line.split(' ')[0], upgraded: upgrade(line.split(' ')[0]) },
		Number(line.split(' ')[1])
	]);
	const sorted = cards.sort((c1, c2) => sorter(c1, c2, MODIFIED_CARD_STRENGTH)).reverse();

	return sorted.map(([_, bid], i) => bid * (i + 1)).reduce((a, s) => a + s, 0);
}
