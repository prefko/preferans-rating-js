import {expect} from 'chai';
import PrefRatingPlayer from '../src/ratingPlayer';
import PrefRating from '../src/rating';

describe("PrefRating tests", () => {
	it("PrefRating should exist", () => {
		expect(PrefRating).to.exist;
	});

	describe("PrefRating constructor tests", () => {
		const p1 = new PrefRatingPlayer("p1", 1152, -238);
		const p2 = new PrefRatingPlayer("p1", 1074, 112);
		const p3 = new PrefRatingPlayer("p1", 986, 126);
		it("contructor should create object", () => {
			expect(() => new PrefRating(p1, p2, p3, 60)).to.not.throw();
			expect(new PrefRating(p1, p2, p3, 60)).to.be.a("object");
		});
	});

	describe("PrefRating calculation tests 1", () => {
		const p1 = new PrefRatingPlayer("p1", 1152, -238);
		const p2 = new PrefRatingPlayer("p2", 1074, 112);
		const p3 = new PrefRatingPlayer("p3", 986, 126);
		let rating = new PrefRating(p1, p2, p3, 60);
		it("ratings.getObject() should create object", () => {
			expect(rating.getObject()).to.be.a("object");
		});
		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: -238, oldRating: 1152, rating: 1142, change: -10},
					p2: {username: "p2", score: 112, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: 126, oldRating: 986, rating: 993, change: 7}
				}
			);
		});
	});

	describe("PrefRating calculation tests 2", () => {
		const p1 = new PrefRatingPlayer("p1", 986, 126);
		const p2 = new PrefRatingPlayer("p2", 1074, 112);
		const p3 = new PrefRatingPlayer("p3", 1152, -238);
		let rating = new PrefRating(p1, p2, p3, 60);

		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 126, oldRating: 986, rating: 993, change: 7},
					p2: {username: "p2", score: 112, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: -238, oldRating: 1152, rating: 1142, change: -10}
				}
			);
		});
	});

	describe("PrefRating calculation tests 3", () => {
		const p1 = new PrefRatingPlayer("p1", 986, 120);
		const p2 = new PrefRatingPlayer("p2", 1074, 120);
		const p3 = new PrefRatingPlayer("p3", 1152, -240);
		let rating = new PrefRating(p1, p2, p3, 60);

		it("ratings.getObject() should work properly", () => {
			expect(rating.getObject()).to.deep.equal(
				{
					bula: 60,
					p1: {username: "p1", score: 120, oldRating: 986, rating: 993, change: 7},
					p2: {username: "p2", score: 120, oldRating: 1074, rating: 1077, change: 3},
					p3: {username: "p3", score: -240, oldRating: 1152, rating: 1142, change: -10}
				}
			);
		});
	});

});