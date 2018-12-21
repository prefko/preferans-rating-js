#!/usr/bin/env node
'use strict';

/**
 * @typedef {Object} Rating
 * @property {number} bula The game bula
 * @property {PrefRatingPlayer} p1 The 1st PrefRatingPlayer
 * @property {PrefRatingPlayer} p2 The 2nd PrefRatingPlayer
 * @property {PrefRatingPlayer} p3 The 3rd PrefRatingPlayer
 */

import * as math from 'mathjs';
import PrefRatingPlayer, {PrefRatingPlayerObject} from './prefRatingPlayer';

export type PrefRatingDs = { D12: number, D13: number, D23: number }
export type PrefRatingTs = { T12: number, T13: number, T23: number }
export type PrefRatingNs = { N12: number, N13: number, N23: number }
export type PrefRatingChanges = { change1: number, change2: number, change3: number }
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
const calculateDs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingDs => ({
	D12: calcD(p1, p2, bula),
	D13: calcD(p1, p3, bula),
	D23: calcD(p2, p3, bula),
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
const calculateTs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer): PrefRatingTs => ({
	T12: calcT(p1, p2),
	T13: calcT(p1, p3),
	T23: calcT(p2, p3),
});

const calcN = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const calculateNs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): PrefRatingNs => ({
	N12: calcN(p1, p2, bula),
	N13: calcN(p1, p3, bula),
	N23: calcN(p2, p3, bula),
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
	const D: PrefRatingDs = calculateDs(p1, p2, p3, bula);
	const T: PrefRatingTs = calculateTs(p1, p2, p3);
	const N: PrefRatingNs = calculateNs(p1, p2, p3, bula);

	const C12 = D.D12 + T.T12 + N.N12;
	const C13 = D.D13 + T.T13 + N.N13;
	const C23 = D.D23 + T.T23 + N.N23;

	return {
		change1: calcC(C12, C13),
		change2: calcC(-C12, C23),
		change3: calcC(-C13, -C23),
	};
};

/** This is the Preferans Rating main class. */
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

		const {change1, change2, change3} = calculateChanges(p1, p2, p3, bula);
		this._p1.change = change1;
		this._p2.change = change2;
		this._p3.change = change3;
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
