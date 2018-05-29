#!/usr/bin/env node
'use strict';

const _ = require('lodash');

class Player {
	constructor(score, rating = 1000) {
		this.oldRating = rating > 0 ? rating : 1000;
		this.score = score;
		this.newRating = null;
		return this;
	}

	getData() {
		return {
			score: this.score,
			oldRating: this.oldRating,
			newRating: this.newRating,
			change: this.change
		};
	}

	setRatingChange(change) {
		this.change = change;
		this.newRating = this.oldRating + change;
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
}

module.exports = Player;