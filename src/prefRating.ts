#!/usr/bin/env node
'use strict';

import * as math from 'mathjs';
import PrefRatingPlayer, {PrefRatingPlayerObject} from './prefRatingPlayer';

export type PrefRatingCalc = { a12: number, a13: number, a23: number }
export type PrefRatingChanges = { c1: number, c2: number, c3: number }
export type PrefRatingObject = { bula: number, p1: PrefRatingPlayerObject, p2: PrefRatingPlayerObject, p3: PrefRatingPlayerObject }

/**
 * @constant
 * @type {number}
 * @default
 */
const MAGIC = 2.8;

const _calcD = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number =>
	Number(math.round(
		math
			.chain(p1.score)
			.subtract(p2.score)
			.divide(bula)
			.done(),
		3,
	));
const _calculateDs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingCalc => ({
	a12: _calcD(p1, p2, bula),
	a13: _calcD(p1, p3, bula),
	a23: _calcD(p2, p3, bula),
});

const _calcT = (p1: PrefRatingPlayer, p2: PrefRatingPlayer): number =>
	Number(math.round(
		math
			.chain(p2.rating)
			.subtract(p1.rating)
			.multiply(MAGIC)
			.divide(100)
			.done(),
		3,
	));
const _calculateTs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer): PrefRatingCalc => ({
	a12: _calcT(p1, p2),
	a13: _calcT(p1, p3),
	a23: _calcT(p2, p3),
});

const _calcN = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const _calculateNs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingCalc => ({
	a12: _calcN(p1, p2, bula),
	a13: _calcN(p1, p3, bula),
	a23: _calcN(p2, p3, bula),
});

const _calcC = (c1: number, c2: number): number =>
	Number(math.round(
		math
			.chain(c1)
			.add(c2)
			.divide(2)
			.done(),
	));
const _calculateChanges = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingChanges => {
	const D: PrefRatingCalc = _calculateDs(p1, p2, p3, bula);
	const T: PrefRatingCalc = _calculateTs(p1, p2, p3);
	const N: PrefRatingCalc = _calculateNs(p1, p2, p3, bula);

	const C12 = D.a12 + T.a12 + N.a12;
	const C13 = D.a13 + T.a13 + N.a13;
	const C23 = D.a23 + T.a23 + N.a23;

	return {
		c1: _calcC(C12, C13),
		c2: _calcC(-C12, C23),
		c3: _calcC(-C13, -C23),
	};
};

/** This is the Preferans Rating main class.
 * @typedef {Object} PrefRating
 * @property {number} bula The game bula
 * @property {PrefRatingPlayer} p1 The 1st PrefRatingPlayer
 * @property {PrefRatingPlayer} p2 The 2nd PrefRatingPlayer
 * @property {PrefRatingPlayer} p3 The 3rd PrefRatingPlayer
 */
export default class PrefRating {
	private readonly _p1: PrefRatingPlayer;
	private readonly _p2: PrefRatingPlayer;
	private readonly _p3: PrefRatingPlayer;
	private readonly _bula: number;

	/** @constructor
	 * @param {PrefRatingPlayer} p1 - 1st player object
	 * @param {PrefRatingPlayer} p2 - 2nd player object
	 * @param {PrefRatingPlayer} p3 - 3rd player object
	 * @param {number} bula - Game bula
	 * @returns {object} PrefRating instance
	 */
	constructor(p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number) {
		this._p1 = p1;
		this._p2 = p2;
		this._p3 = p3;
		this._bula = bula;

		const {c1, c2, c3} = _calculateChanges(p1, p2, p3, bula);
		this._p1.change = c1;
		this._p2.change = c2;
		this._p3.change = c3;
	}

	/** Getter.
	 * @returns {Rating} Rating as object
	 */
	get rating(): PrefRatingObject {
		return {
			bula: this._bula,
			p1: this._p1.json,
			p2: this._p2.json,
			p3: this._p3.json,
		};
	}
}
