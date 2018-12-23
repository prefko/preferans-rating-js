#!/usr/bin/env node
'use strict';

export type PrefRatingPlayerObject = {
	username: string,
	score: number,
	rating: number,
	change: number,
	oldRating: number
}

/**
 * @typedef {Object} PrefRatingPlayer
 * @property {string} username Username
 * @property {number} score Score
 * @property {number} rating Rating
 */
export default class PrefRatingPlayer {
	readonly _username: string;
	readonly _score: number;
	private _rating: number;
	private _change: number = 0;

	/** @constructor
	 * @param {string} username - Username
	 * @param {number} score - Score
	 * @param {number} rating - Rating
	 * @returns {object} PrefRatingPlayer instance
	 */
	constructor(username: string, rating: number, score: number) {
		this._username = username;
		this._rating = rating;
		this._score = score;
	}

	get username(): string {
		return this._username;
	}

	get score(): number {
		return this._score;
	}

	get rating(): number {
		return this._rating;
	}

	get change(): number {
		return this._change;
	}

	set change(change: number) {
		this._change = change;
		this._rating += this._change;
	}

	public getObject(): PrefRatingPlayerObject {
		return {
			username: this.username,
			score: this.score,
			rating: this.rating,
			change: this.change,
			oldRating: this.rating - this.change
		}
	}
}
