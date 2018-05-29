#!/usr/bin/env node
'use strict';

const _ = require('lodash');
const math = require('mathjs');
const Player = require('./player');

const MAGIC = 2.8;

const d = (p1, p2, bula) => {
	return math.round(
		math.chain(p1.score)
			.subtract(p2.score)
			.divide(bula)
			.done(), 3);
};

const T = (p1, p2) => {
	return math.round(
		math.chain(p2.oldRating)
			.subtract(p1.oldRating)
			.multiply(MAGIC)
			.divide(100)
			.done(), 3);
};

const N = (p1, p2, bula) => {
	let win = bula / 100;
	return p1.score > p2.score ? win : (p1.score < p2.score ? -win : 0);
};

class Rating {
	constructor(player1, player2, player3, bula) {
		if (!(player1 instanceof Player)) throw new Error("Invalid player 1: " + player1);
		if (!(player2 instanceof Player)) throw new Error("Invalid player 2: " + player2);
		if (!(player3 instanceof Player)) throw new Error("Invalid player 3: " + player3);

		this.players = {};

		this.player1 = player1;
		this.player2 = player2;
		this.player3 = player3;
		this.bula = bula;

		let d12 = d(this.player1, this.player2, bula);
		let d13 = d(this.player1, this.player3, bula);
		let d23 = d(this.player2, this.player3, bula);

		let T12 = T(this.player1, this.player2);
		let T13 = T(this.player1, this.player3);
		let T23 = T(this.player2, this.player3);

		let N12 = N(this.player1, this.player2, bula);
		let N13 = N(this.player1, this.player3, bula);
		let N23 = N(this.player2, this.player3, bula);

		let C12 = d12 + T12 + N12;
		let C13 = d13 + T13 + N13;
		let C23 = d23 + T23 + N23;

		let C1 = math.round(
			math.chain(C12)
				.add(C13)
				.divide(2)
				.done());
		let C2 = math.round(
			math.chain(-C12)
				.add(C23)
				.divide(2)
				.done());
		let C3 = math.round(
			math.chain(-C13)
				.add(-C23)
				.divide(2)
				.done());

		this.player1.setRatingChange(C1);
		this.player2.setRatingChange(C2);
		this.player3.setRatingChange(C3);

		return this;
	}

	getRating() {
		return {
			bula: bula,
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

module.exports = Rating;
module.exports.Player = Player;
