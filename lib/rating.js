#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const math = require('mathjs');
const PrefRatingPlayer = require('./player');

const MAGIC = 2.8;

const D = (p1, p2, bula) => math.round(math.chain(p1.score).subtract(p2.score).divide(bula).done(), 3);

const getDs = (p1, p2, p3, bula) => ({
	D12: D(p1, p2, bula),
	D13: D(p1, p3, bula),
	D23: D(p2, p3, bula)
});

const T = (p1, p2) => math.round(math.chain(p2.oldRating).subtract(p1.oldRating).multiply(MAGIC).divide(100).done(), 3);

const getTs = (p1, p2, p3) => ({
	T12: T(p1, p2),
	T13: T(p1, p3),
	T23: T(p2, p3)
});

const N = (p1, p2, bula) => (p1.score > p2.score ? bula : (p1.score < p2.score ? -bula : 0)) / 100;

const getNs = (p1, p2, p3, bula) => ({
	N12: N(p1, p2, bula),
	N13: N(p1, p3, bula),
	N23: N(p2, p3, bula)
});

const C = (c1, c2) => math.round(math.chain(c1).add(c2).divide(2).done());

const calculateChanges = (p1, p2, p3, bula) => {
	let D = getDs(p1, p2, p3, bula);
	let T = getTs(p1, p2, p3);
	let N = getNs(p1, p2, p3, bula);

	let C12 = D.D12 + T.T12 + N.N12;
	let C13 = D.D13 + T.T13 + N.N13;
	let C23 = D.D23 + T.T23 + N.N23;

	return {
		change1: C(C12, C13),
		change2: C(-C12, C23),
		change3: C(-C13, -C23)
	}
};

class PrefRating {
	constructor(player1, player2, player3, bula) {
		if (!(player1 instanceof PrefRatingPlayer)) throw new Error("Invalid player 1:", player1);
		if (!(player2 instanceof PrefRatingPlayer)) throw new Error("Invalid player 2:", player2);
		if (!(player3 instanceof PrefRatingPlayer)) throw new Error("Invalid player 3:", player3);
		if (!bula) throw new Error("No bula defined", bula);

		this.player1 = player1;
		this.player2 = player2;
		this.player3 = player3;
		this.bula = bula;

		let {change1, change2, change3} = calculateChanges(player1, player2, player3, bula);
		this.player1.setRatingChange(change1);
		this.player2.setRatingChange(change2);
		this.player3.setRatingChange(change3);

		return this;
	}

	getRatings() {
		return {
			bula: this.bula,
			player1: this.player1.getData(),
			player2: this.player2.getData(),
			player3: this.player3.getData()
		};
	}

	getPlayer1() {
		return this.player1;
	}

	getPlayer2() {
		return this.player2;
	}

	getPlayer3() {
		return this.player3;
	}

	getBula() {
		return this.bula;
	}
}

module.exports = PrefRating;
module.exports.PrefRatingPlayer = PrefRatingPlayer;
