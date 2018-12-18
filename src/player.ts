#!/usr/bin/env node
'use strict';

/**
 * @typedef {Object} PrefPlayer
 * @property {string} username Username
 * @property {number} score Score
 * @property {number} rating Rating
 */

export default class PrefPlayer {
	private _username: string;
	private _score: number;
	private _rating: number;
	private _change: number;

	/** @constructor
	 * @param {string} username - Username
	 * @param {number} score - Score
	 * @param {number} rating - Rating
	 * @returns {object} PrefPlayer instance
	 */
	constructor(username: string, rating: number, score: number) {
		this._username = username;
		this._rating = rating;
		this._score = score;
		this._change = 0;
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

	public getObject(): any {
		return {
			username: this.username,
			score: this.score,
			rating: this.rating,
			change: this.change,
			oldRating: this.rating - this.change
		}
	}
}
