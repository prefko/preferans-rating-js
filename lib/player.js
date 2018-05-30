#!/usr/bin/env node
'use strict';

const _ = require('lodash');

class Player {
	constructor(score, rating = 1000) {
		if (!score && score !== 0) throw new Error("No score defined", score);
		this.oldRating = rating > 0 ? rating : 1000;
		this.score = score;
		this.newRating = null;
		return this;
	}

	setRatingChange(change) {
		if (!change) throw new Error("No change defined", change);
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

module.exports = Player;