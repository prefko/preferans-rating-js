const _ = require('lodash');
const expect = require('chai').expect;

const PrefRatingPlayer = require('../lib/player');

describe('PrefRatingPlayer tests', function () {
	it('PrefRatingPlayer should exist', function () {
		expect(PrefRatingPlayer).to.exist;
	});

	describe('PrefRatingPlayer constructor tests', function () {
		it('contructor should create object', function () {
			expect(() => new PrefRatingPlayer()).to.throw();
			expect(() => new PrefRatingPlayer(1000)).to.throw();
			expect(() => new PrefRatingPlayer(1000, 50)).to.not.throw();
			expect(new PrefRatingPlayer(1000, 50)).to.be.a('object');
		});
	});

	describe('PrefRatingPlayer setter tests', function () {
		it('setNewRating should work properly', function () {
			expect(() => new PrefRatingPlayer(1000, 0).setNewRating()).to.throw();
			expect(() => new PrefRatingPlayer(1000, 0).setNewRating(1100)).to.not.throw();
			expect(new PrefRatingPlayer(1000, 0).setNewRating(1100)).to.be.a('object');
			expect(new PrefRatingPlayer(1000, 0).setNewRating(1100).getChange()).to.equal(100);
			expect(new PrefRatingPlayer(1000, 0).setNewRating(1100).getNewRating()).to.equal(1100);
		});
		it('setRatingChange should work properly', function () {
			expect(() => new PrefRatingPlayer(1000, 0).setRatingChange()).to.throw();
			expect(() => new PrefRatingPlayer(1000, 0).setRatingChange(100)).to.not.throw();
			expect(new PrefRatingPlayer(1000, 0).setRatingChange(100)).to.be.a('object');
			expect(new PrefRatingPlayer(1000, 0).setRatingChange(100).getChange()).to.equal(100);
			expect(new PrefRatingPlayer(1000, 0).setRatingChange(100).getNewRating()).to.equal(1100);
		});
	});

	describe('PrefRatingPlayer getters tests', function () {
		let p1 = new PrefRatingPlayer(1000, 50).setRatingChange(100);
		let p2 = new PrefRatingPlayer(1100, 200).setRatingChange(-100);

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