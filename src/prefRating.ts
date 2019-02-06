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

const calcD = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number =>
	Number(math.round(
		math
			.chain(p1.score)
			.subtract(p2.score)
			.divide(bula)
			.done(),
		3,
	));
const calculateDs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingCalc => ({
	a12: calcD(p1, p2, bula),
	a13: calcD(p1, p3, bula),
	a23: calcD(p2, p3, bula),
});

const calcT = (p1: PrefRatingPlayer, p2: PrefRatingPlayer): number =>
	Number(math.round(
		math
			.chain(p2.rating)
			.subtract(p1.rating)
			.multiply(MAGIC)
			.divide(100)
			.done(),
		3,
	));
const calculateTs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer): PrefRatingCalc => ({
	a12: calcT(p1, p2),
	a13: calcT(p1, p3),
	a23: calcT(p2, p3),
});

const calcN = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const calculateNs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingCalc => ({
	a12: calcN(p1, p2, bula),
	a13: calcN(p1, p3, bula),
	a23: calcN(p2, p3, bula),
});

const calcC = (c1: number, c2: number): number =>
	Number(math.round(
		math
			.chain(c1)
			.add(c2)
			.divide(2)
			.done(),
	));
const calculateChanges = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingChanges => {
	const D: PrefRatingCalc = calculateDs(p1, p2, p3, bula);
	const T: PrefRatingCalc = calculateTs(p1, p2, p3);
	const N: PrefRatingCalc = calculateNs(p1, p2, p3, bula);

	const C12 = D.a12 + T.a12 + N.a12;
	const C13 = D.a13 + T.a13 + N.a13;
	const C23 = D.a23 + T.a23 + N.a23;

	return {
		c1: calcC(C12, C13),
		c2: calcC(-C12, C23),
		c3: calcC(-C13, -C23),
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
	readonly _p1: PrefRatingPlayer;
	readonly _p2: PrefRatingPlayer;
	readonly _p3: PrefRatingPlayer;
	readonly _bula: number;

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

		const {c1, c2, c3} = calculateChanges(p1, p2, p3, bula);
		this._p1.change = c1;
		this._p2.change = c2;
		this._p3.change = c3;
	}

	/** Getter.
	 * @returns {Rating} Rating as object
	 */
	public getObject(): PrefRatingObject {
		return {
			bula: this._bula,
			p1: this._p1.getObject(),
			p2: this._p2.getObject(),
			p3: this._p3.getObject(),
		};
	}
}
