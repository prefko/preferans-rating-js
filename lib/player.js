#!/usr/bin/env node
"use strict";

class PrefRatingPlayer {
	constructor(rating, score) {
		if (!rating) {
			throw new Error("PrefRatingPlayer::constructor:No rating defined " + rating);
		}
		if (!score && score !== 0) {
			throw new Error("PrefRatingPlayer::constructor:No score defined " + score);
		}
		this.score = score;
		this.newRating = null;
		this.oldRating = rating;
		return this;
	}

	setNewRating(rating) {
		if (!rating) {
			throw new Error("PrefRatingPlayer::setNewRating:No new rating defined " + rating);
		}
		this.newRating = rating;
		this.change = this.newRating - this.oldRating;
		return this;
	}

	setRatingChange(change) {
		if (!change && change !== 0) {
			throw new Error("PrefRatingPlayer::setRatingChange:No rating change defined " + change);
		}
		this.change = change;
		this.newRating = this.oldRating + change;
		return this;
	}

	getScore() {
		return this.score;
	}

	getOldRating() {
		return this.oldRating;
	}

	getNewRating() {
		return this.newRating;
	}

	getChange() {
		return this.change;
	}

	getData() {
		return {
			score: this.score,
			oldRating: this.oldRating,
			newRating: this.newRating,
			change: this.change
		};
	}

}

module.exports = PrefRatingPlayer;