const _ = require('lodash');
const expect = require('chai').expect;

const PrefRating = require('../lib/rating');
const PrefRatingPlayer = PrefRating.PrefRatingPlayer;

let p1 = new PrefRatingPlayer(1152, -238);
let p2 = new PrefRatingPlayer(1074, 112);
let p3 = new PrefRatingPlayer(986, 126);

describe('PrefRating tests', function () {
	it('PrefRating should exist', function () {
		expect(PrefRating).to.exist;
	});

	describe('PrefRating constructor tests', function () {
		let p1 = new PrefRatingPlayer(1152, -238);
		let p2 = new PrefRatingPlayer(1074, 112);
		let p3 = new PrefRatingPlayer(986, 126);
		it('contructor should create object', function () {
			expect(() => new PrefRating()).to.throw();
			expect(() => new PrefRating(p1)).to.throw();
			expect(() => new PrefRating(p1, p2)).to.throw();
			expect(() => new PrefRating(p1, p2, p3)).to.throw();
			expect(() => new PrefRating(p1, p2, p3, 60)).to.not.throw();
			expect(new PrefRating(p1, p2, p3, 60)).to.be.a('object');
		});
	});

	describe('PrefRating calculation tests 1', function () {
		let p1 = new PrefRatingPlayer(1152, -238);
		let p2 = new PrefRatingPlayer(1074, 112);
		let p3 = new PrefRatingPlayer(986, 126);
		let rating = new PrefRating(p1, p2, p3, 60);
		it('getBula should return 60', function () {
			expect(rating.getBula()).to.equal(60);
		});
		it('getPlayer1().getNewRating should return 1142', function () {
			expect(rating.getPlayer1().getNewRating()).to.equal(1142);
		});
		it('getPlayer1().getChange should return -10', function () {
			expect(rating.getPlayer1().getChange()).to.equal(-10);
		});
		it('getPlayer2().getNewRating should return 1077', function () {
			expect(rating.getPlayer2().getNewRating()).to.equal(1077);
		});
		it('getPlayer2().getChange should return 3', function () {
			expect(rating.getPlayer2().getChange()).to.equal(3);
		});
		it('getPlayer3().getNewRating should return 993', function () {
			expect(rating.getPlayer3().getNewRating()).to.equal(993);
		});
		it('getPlayer3().getChange should return 7', function () {
			expect(rating.getPlayer3().getChange()).to.equal(7);
		});
		it('getRatings should create object', function () {
			expect(rating.getRatings()).to.be.a('object');
		});
		it('getRatings should work properly', function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					player1: {score: -238, oldRating: 1152, newRating: 1142, change: -10},
					player2: {score: 112, oldRating: 1074, newRating: 1077, change: 3},
					player3: {score: 126, oldRating: 986, newRating: 993, change: 7}
				}
			);
		});
	});

	describe('PrefRating calculation tests 2', function () {
		let p1 = new PrefRatingPlayer(986, 126);
		let p2 = new PrefRatingPlayer(1074, 112);
		let p3 = new PrefRatingPlayer(1152, -238);
		let rating = new PrefRating(p1, p2, p3, 60);

		it('getRatings should work properly', function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					player1: {score: 126, oldRating: 986, newRating: 993, change: 7},
					player2: {score: 112, oldRating: 1074, newRating: 1077, change: 3},
					player3: {score: -238, oldRating: 1152, newRating: 1142, change: -10}
				}
			);
		});
	});

	describe('PrefRating calculation tests 3', function () {
		let p1 = new PrefRatingPlayer(986, 120);
		let p2 = new PrefRatingPlayer(1074, 120);
		let p3 = new PrefRatingPlayer(1152, -240);
		let rating = new PrefRating(p1, p2, p3, 60);

		it('getRatings should work properly', function () {
			expect(rating.getRatings()).to.deep.equal(
				{
					bula: 60,
					player1: {score: 120, oldRating: 986, newRating: 993, change: 7},
					player2: {score: 120, oldRating: 1074, newRating: 1077, change: 3},
					player3: {score: -240, oldRating: 1152, newRating: 1142, change: -10}
				}
			);
		});
	});

});