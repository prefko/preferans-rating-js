const _ = require('lodash');
const expect = require('chai').expect;

const Player = require('../lib/player');

describe('Player tests', function () {
	it('Player should exist', function () {
		expect(Player).to.exist;
	});

	describe('Player constructor tests', function () {
		it('contructor should create object', function () {
			expect(() => new Player()).to.throw();
			expect(() => new Player(50)).to.not.throw();
			expect(new Player(50)).to.be.a('object');
		});
	});

	describe('Player setter tests', function () {
		it('setNewRating should work properly', function () {
			expect(() => new Player(0).setNewRating()).to.throw();
			expect(() => new Player(0).setNewRating(1100)).to.not.throw();
			expect(new Player(0).setNewRating(1100)).to.be.a('object');
			expect(new Player(0).setNewRating(1100).getChange()).to.equal(100);
			expect(new Player(0).setNewRating(1100).getNewRating()).to.equal(1100);
		});
		it('setRatingChange should work properly', function () {
			expect(() => new Player(0).setRatingChange()).to.throw();
			expect(() => new Player(0).setRatingChange(100)).to.not.throw();
			expect(new Player(0).setRatingChange(100)).to.be.a('object');
			expect(new Player(0).setRatingChange(100).getChange()).to.equal(100);
			expect(new Player(0).setRatingChange(100).getNewRating()).to.equal(1100);
		});
	});

	describe('Player getters tests', function () {
		let p1 = new Player(50).setRatingChange(100);
		let p2 = new Player(200, 1100).setRatingChange(-100);

		it('getScore should work properly', function () {
			expect(p1.getScore()).to.equal(50);
			expect(p2.getScore()).to.equal(200);
		});
		it('getOldRating should work properly', function () {
			expect(p1.getOldRating()).to.equal(1000);
			expect(p2.getOldRating()).to.equal(1100);
		});
		it('getNewRating should work properly', function () {
			expect(p1.getNewRating()).to.equal(1100);
			expect(p2.getNewRating()).to.equal(1000);
		});
		it('getChange should work properly', function () {
			expect(p1.getChange()).to.equal(100);
			expect(p2.getChange()).to.equal(-100);
		});
		it('getData should work properly', function () {
			expect(p1.getData()).to.deep.equal({score: 50, oldRating: 1000, newRating: 1100, change: 100});
			expect(p2.getData()).to.deep.equal({score: 200, oldRating: 1100, newRating: 1000, change: -100});
		});
	});
});