#!/usr/bin/env node
'use strict';

/**
 * @typedef {Object} Rating
 * @property {number} bula The game bula
 * @property {PrefPlayer} p1 The 1st PrefPlayer
 * @property {PrefPlayer} p2 The 2nd PrefPlayer
 * @property {PrefPlayer} p3 The 3rd PrefPlayer
 */

import * as math from 'mathjs';
import {BigNumber} from "mathjs";
import {Fraction} from "mathjs";
import {Complex} from "mathjs";
import {MathArray} from "mathjs";
import {Matrix} from "mathjs";

import PrefPlayer from './player';

/** @constant
 * @type {number}
 * @default
 */
const MAGIC = 2.8;

const _d = (p1: PrefPlayer, p2: PrefPlayer, bula: number): any =>
	math.round(
		math
			.chain(p1.score)
			.subtract(p2.score)
			.divide(bula)
			.done(),
		3,
	);
const _calculateDs = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer, bula: number): any => ({
	D12: _d(p1, p2, bula),
	D13: _d(p1, p3, bula),
	D23: _d(p2, p3, bula),
});

const _t = (p1: PrefPlayer, p2: PrefPlayer): number | BigNumber | Fraction | Complex | MathArray | Matrix =>
	math.round(
		math
			.chain(p2.rating)
			.subtract(p1.rating)
			.multiply(MAGIC)
			.divide(100)
			.done(),
		3,
	);

const _calculateTs = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer): any => ({
	T12: _t(p1, p2),
	T13: _t(p1, p3),
	T23: _t(p2, p3),
});

const _n = (p1: PrefPlayer, p2: PrefPlayer, bula: number): number => (p1.score > p2.score ? bula : p1.score < p2.score ? -bula : 0) / 100;
const _calculateNs = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer, bula: number): any => ({
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
const _calculateChanges = (p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer, bula: number): any => {
	let D: any = _calculateDs(p1, p2, p3, bula);
	let T = _calculateTs(p1, p2, p3);
	let N = _calculateNs(p1, p2, p3, bula);

	let C12 = D.D12 + T.T12 + N.N12;
	let C13 = D.D13 + T.T13 + N.N13;
	let C23 = D.D23 + T.T23 + N.N23;

	return {
		change1: _c(C12, C13),
		change2: _c(-C12, C23),
		change3: _c(-C13, -C23),
	};
};

/** This is the Preferans Rating main class. */
export default class PrefRating {
	private _p1: PrefPlayer;
	private _p2: PrefPlayer;
	private _p3: PrefPlayer;
	private _bula: number;

	/** @constructor
	 * @param {PrefPlayer} p1 - 1st player object
	 * @param {PrefPlayer} p2 - 2nd player object
	 * @param {PrefPlayer} p3 - 3rd player object
	 * @param {number} bula - Game bula
	 * @returns {object} PrefRating instance
	 */
	constructor(p1: PrefPlayer, p2: PrefPlayer, p3: PrefPlayer, bula: number) {
		this._p1 = p1;
		this._p2 = p2;
		this._p3 = p3;
		this._bula = bula;

		let {change1, change2, change3} = _calculateChanges(p1, p2, p3, bula);
		this._p1.change = change1;
		this._p2.change = change2;
		this._p3.change = change3;

		return this;
	}

	/** Getter.
	 * @returns {Rating} Rating object
	 */
	getRatings(): any {
		return {
			bula: this._bula,
			p1: this._p1.getObject(),
			p2: this._p2.getObject(),
			p3: this._p3.getObject(),
		};
	}
}
