'use strict';

import {PrefRatingPlayerObject} from './pref.rating.types';

export default class PrefRatingPlayer {
	private readonly _username: string;
	private readonly _score: number;
	private readonly _oldRating: number;
	private _rating: number;
	private _change: number = 0;

	constructor(username: string, rating: number, score: number) {
		this._username = username;
		this._oldRating = rating;
		this._rating = rating;
		this._score = score;
	}

	get score(): number {
		return this._score;
	}

	get rating(): number {
		return this._rating;
	}

	set change(change: number) {
		this._change = change;
		this._rating += change;
	}

	get json(): PrefRatingPlayerObject {
		return {
			username: this._username,
			score: this._score,
			rating: this._rating,
			change: this._change,
			oldRating: this._oldRating
		};
	}
}
