'use strict';

import * as math from 'mathjs';

import PrefRatingPlayer from './pref.rating.player';
import {TPrefRatingObject, TPrefRatingPlayerInput, PrefRatingPlayerObject} from './pref.rating.types';

type _TPrefRatingCalc = {a12: number; a13: number; a23: number};
type _TPrefRatingChanges = {c1: number; c2: number; c3: number};

const MAGIC = 2.8;

const _calcD = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => Number(math.round(math.chain(p1.score).subtract(p2.score).divide(bula).done(), 3));
const _calculateDs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): _TPrefRatingCalc => ({
	a12: _calcD(p1, p2, bula),
	a13: _calcD(p1, p3, bula),
	a23: _calcD(p2, p3, bula)
});

const _calcT = (p1: PrefRatingPlayer, p2: PrefRatingPlayer): number => Number(math.round(math.chain(p2.rating).subtract(p1.rating).multiply(MAGIC).divide(100).done(), 3));
const _calculateTs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer): _TPrefRatingCalc => ({
	a12: _calcT(p1, p2),
	a13: _calcT(p1, p3),
	a23: _calcT(p2, p3)
});

const _calcN = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const _calculateNs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): _TPrefRatingCalc => ({
	a12: _calcN(p1, p2, bula),
	a13: _calcN(p1, p3, bula),
	a23: _calcN(p2, p3, bula)
});

const _calcC = (c1: number, c2: number): number => Number(math.round(math.chain(c1).add(c2).divide(2).done()));
const _calculateChanges = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): _TPrefRatingChanges => {
	const D: _TPrefRatingCalc = _calculateDs(p1, p2, p3, bula);
	const T: _TPrefRatingCalc = _calculateTs(p1, p2, p3);
	const N: _TPrefRatingCalc = _calculateNs(p1, p2, p3, bula);

	const C12: number = D.a12 + T.a12 + N.a12;
	const C13: number = D.a13 + T.a13 + N.a13;
	const C23: number = D.a23 + T.a23 + N.a23;

	return {
		c1: _calcC(C12, C13),
		c2: _calcC(-C12, C23),
		c3: _calcC(-C13, -C23)
	};
};

export {TPrefRatingObject, TPrefRatingPlayerInput, PrefRatingPlayerObject};

export default class PrefRating {
	private readonly _p1: PrefRatingPlayer;
	private readonly _p2: PrefRatingPlayer;
	private readonly _p3: PrefRatingPlayer;
	private readonly _bula: number;

	constructor(p1: TPrefRatingPlayerInput, p2: TPrefRatingPlayerInput, p3: TPrefRatingPlayerInput, bula: number) {
		this._p1 = new PrefRatingPlayer(p1.username, p1.rating, p1.score);
		this._p2 = new PrefRatingPlayer(p2.username, p2.rating, p2.score);
		this._p3 = new PrefRatingPlayer(p3.username, p3.rating, p3.score);
		this._bula = bula;

		const {c1, c2, c3} = _calculateChanges(this._p1, this._p2, this._p3, this._bula);
		this._p1.change = c1;
		this._p2.change = c2;
		this._p3.change = c3;
	}

	get rating(): TPrefRatingObject {
		return {
			bula: this._bula,
			p1: this._p1.json,
			p2: this._p2.json,
			p3: this._p3.json
		};
	}
}
