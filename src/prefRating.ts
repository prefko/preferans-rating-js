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
import {BigNumber} from "mathjs";
import {Fraction} from "mathjs";
import {Complex} from "mathjs";
import {MathArray} from "mathjs";
import {Matrix} from "mathjs";

import PrefRatingPlayer from './prefRatingPlayer';

/** @constant
 * @type {number}
 * @default
 */
const MAGIC = 2.8;

const _d = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): any =>
	math.round(
		math
			.chain(p1.score)
			.subtract(p2.score)
			.divide(bula)
			.done(),
		3,
	);
const _calculateDs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): any => ({
	D12: _d(p1, p2, bula),
	D13: _d(p1, p3, bula),
	D23: _d(p2, p3, bula),
});

const _t = (p1: PrefRatingPlayer, p2: PrefRatingPlayer): number | BigNumber | Fraction | Complex | MathArray | Matrix =>
	math.round(
		math
			.chain(p2.rating)
			.subtract(p1.rating)
			.multiply(MAGIC)
			.divide(100)
			.done(),
		3,
	);

const _calculateTs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer): any => ({
	T12: _t(p1, p2),
	T13: _t(p1, p3),
	T23: _t(p2, p3),
});

const _n = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const _calculateNs = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): any => ({
	N12: _n(p1, p2, bula),
	N13: _n(p1, p3, bula),
	N23: _n(p2, p3, bula),
});

const _c = (c1: number, c2: number): number | BigNumber | Fraction | Complex | MathArray | Matrix =>
	math.round(
		math
			.chain(c1)
			.add(c2)
			.divide(2)
			.done(),
	);
const _calculateChanges = (p1: PrefRatingPlayer, p2: PrefRatingPlayer, p3: PrefRatingPlayer, bula: number): any => {
	const D: any = _calculateDs(p1, p2, p3, bula);
	const T = _calculateTs(p1, p2, p3);
	const N = _calculateNs(p1, p2, p3, bula);

	const C12 = D.D12 + T.T12 + N.N12;
	const C13 = D.D13 + T.T13 + N.N13;
	const C23 = D.D23 + T.T23 + N.N23;

	return {
		change1: _c(C12, C13),
		change2: _c(-C12, C23),
		change3: _c(-C13, -C23),
	};
};

/** This is the Preferans Rating main class. */
export default class PrefRating {
	private _p1: PrefRatingPlayer;
	private _p2: PrefRatingPlayer;
	private _p3: PrefRatingPlayer;
	private _bula: number;

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

		let {change1, change2, change3} = _calculateChanges(p1, p2, p3, bula);
		this._p1.change = change1;
		this._p2.change = change2;
		this._p3.change = change3;
	}

	/** Getter.
	 * @returns {Rating} Rating as object
	 */
	getObject(): any {
		return {
			bula: this._bula,
			p1: this._p1.getObject(),
			p2: this._p2.getObject(),
			p3: this._p3.getObject(),
		};
	}
}
